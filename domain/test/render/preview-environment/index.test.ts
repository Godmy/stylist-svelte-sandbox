import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import StoryCanvas from '$stylist/domain/component/molecule/story-canvas/index.svelte';
import ButtonStory from '$stylist/html/component/atom/button/index.story';
import CaptionStory from '$stylist/html/component/organism/caption/index.story';
import StackStory from '$stylist/layout/component/atom/stack/index.story';
import { TOKEN_FONT_FAMILY } from '$stylist/design-token/const/object/font-family';
import { resolvePreviewVariables } from '$stylist/domain/function/resolve/preview-variables';
import { resolvePreviewSkin } from '$stylist/domain/function/resolve/preview-skin';

describe('preview environment', () => {
	it('keeps settings on the preview scope and removes every override on reset', async () => {
		const { container, rerender } = render(StoryCanvas, {
			story: ButtonStory,
			environment: { mode: 'dark', fontFamily: 'serif', fontSize: '6', density: 'compact' }
		});
		const root = container.querySelector<HTMLDivElement>('[data-html-skin]')!;
		expect(root.style.getPropertyValue('--typography-font-family')).toBe(TOKEN_FONT_FAMILY.serif);
		expect(root.style.getPropertyValue('--font-size-4')).toBe('1.5rem');
		expect(root.style.getPropertyValue('--density-block')).toBe('0.25rem');
		expect(root.style.getPropertyValue('--density-scale')).toBe('0.75');
		const button = container.querySelector('button')!;
		for (const name of ['mode', 'density', 'fontFamily', '--typography-font-family'])
			expect(button.hasAttribute(name)).toBe(false);
		await rerender({ story: ButtonStory, environment: {} });
		expect(root.style.cssText).toBe('');
		expect(root.hasAttribute('data-html-skin')).toBe(true);
		await rerender({ story: ButtonStory, environment: { skin: false } });
		expect(root.hasAttribute('data-html-skin')).toBe(false);
	});
	it('retains valid caption context when appearance and story change', async () => {
		const { container, rerender } = render(StoryCanvas, {
			story: ButtonStory,
			environment: { fontFamily: 'mono' }
		});
		await rerender({ story: CaptionStory, environment: {} });
		expect(container.querySelector('table > caption')).not.toBeNull();
		expect(container.querySelector<HTMLElement>('[data-html-skin]')?.style.cssText).toBe('');
	});
	it('lets explicit font choices win over a selected theme and uses inherited defaults after reset', () => {
		const vars = resolvePreviewVariables({
			mode: 'light',
			fontFamily: 'mono',
			lineHeight: 'loose'
		});
		expect(vars['--typography-font-family']).toBe(TOKEN_FONT_FAMILY.mono);
		expect(vars['--line-height-normal']).toBe('2');
		expect(vars['--font-mono']).toBe(TOKEN_FONT_FAMILY.mono);
		expect(resolvePreviewVariables({})).toEqual({});
	});
	it('switches the density scale between compact and comfortable', () => {
		expect(resolvePreviewVariables({ density: 'compact' })['--density-scale']).toBe('0.75');
		expect(resolvePreviewVariables({ density: 'comfortable' })['--density-scale']).toBe('1');
	});
	it('applies appearance settings to layout stories', async () => {
		const { container } = render(StoryCanvas, {
			story: StackStory,
			environment: { fontSize: '5', lineHeight: 'loose', density: 'compact' }
		});
		const root = container.querySelector<HTMLDivElement>('[data-html-skin]')!;
		expect(root.style.getPropertyValue('--font-size-4')).toBe('1.25rem');
		expect(root.style.getPropertyValue('--line-height-normal')).toBe('2');
		expect(root.style.getPropertyValue('--density-scale')).toBe('0.75');
		expect(resolvePreviewSkin('/src/lib/layout/component/atom/stack/index.story.ts')).toBe(true);
		expect(
			resolvePreviewSkin('/modules/interaction/search/component/atom/search-field/index.story.ts')
		).toBe(true);
	});
	it('excludes metadata and non-HTML stories from appearance controls', () => {
		expect(resolvePreviewSkin('/src/lib/html/component/atom/base/index.story.ts')).toBe(false);
		expect(resolvePreviewSkin('/src/lib/button/component/atom/button/index.story.ts')).toBe(false);
		expect(resolvePreviewSkin('/src/lib/html/component/organism/caption/index.story.ts')).toBe(
			true
		);
	});
});
