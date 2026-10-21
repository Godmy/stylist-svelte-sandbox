import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount, type Component } from 'svelte';
import StoryCanvas from '$stylist/domain/component/molecule/story-canvas/index.svelte';
import type { ContractStory } from '$stylist/html/interface/contract/story';

describe('private story contracts', () => {
	const contracts = import.meta.glob<{ default: ContractStory }>(
		'/modules/{business,customer,global,management,prototype}/**/component/*/*/index.story.ts'
	);
	const components = import.meta.glob<{ default: Component }>(
		'/modules/{business,customer,global,management,prototype}/**/component/*/*/index.svelte'
	);
	const renders = import.meta.glob<{ default: Component }>(
		'/modules/{business,customer,global,management,prototype}/**/component/*/*/index.story.svelte'
	);
	const renderSources = import.meta.glob<string>(
		'/modules/{business,customer,global,management,prototype}/**/component/*/*/index.story.svelte',
		{ query: '?raw', import: 'default', eager: true }
	);
	const mounted: ReturnType<typeof mount>[] = [];

	afterEach(async () => {
		for (const instance of mounted.splice(0)) await unmount(instance);
		document.body.replaceChildren();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('covers every initialized private component and has no orphan render', () => {
		for (const path of Object.keys(components))
			expect(contracts[path.replace(/\.svelte$/, '.story.ts')], path).toBeDefined();
		for (const path of Object.keys(renders)) {
			expect(contracts[path.replace(/\.svelte$/, '.ts')], path).toBeDefined();
			expect(renderSources[path], path).not.toMatch(/import\s+Story\s+from|SlotStory\[\]/);
			expect(renderSources[path], path).toContain('$props()');
		}
	});

	describe.each(Object.keys(contracts))('%s', (path) => {
		it('uses its sibling component and cloneable data with valid controls', async () => {
			const story = (await contracts[path]()).default;
			const sibling = components[path.replace(/\.story\.ts$/, '.svelte')];
			expect(sibling).toBeDefined();
			expect(story.component).toBe((await sibling()).default);
			expect(() => structuredClone(story.args ?? {})).not.toThrow();
			expect(() => structuredClone(story.presets ?? {})).not.toThrow();
			for (const [name, control] of Object.entries(story.controls ?? {})) {
				expect(['text', 'number', 'boolean', 'select', 'range', 'color'], name).toContain(
					control?.type
				);
				if (control?.type === 'select') {
					expect(control.options?.length, name).toBeGreaterThan(0);
					expect(
						control.options?.every((option) => ['string', 'number'].includes(typeof option)),
						name
					).toBe(true);
				}
			}
		});

		it('mounts the default example and each preset after a postMessage clone', async () => {
			vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
			vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
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
			const story = (await contracts[path]()).default;
			const renderLoader = renders[path.replace(/\.ts$/, '.svelte')];
			const render = renderLoader ? (await renderLoader()).default : null;
			for (const preset of [undefined, ...Object.values(story.presets ?? {})]) {
				const args = structuredClone({ ...story.args, ...preset });
				const target = document.createElement('div');
				document.body.append(target);
				flushSync(() =>
					mounted.push(mount(StoryCanvas, { target, props: { story, args, render } }))
				);
				expect(target.querySelector('.c-story-canvas')).not.toBeNull();
			}
		});
	});
});
