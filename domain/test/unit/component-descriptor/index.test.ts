import { describe, expect, it } from 'vitest';
import { resolveComponentDescriptor } from '$stylist/domain/function/resolve/component-descriptor';
import type { TypeDomainTree } from '$stylist/domain/type/object/domain-tree';

describe('resolveComponentDescriptor', () => {
	it('resolves index.story.ts as the story of a contract family', () => {
		const tree: TypeDomainTree = {
			button: { component: { atom: { 'tool-button': 'DEFINED_RENDERED_STORY_COMPONENT' } } }
		};
		const descriptor = resolveComponentDescriptor(tree, 'button/component/atom/tool-button');
		expect(descriptor?.hasStoryPreview).toBe(true);
		expect(descriptor?.storyModulePath).toBe('button/component/atom/tool-button/index.story.ts');
	});

	it('keeps a legacy index.story.svelte as the story when no contract exists', () => {
		const tree: TypeDomainTree = { button: { component: { atom: { button: 'INDEXED_STORY_COMPONENT' } } } };
		const descriptor = resolveComponentDescriptor(tree, 'button/component/atom/button');
		expect(descriptor?.storyModulePath).toBe('button/component/atom/button/index.story.svelte');
	});

	it('reports no story when the family has none', () => {
		const tree: TypeDomainTree = { button: { component: { atom: { button: 'INDEXED_COMPONENT' } } } };
		const descriptor = resolveComponentDescriptor(tree, 'button/component/atom/button');
		expect(descriptor?.hasStoryPreview).toBe(false);
		expect(descriptor?.storyModulePath).toBeUndefined();
	});
});
