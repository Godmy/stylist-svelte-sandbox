import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DomainSettings from '$stylist/domain/component/organism/domain-settings/index.svelte';
import DomainExplorer from '$stylist/domain/component/organism/domain-explorer/index.svelte';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('mobile playground panels', () => {
	it('shows Settings with an accessible back arrow and supports swipe dismissal', async () => {
		const onClose = vi.fn();
		const view = render(DomainSettings, { open: true, modal: true, onClose });
		expect(view.getByRole('heading', { name: 'Settings' })).toBeTruthy();
		await fireEvent.click(view.getByRole('button', { name: 'Back from settings' }));
		expect(onClose).toHaveBeenCalledOnce();
		const panel = view.getByRole('dialog', { name: 'Settings' });
		await fireEvent.touchStart(panel, { touches: [{ identifier: 1, clientX: 250, clientY: 100 }] });
		await fireEvent.touchEnd(panel, {
			touches: [],
			changedTouches: [{ identifier: 1, clientX: 100, clientY: 105 }]
		});
		expect(onClose).toHaveBeenCalledTimes(2);
	});
	it('keeps the desktop close button and ignores desktop swipes', async () => {
		const onClose = vi.fn();
		const view = render(DomainSettings, { open: true, onClose });
		expect(view.getByRole('button', { name: 'Close settings panel' }).textContent?.trim()).toBe(
			'Close'
		);
		const panel = view.getByRole('dialog', { name: 'Domain settings' });
		await fireEvent.touchStart(panel, { touches: [{ identifier: 1, clientX: 250, clientY: 100 }] });
		await fireEvent.touchEnd(panel, {
			touches: [],
			changedTouches: [{ identifier: 1, clientX: 100, clientY: 105 }]
		});
		expect(onClose).not.toHaveBeenCalled();
	});
	it('opens Navigation on mobile and closes it with the back arrow or left swipe', async () => {
		const matchMedia = window.matchMedia;
		vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
			...matchMedia(query),
			matches: query.replace(/\s/g, '') === '(max-width:840px)'
		}));
		const view = render(DomainExplorer, { tree: {} });
		await fireEvent.click(view.getByRole('button', { name: 'Choose component' }));
		const panel = view.getByRole('dialog', { name: 'Navigation' });
		expect(view.getByRole('heading', { name: 'Navigation' })).toBeTruthy();
		expect(panel.hasAttribute('data-open')).toBe(true);
		await fireEvent.click(view.getByRole('button', { name: 'Back from navigation' }));
		expect(panel.hasAttribute('data-open')).toBe(false);
		await fireEvent.click(view.getByRole('button', { name: 'Choose component' }));
		await fireEvent.touchStart(panel, { touches: [{ identifier: 1, clientX: 250, clientY: 100 }] });
		await fireEvent.touchEnd(panel, {
			touches: [],
			changedTouches: [{ identifier: 1, clientX: 100, clientY: 105 }]
		});
		expect(panel.hasAttribute('data-open')).toBe(false);
	});
});
