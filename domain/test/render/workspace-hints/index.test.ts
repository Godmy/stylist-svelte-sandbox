import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import WorkspaceHints from '../../../component/molecule/workspace-hints/index.svelte';

afterEach(() => {
	document.querySelector('.hint-test-root')?.remove();
});

describe('workspace icon hints', () => {
	it('removes native HTML and SVG hints while preserving the control label', async () => {
		const root = document.createElement('div');
		root.className = 'hint-test-root';
		root.innerHTML =
			'<button title="design-token" aria-label="design-token"><svg><title>box</title><rect width="10" height="10" /></svg></button>';
		document.body.append(root);
		const button = root.querySelector('button')!;
		const { unmount } = render(WorkspaceHints, { root: '.hint-test-root' });

		expect(button.hasAttribute('title')).toBe(false);
		expect(button.querySelector('svg title')).toBeNull();
		expect(button.getAttribute('aria-label')).toBe('design-token');
		await fireEvent.pointerOver(button.querySelector('rect')!);
		expect(screen.getByRole('tooltip').textContent).toContain('design-token');
		expect(button.getAttribute('aria-describedby')).toBe(screen.getByRole('tooltip').id);

		// Icons load asynchronously and may replace their SVG after initial mount.
		button.querySelector('svg')!.innerHTML = '<title>box</title><path d="M0 0h10" />';
		await waitFor(() => expect(button.querySelector('svg title')).toBeNull());
		expect(screen.getByRole('tooltip').textContent).toContain('design-token');
		await fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('tooltip')).toBeNull();
		expect(button.hasAttribute('aria-describedby')).toBe(false);

		unmount();
		expect(button.getAttribute('title')).toBe('design-token');
		expect(button.querySelector('svg title')?.textContent).toBe('box');
	});

	it('preserves SVG titles for standalone accessible illustrations', () => {
		const root = document.createElement('div');
		root.className = 'hint-test-root';
		root.innerHTML = '<svg role="img"><title>Diagram</title></svg>';
		document.body.append(root);
		render(WorkspaceHints, { root: '.hint-test-root' });
		expect(root.querySelector('title')?.textContent).toBe('Diagram');
	});
});
