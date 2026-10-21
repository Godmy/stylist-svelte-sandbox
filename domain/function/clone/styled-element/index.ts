const SKIPPED = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'TEMPLATE', 'NOSCRIPT']);

function inlineStyle(target: HTMLElement | SVGElement, style: CSSStyleDeclaration) {
	let text = '';
	for (let index = 0; index < style.length; index += 1) {
		const name = style.item(index);
		text += `${name}:${style.getPropertyValue(name)};`;
	}
	target.setAttribute('style', text);
}

/** `::before` / `::after` are not cloneable nodes: they become real spans with the same style. */
function clonePseudo(source: Element, target: Element, pseudo: '::before' | '::after') {
	const view = source.ownerDocument.defaultView;
	const style = view?.getComputedStyle(source, pseudo);
	const content = style?.getPropertyValue('content');
	if (!style || !content || content === 'none' || content === 'normal') return;
	const span = target.ownerDocument.createElement('span');
	inlineStyle(span, style);
	span.textContent = /^(["']).*\1$/.test(content) ? content.slice(1, -1) : '';
	if (pseudo === '::before') target.prepend(span);
	else target.append(span);
}

async function inlineImage(target: HTMLImageElement, source: HTMLImageElement) {
	if (!source.currentSrc || source.currentSrc.startsWith('data:')) return;
	try {
		const blob = await (await fetch(source.currentSrc)).blob();
		target.src = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(String(reader.result));
			reader.onerror = () => reject(reader.error);
			reader.readAsDataURL(blob);
		});
		target.removeAttribute('srcset');
	} catch {
		// A cross-origin image stays a reference: the screenshot shows its box.
	}
}

/**
 * Deep clone with every computed style inlined, so the copy paints the same outside its
 * document (e.g. inside an SVG `foreignObject`). Form state, canvases, same-origin images
 * and `::before` / `::after` content are carried over; scripts and stylesheets are dropped.
 */
export async function cloneStyledElement<T extends Element>(source: T): Promise<T> {
	// Tag names, not `instanceof`: the source usually lives in another realm (the preview iframe).
	const view = source.ownerDocument.defaultView;
	const tag = source.tagName.toUpperCase();
	if (tag === 'CANVAS') {
		const image = source.ownerDocument.createElement('img');
		try {
			image.src = (source as unknown as HTMLCanvasElement).toDataURL();
		} catch {
			// A tainted canvas cannot be read: keep an empty box of the same size.
		}
		if (view) inlineStyle(image, view.getComputedStyle(source));
		return image as unknown as T;
	}
	const target = source.cloneNode(false) as T;
	if (view) inlineStyle(target as unknown as HTMLElement, view.getComputedStyle(source));
	for (const child of Array.from(source.childNodes)) {
		if (child.nodeType === Node.TEXT_NODE) target.append(child.cloneNode());
		else if (
			child.nodeType === Node.ELEMENT_NODE &&
			!SKIPPED.has((child as Element).tagName.toUpperCase())
		)
			target.append(await cloneStyledElement(child as Element));
	}
	clonePseudo(source, target, '::before');
	clonePseudo(source, target, '::after');
	if (tag === 'INPUT') {
		const input = source as unknown as HTMLInputElement;
		target.setAttribute('value', input.value);
		target.toggleAttribute('checked', input.checked);
	} else if (tag === 'TEXTAREA') {
		target.textContent = (source as unknown as HTMLTextAreaElement).value;
	} else if (tag === 'SELECT') {
		const selected = (source as unknown as HTMLSelectElement).selectedIndex;
		target
			.querySelectorAll('option')
			.forEach((option, index) => option.toggleAttribute('selected', index === selected));
	} else if (tag === 'IMG') {
		await inlineImage(target as unknown as HTMLImageElement, source as unknown as HTMLImageElement);
	}
	return target;
}
