import { cloneStyledElement } from '$stylist/domain/function/clone/styled-element';

/** Longest canvas side every browser still encodes. */
const MAX_SIDE = 8192;

/**
 * Paints `element` to a PNG without a dependency: its styled clone is laid out inside an SVG
 * `foreignObject` and drawn on a canvas. `area` (CSS pixels, relative to the element) crops
 * the picture, e.g. to the component bounds. Web fonts that the image cannot load fall back
 * to the system font; cross-origin images keep only their box.
 */
export async function captureElementImage(
	element: Element,
	area?: Pick<DOMRect, 'x' | 'y' | 'width' | 'height'>,
	scale = element.ownerDocument.defaultView?.devicePixelRatio ?? 1
): Promise<Blob> {
	const box = element.getBoundingClientRect();
	const width = Math.max(1, Math.ceil(box.width));
	const height = Math.max(1, Math.ceil(box.height));
	const clip = area ?? { x: 0, y: 0, width, height };
	const clone = await cloneStyledElement(element);
	clone.setAttribute('style', `${clone.getAttribute('style') ?? ''}margin:0;`);
	const markup = new XMLSerializer().serializeToString(clone);
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
		`<foreignObject x="0" y="0" width="100%" height="100%">${markup}</foreignObject></svg>`;
	const image = new Image();
	image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	await image.decode();
	const ratio = Math.min(scale, MAX_SIDE / clip.width, MAX_SIDE / clip.height);
	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.round(clip.width * ratio));
	canvas.height = Math.max(1, Math.round(clip.height * ratio));
	const context = canvas.getContext('2d');
	if (!context) throw new Error('Canvas 2D is not available.');
	context.scale(ratio, ratio);
	context.drawImage(image, -clip.x, -clip.y, width, height);
	return new Promise((resolve, reject) =>
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('Unable to encode the screenshot.'))),
			'image/png'
		)
	);
}
