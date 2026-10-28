import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DomainMenu from '$stylist/domain/component/molecule/domain-menu/index.svelte';

const environment = vi.hoisted(() => ({ DOMAIN_REGIME: 'dev' }));
vi.mock('$stylist/domain/const/value/domain-regime', () => environment);
afterEach(() => {
	cleanup();
	environment.DOMAIN_REGIME = 'dev';
});

describe('domain menu', () => {
	it('places the component catalog before the playground and invokes separate actions', async () => {
		const onComponentsToggle = vi.fn();
		const onDomainToggle = vi.fn();
		const view = render(DomainMenu, {
			componentsVisible: true,
			domainVisible: false,
			onComponentsToggle,
			onDomainToggle,
			onManifestReload: vi.fn()
		});
		const components = view.getByRole('button', { name: 'Show components' });
		const playground = view.getByRole('button', { name: 'Show playground' });
		expect(
			components.compareDocumentPosition(playground) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
		expect(components.getAttribute('aria-pressed')).toBe('true');
		expect(view.getByRole('button', { name: 'Reload manifest' })).toBeTruthy();
		await fireEvent.click(components);
		await fireEvent.click(playground);
		expect(onComponentsToggle).toHaveBeenCalledOnce();
		expect(onDomainToggle).toHaveBeenCalledOnce();
	});
	it('hides manifest reload in production even when a callback is supplied', () => {
		environment.DOMAIN_REGIME = 'prod';
		const view = render(DomainMenu, { onManifestReload: vi.fn() });
		expect(view.queryByRole('button', { name: 'Reload manifest' })).toBeNull();
	});
});
