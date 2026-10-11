import { render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DomainFilePreview from '../../../component/organism/domain-file-preview/index.svelte';
import ButtonStory from '$stylist/html/component/atom/button/index.story';

describe('story navigation', () => {
	afterEach(() => vi.unstubAllGlobals());
	it('waits for a story path when the previous module is a story contract', async () => {
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				disconnect() {}
			}
		);
		const view = render(DomainFilePreview, {
			previewMode: 'story',
			storyPreviewComponent: ButtonStory
		});
		expect(view.container.querySelector('iframe')).toBeNull();
		await view.rerender({
			previewMode: 'story',
			storyPreviewComponent: ButtonStory,
			storyPath: '/src/lib/html/component/atom/button/index.story.ts'
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
