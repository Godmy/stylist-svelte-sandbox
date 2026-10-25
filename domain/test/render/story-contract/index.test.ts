import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount, type Component } from 'svelte';
import StoryCanvas from '$stylist/domain/component/molecule/story-canvas/index.svelte';
import StoryControls from '$stylist/domain/component/molecule/story-controls/index.svelte';
import { resolveStoryControls } from '$stylist/domain/function/resolve/story-controls';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { transformStoryJson } from '$stylist/domain/function/transform/story-json';

type Loader<T> = Record<string, () => Promise<T>>;

/**
 * Every component story of the public modules follows `index.story.ts` (issue #5): the
 * contract is typed by the component recipe, its args reach the preview iframe through
 * `postMessage`, and a sibling `index.story.svelte` is only its custom render.
 */
describe('story contracts of the public modules', () => {
	const contracts = import.meta.glob<{ default: ContractStory }>(
		'/modules/{architecture,design-system,information,interaction,sandbox}/*/component/*/*/index.story.ts'
	) as Loader<{ default: ContractStory }>;
	const renders = import.meta.glob<{ default: Component }>(
		'/modules/{architecture,design-system,information,interaction,sandbox}/*/component/*/*/index.story.svelte'
	) as Loader<{ default: Component }>;
	const components = import.meta.glob<{ default: Component }>(
		'/modules/{architecture,design-system,information,interaction,sandbox}/*/component/*/*/index.svelte'
	) as Loader<{ default: Component }>;
	const sources = import.meta.glob<string>(
		[
			'/modules/{architecture,design-system,information,interaction,sandbox}/*/component/*/*/index.{svelte,story.ts}',
			'/modules/{architecture,design-system,information,interaction,sandbox}/*/component/*/*/state.svelte.ts'
		],
		{ query: '?raw', import: 'default', eager: true }
	);
	const CONTROL_TYPES = ['text', 'number', 'boolean', 'select', 'range', 'color', 'json'];
	const family = (path: string) =>
		path.replace(/^\/modules\//, '').replace(/\/index\.story\.\w+$/, '');

	it('gives every story an index.story.ts contract', () => {
		const legacy = Object.keys(renders)
			.filter((path) => !(path.replace(/\.svelte$/, '.ts') in contracts))
			.map(family);
		expect(legacy).toEqual([]);
	});

	it('gives every component family an index.story.ts contract', () => {
		const missing = Object.keys(components)
			.filter((path) => !(path.replace(/\.svelte$/, '.story.ts') in contracts))
			.map((path) => family(path.replace(/\/index\.svelte$/, '/index.story.ts')));
		expect(missing).toEqual([]);
	});

	describe.each(Object.keys(contracts).map((path) => [family(path), path] as const))(
		'%s',
		(_, path) => {
			let story: ContractStory;
			let render: Component | null;
			const instances: ReturnType<typeof mount>[] = [];

			beforeAll(async () => {
				story = (await contracts[path]()).default;
				const load = renders[path.replace(/\.ts$/, '.svelte')];
				render = load ? (await load()).default : null;
			});

			afterEach(async () => {
				for (const instance of instances.splice(0)) await unmount(instance);
				document.body.innerHTML = '';
				vi.unstubAllGlobals();
			});

			it('describes the component of its own folder', async () => {
				const own = components[path.replace(/\.story\.ts$/, '.svelte')];
				expect(own, 'sibling index.svelte').toBeDefined();
				expect(story.component).toBe((await own()).default);
			});

			it('uses the component recipe in index.svelte, state.svelte.ts and index.story.ts', () => {
				const dir = path.replace(/\/index\.story\.ts$/, '');
				expect(sources[path], 'index.story.ts').toMatch(/ContractStory<\s*Recipe\w+/);
				expect(sources[`${dir}/index.svelte`], 'index.svelte').toMatch(/\bRecipe\w+/);
				const state = sources[`${dir}/state.svelte.ts`];
				if (state !== undefined) expect(state, 'state.svelte.ts').toMatch(/\bRecipe\w+/);
			});

			it('keeps args and presets structured-cloneable for postMessage', () => {
				expect(() => structuredClone(story.args ?? {})).not.toThrow();
				expect(() => structuredClone(story.presets ?? {})).not.toThrow();
			});

			it('uses sandbox control types', () => {
				for (const [name, control] of Object.entries(story.controls ?? {})) {
					expect(CONTROL_TYPES, name).toContain(control!.type);
					if (control!.type === 'select') expect(control!.options?.length, name).toBeTruthy();
					if (control!.type === 'json') {
						const value = (story.args as Record<string, unknown> | undefined)?.[name];
						const text = value === undefined ? '' : JSON.stringify(value);
						expect(transformStoryJson(text, control!.example), name).toMatchObject({ ok: true });
					}
				}
			});

			it('gives the story panel a control of a sandbox type for its args', () => {
				for (const { name, control } of resolveStoryControls(story))
					expect(CONTROL_TYPES, name).toContain(control.type);
				const target = document.createElement('div');
				document.body.append(target);
				flushSync(() => instances.push(mount(StoryControls, { target, props: { story } })));
				expect(target.querySelector('.c-story-controls')).not.toBeNull();
			});

			it('mounts with its args and every preset', () => {
				vi.stubGlobal(
					'ResizeObserver',
					class {
						observe() {}
						unobserve() {}
						disconnect() {}
					}
				);
				vi.stubGlobal(
					'IntersectionObserver',
					class {
						observe() {}
						unobserve() {}
						disconnect() {}
						takeRecords() {
							return [];
						}
					}
				);
				for (const preset of [undefined, ...Object.values(story.presets ?? {})]) {
					const target = document.createElement('div');
					document.body.append(target);
					const args = preset && { ...story.args, ...preset };
					flushSync(() =>
						instances.push(mount(StoryCanvas, { target, props: { story, args, render } }))
					);
					expect(target.querySelector('.c-story-canvas')).not.toBeNull();
				}
			});
		}
	);
});
