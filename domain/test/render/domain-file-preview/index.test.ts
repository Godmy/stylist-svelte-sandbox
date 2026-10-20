import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DomainFilePreview from '../../../component/organism/domain-file-preview/index.svelte';
import ButtonStory from '$stylist/html/component/atom/button/index.story';
import { captureElementImage } from '$stylist/domain/function/capture/element-image';

vi.mock('$stylist/domain/function/capture/element-image', () => ({
	captureElementImage: vi.fn(async () => new Blob(['png'], { type: 'image/png' }))
}));

const storyPath = '/src/lib/html/component/atom/button/index.story.ts';

function stubResizeObserver() {
	vi.stubGlobal(
		'ResizeObserver',
		class {
			observe() {}
			disconnect() {}
		}
	);
}

describe('story navigation', () => {
	afterEach(() => vi.unstubAllGlobals());
	it('waits for a story path when the previous module is a story contract', async () => {
		stubResizeObserver();
		const view = render(DomainFilePreview, {
			previewMode: 'story',
			storyPreviewComponent: ButtonStory
		});
		expect(view.container.querySelector('iframe')).toBeNull();
		await view.rerender({
			previewMode: 'story',
			storyPreviewComponent: ButtonStory,
			storyPath
		});
		expect(view.container.querySelector('iframe')?.getAttribute('src')).toContain(
			'html%2Fcomponent%2Fatom%2Fbutton%2Findex.story.ts'
		);
		expect(view.container.querySelector('[aria-label="Preview appearance"]')).toBeTruthy();
		await view.rerender({
			previewMode: 'story',
			storyPreviewComponent: ButtonStory,
			storyPath: ''
		});
		expect(view.container.querySelector('iframe')).toBeNull();
	});
});

describe('story panel', () => {
	beforeEach(stubResizeObserver);
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('puts the title above the controls, to the right of the preview', () => {
		const view = render(DomainFilePreview, {
			previewMode: 'story',
			storyPreviewComponent: ButtonStory,
			storyPath
		});
		const shell = view.container.querySelector('.story-preview-shell--controls')!;
		const [preview, panel] = Array.from(shell.children);
		expect(preview.querySelector('iframe')).toBeTruthy();
		expect(panel.matches('aside.story-panel')).toBe(true);
		const title = screen.getByRole('heading', { level: 2, name: 'Button' });
		const controls = panel.querySelector('.c-story-controls')!;
		expect(title.compareDocumentPosition(controls) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(screen.getByText('html / atom / button')).toBeTruthy();
	});

	it('uses the story title and description when the story has them', () => {
		render(DomainFilePreview, {
			previewMode: 'story',
			storyPreviewComponent: {
				...ButtonStory,
				title: 'Submit button',
				description: 'Sends the form.'
			},
			storyPath
		});
		expect(screen.getByRole('heading', { level: 2, name: 'Submit button' })).toBeTruthy();
		expect(screen.getByText('Sends the form.')).toBeTruthy();
	});

	it('hides the panel in fullscreen behind a bookmark tab that opens it', async () => {
		const view = render(DomainFilePreview, {
			previewMode: 'story',
			storyPreviewComponent: ButtonStory,
			storyPath,
			fullscreen: true
		});
		const panel = view.container.querySelector('aside.story-panel') as HTMLElement;
		expect(panel.hidden).toBe(true);
		const tab = screen.getByRole('button', { name: 'Show story controls' });
		expect(tab.getAttribute('aria-controls')).toBe(panel.id);
		expect(tab.getAttribute('aria-expanded')).toBe('false');
		await fireEvent.click(tab);
		expect(panel.hidden).toBe(false);
		expect(tab.getAttribute('aria-expanded')).toBe('true');
		expect(screen.getByRole('button', { name: 'Hide story controls' })).toBe(tab);
		// The drawer still edits the story.
		expect(panel.querySelector('.c-story-controls')).toBeTruthy();
		await view.rerender({ fullscreen: false });
		expect(screen.queryByRole('button', { name: /story controls/ })).toBeNull();
		expect(panel.hidden).toBe(false);
		await view.rerender({ fullscreen: true });
		expect(panel.hidden).toBe(true);
	});

	it('saves the painted component as a PNG with one click', async () => {
		const createObjectURL = vi.fn(() => 'blob:story');
		vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() }));
		const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
		const view = render(DomainFilePreview, {
			previewMode: 'story',
			storyPreviewComponent: ButtonStory,
			storyPath
		});
		const button = screen.getByRole('button', { name: 'Save component screenshot' });
		expect((button as HTMLButtonElement).disabled).toBe(true);
		// jsdom does not load the preview route: give the frame a painted story canvas.
		const frame = view.container.querySelector('iframe')!;
		const frameDocument = document.implementation.createHTMLDocument('preview');
		const canvas = frameDocument.createElement('div');
		canvas.className = 'c-story-canvas';
		frameDocument.body.append(canvas);
		const frameWindow = { postMessage: vi.fn() } as unknown as Window;
		Object.defineProperty(frame, 'contentDocument', { value: frameDocument });
		Object.defineProperty(frame, 'contentWindow', { value: frameWindow });
		window.dispatchEvent(
			new MessageEvent('message', {
				data: { type: 'stylist:story-ready' },
				origin: window.location.origin,
				source: frameWindow
			})
		);
		await vi.waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
		await fireEvent.click(button);
		await vi.waitFor(() => expect(click).toHaveBeenCalled());
		expect(vi.mocked(captureElementImage).mock.calls[0][0]).toBe(canvas);
		const link = click.mock.contexts[0] as HTMLAnchorElement;
		expect(link.download).toBe('button.png');
		expect(link.href).toBe('blob:story');
	});
});
