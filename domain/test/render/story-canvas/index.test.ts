import { afterEach, describe, expect, it } from 'vitest';
import { flushSync, mount, unmount, type Component } from 'svelte';
import StoryCanvas from '$stylist/domain/component/molecule/story-canvas/index.svelte';
import type { ContractStory } from '$stylist/html/interface/contract/story';

describe('StoryCanvas', () => {
	const stories = import.meta.glob<{ default: ContractStory }>(
		'/modules/design-system/html/component/*/*/index.story.ts',
		{ eager: true }
	);
	const renders = import.meta.glob<{ default: Component }>(
		'/modules/design-system/html/component/*/*/index.story.svelte',
		{ eager: true }
	);
	const instances: ReturnType<typeof mount>[] = [];
	/** Elements that act on the document itself or are never rendered in the canvas. */
	const DOCUMENT = new Set(['html', 'head', 'body', 'raw-text', 'node', 'input']);

	afterEach(async () => {
		for (const instance of instances.splice(0)) await unmount(instance);
		document.body.innerHTML = '';
	});

	function render(path: string, args?: Record<string, unknown>) {
		const story = stories[path].default;
		const target = document.createElement('div');
		document.body.append(target);
		const custom = renders[path.replace(/\.ts$/, '.svelte')]?.default ?? null;
		flushSync(() =>
			instances.push(mount(StoryCanvas, { target, props: { story, args, render: custom } }))
		);
		return target;
	}

	it('mounts every html story with its args and every preset', () => {
		expect(Object.keys(stories).length).toBeGreaterThan(130);
		for (const path of Object.keys(stories)) {
			const story = stories[path].default;
			const family = path.split('/').at(-2)!;
			const tag = family.startsWith('input-') ? 'input' : family;
			const target = render(path);
			if (!DOCUMENT.has(family))
				expect(target.querySelector(tag), `${family}: <${tag}> rendered`).not.toBeNull();
			for (const preset of Object.values(story.presets ?? {}))
				render(path, { ...story.args, ...preset });
		}
	});

	it('applies args sent by the host', () => {
		const path = '/modules/design-system/html/component/atom/button/index.story.ts';
		const story = stories[path].default;
		const button = render(path, { ...story.args, disabled: true }).querySelector('button')!;
		expect(button.disabled).toBe(true);
		expect(button.textContent).toBe('Save changes');
	});
});
