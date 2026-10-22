import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import StoryControls from '$stylist/domain/component/molecule/story-controls/index.svelte';
import ButtonStory from '$stylist/html/component/atom/button/index.story';
import { createHtmlStoryNode } from '$stylist/html/function/create/html-story-node';
import { serializeHtmlMarkup } from '$stylist/html/function/serialize/html-markup';
import type { HtmlNode } from '$stylist/html/type/alias/html-node';

describe('story content controls', () => {
	it('updates content, shows the same HTML and resets args and text', async () => {
		const onChange = vi.fn();
		render(StoryControls, {
			story: ButtonStory,
			onChange,
			markup: (args: Record<string, unknown>, content?: readonly HtmlNode[]) =>
				serializeHtmlMarkup(createHtmlStoryNode('button', ButtonStory, args, content)!)
		});
		const input = screen.getByLabelText('Text content');
		await fireEvent.input(input, { target: { value: 'Edited label' } });
		const [args, content] = onChange.mock.calls.at(-1)!;
		expect((content as HtmlNode[])[0]).toEqual({ kind: 'text', value: 'Edited label' });
		expect(args).toEqual(ButtonStory.args);
		await fireEvent.click(screen.getByRole('button', { name: 'HTML' }));
		expect(screen.getByText(/<button.*Edited label<\/button>/)).toBeTruthy();
		await fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
		expect(onChange.mock.calls.at(-1)).toEqual([ButtonStory.args, ButtonStory.content]);
		await fireEvent.click(screen.getByRole('button', { name: 'Controls' }));
		expect((screen.getByLabelText('Text content') as HTMLInputElement).value).toBe('Save changes');
	});
	it('does not claim to copy when the clipboard is unavailable', async () => {
		render(StoryControls, { story: ButtonStory, markup: () => '<button>Test</button>' });
		await fireEvent.click(screen.getByRole('button', { name: 'HTML' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
		expect(screen.getByRole('status').textContent).toContain('Unable to copy');
		expect(screen.queryByRole('button', { name: 'Copied' })).toBeNull();
	});
});
