/**
 * Bounds of what `element` actually paints (its visible descendants), relative to the
 * element and grown by `padding`, clamped to the element. Without visible descendants
 * the whole element is the area.
 */
export function resolveContentArea(
	element: Element,
	padding = 16
): Pick<DOMRect, 'x' | 'y' | 'width' | 'height'> {
	const box = element.getBoundingClientRect();
	let left = Infinity;
	let top = Infinity;
	let right = -Infinity;
	let bottom = -Infinity;
	for (const child of Array.from(element.querySelectorAll('*'))) {
		const rect = child.getBoundingClientRect();
		if (!rect.width || !rect.height) continue;
		left = Math.min(left, rect.left);
		top = Math.min(top, rect.top);
		right = Math.max(right, rect.right);
		bottom = Math.max(bottom, rect.bottom);
	}
	if (left === Infinity) return { x: 0, y: 0, width: box.width, height: box.height };
	left = Math.max(box.left, left - padding);
	top = Math.max(box.top, top - padding);
	right = Math.min(box.right, right + padding);
	bottom = Math.min(box.bottom, bottom + padding);
	return {
		x: left - box.left,
		y: top - box.top,
		width: Math.max(1, right - left),
		height: Math.max(1, bottom - top)
	};
}
