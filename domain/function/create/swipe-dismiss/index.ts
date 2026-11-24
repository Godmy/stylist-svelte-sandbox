/** Dismiss an enabled mobile panel with a deliberate left swipe, preserving vertical scrolling. */
export function createSwipeDismiss(isEnabled: () => boolean, dismiss: () => void) {
	let start: { x: number; y: number; identifier: number } | undefined;
	return {
		ontouchstart(event: TouchEvent) {
			start = undefined;
			if (!isEnabled() || event.touches.length !== 1) return;
			if (
				event.target instanceof Element &&
				event.target.closest('input, textarea, select, [contenteditable], [role="slider"]')
			)
				return;
			const touch = event.touches[0];
			start = { x: touch.clientX, y: touch.clientY, identifier: touch.identifier };
		},
		ontouchend(event: TouchEvent) {
			const origin = start;
			start = undefined;
			if (!origin || !isEnabled() || event.touches.length) return;
			const touch = Array.from(event.changedTouches).find(
				(touch) => touch.identifier === origin.identifier
			);
			if (!touch) return;
			const distance = origin.x - touch.clientX;
			if (distance >= 64 && distance > Math.abs(touch.clientY - origin.y) * 1.5) dismiss();
		},
		ontouchcancel() {
			start = undefined;
		}
	};
}
