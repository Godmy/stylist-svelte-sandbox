import { describe, expect, it, vi } from 'vitest';
import { createSwipeDismiss } from '$stylist/domain/function/create/swipe-dismiss';

const touch = (x: number, y: number) => ({ identifier: 1, clientX: x, clientY: y });
const event = (touches: ReturnType<typeof touch>[], target: EventTarget = document.body) =>
	({ touches, changedTouches: touches, target }) as unknown as TouchEvent;

describe('mobile panel swipe dismissal', () => {
	it('dismisses a deliberate left swipe', () => {
		const dismiss = vi.fn();
		const swipe = createSwipeDismiss(() => true, dismiss);
		swipe.ontouchstart(event([touch(240, 100)]));
		swipe.ontouchend({ ...event([]), changedTouches: [touch(100, 110)] } as unknown as TouchEvent);
		expect(dismiss).toHaveBeenCalledOnce();
	});
	it.each([
		[300, 100],
		[210, 100],
		[100, 300]
	])('preserves right swipes, taps and vertical scrolling (%i, %i)', (x, y) => {
		const dismiss = vi.fn();
		const swipe = createSwipeDismiss(() => true, dismiss);
		swipe.ontouchstart(event([touch(240, 100)]));
		swipe.ontouchend({ ...event([]), changedTouches: [touch(x, y)] } as unknown as TouchEvent);
		expect(dismiss).not.toHaveBeenCalled();
	});
	it('ignores gestures on controls, multiple touches and canceled gestures', () => {
		const dismiss = vi.fn();
		const swipe = createSwipeDismiss(() => true, dismiss);
		swipe.ontouchstart(event([touch(240, 100)], document.createElement('input')));
		swipe.ontouchend({ ...event([]), changedTouches: [touch(100, 100)] } as unknown as TouchEvent);
		swipe.ontouchstart(event([touch(240, 100), touch(250, 100)]));
		swipe.ontouchend({ ...event([]), changedTouches: [touch(100, 100)] } as unknown as TouchEvent);
		swipe.ontouchstart(event([touch(240, 100)]));
		swipe.ontouchcancel();
		swipe.ontouchend({ ...event([]), changedTouches: [touch(100, 100)] } as unknown as TouchEvent);
		expect(dismiss).not.toHaveBeenCalled();
	});
	it('does not dismiss when disabled, including after a gesture starts', () => {
		const dismiss = vi.fn();
		let enabled = false;
		const swipe = createSwipeDismiss(() => enabled, dismiss);
		swipe.ontouchstart(event([touch(240, 100)]));
		swipe.ontouchend({ ...event([]), changedTouches: [touch(100, 100)] } as unknown as TouchEvent);
		enabled = true;
		swipe.ontouchstart(event([touch(240, 100)]));
		enabled = false;
		swipe.ontouchend({ ...event([]), changedTouches: [touch(100, 100)] } as unknown as TouchEvent);
		expect(dismiss).not.toHaveBeenCalled();
	});
});
