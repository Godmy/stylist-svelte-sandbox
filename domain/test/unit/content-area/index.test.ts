import { describe, expect, it } from 'vitest';
import { resolveContentArea } from '$stylist/domain/function/resolve/content-area';

function place(element: Element, left: number, top: number, width: number, height: number) {
	element.getBoundingClientRect = () =>
		({
			left,
			top,
			width,
			height,
			right: left + width,
			bottom: top + height,
			x: left,
			y: top
		}) as DOMRect;
}

describe('resolveContentArea', () => {
	it('crops to the painted descendants with padding, clamped to the element', () => {
		const canvas = document.createElement('div');
		canvas.innerHTML = '<span></span><b></b><i></i>';
		const [span, bold, hidden] = Array.from(canvas.children);
		place(canvas, 100, 50, 800, 600);
		place(span, 124, 74, 100, 20);
		place(bold, 130, 120, 40, 30);
		place(hidden, 0, 0, 0, 0);
		expect(resolveContentArea(canvas)).toEqual({ x: 8, y: 8, width: 132, height: 108 });
		place(span, 102, 52, 1000, 20);
		expect(resolveContentArea(canvas, 16)).toEqual({ x: 0, y: 0, width: 800, height: 116 });
	});

	it('falls back to the whole element without visible descendants', () => {
		const canvas = document.createElement('div');
		place(canvas, 10, 10, 300, 200);
		expect(resolveContentArea(canvas)).toEqual({ x: 0, y: 0, width: 300, height: 200 });
	});
});
