import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { captureElementImage } from '$stylist/domain/function/capture/element-image';

describe('captureElementImage', () => {
	// jsdom has no image decoding: a stub to spy on.
	beforeEach(() => {
		Object.defineProperty(HTMLImageElement.prototype, 'decode', {
			configurable: true,
			writable: true,
			value: () => Promise.resolve()
		});
	});
	afterEach(() => {
		delete (HTMLImageElement.prototype as Partial<HTMLImageElement>).decode;
		vi.restoreAllMocks();
		document.body.replaceChildren();
	});

	it('draws the styled clone through an SVG image and crops it to the area', async () => {
		const element = document.createElement('div');
		element.innerHTML = '<a href="#">Read the guide</a>';
		document.body.append(element);
		element.getBoundingClientRect = () => ({ width: 800, height: 600 }) as DOMRect;
		let source = '';
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockImplementation(function (
			this: HTMLImageElement
		) {
			source = this.src;
			return Promise.resolve();
		});
		const drawImage = vi.fn();
		const scale = vi.fn();
		let size: number[] = [];
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
			this: HTMLCanvasElement
		) {
			size = [this.width, this.height];
			return { drawImage, scale } as unknown as CanvasRenderingContext2D;
		} as unknown as HTMLCanvasElement['getContext']);
		const png = new Blob(['png'], { type: 'image/png' });
		vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => callback(png));

		const blob = await captureElementImage(element, { x: 10, y: 20, width: 100, height: 50 }, 2);

		expect(blob).toBe(png);
		expect(size).toEqual([200, 100]);
		expect(scale).toHaveBeenCalledWith(2, 2);
		expect(drawImage).toHaveBeenCalledWith(expect.any(HTMLImageElement), -10, -20, 800, 600);
		const svg = decodeURIComponent(source.replace(/^data:image\/svg\+xml;charset=utf-8,/, ''));
		expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="800" height="600">/);
		expect(svg).toContain('<foreignObject');
		expect(svg).toContain('xmlns="http://www.w3.org/1999/xhtml"');
		expect(svg).toContain('Read the guide');
	});

	it('reports a canvas that cannot be painted', async () => {
		const element = document.createElement('div');
		document.body.append(element);
		vi.spyOn(HTMLImageElement.prototype, 'decode').mockResolvedValue();
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
		await expect(captureElementImage(element)).rejects.toThrow('Canvas 2D is not available.');
	});
});
