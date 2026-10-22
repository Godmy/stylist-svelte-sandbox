import DomainBuilder from '$stylist/token/component/organism/domain-builder/index.svelte';
import type { RecipeDomainBuilder } from '$stylist/token/interface/recipe/domain-builder';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Drag-and-drop page builder that composes atom/molecule/organism components into sections. */
export default {
	component: DomainBuilder,
	title: 'DomainBuilder',
	description:
		'Drag-and-drop page builder that composes atom/molecule/organism components into sections.',
	args: {
		tree: [
			{
				name: 'layout',
				clusters: [
					{
						name: 'component',
						joints: [
							{
								name: 'atom',
								entities: [
									{
										name: 'clickable',
										path: 'layout/component/atom/clickable',
										files: [
											{
												name: 'index.svelte',
												path: 'layout/component/atom/clickable/index.svelte'
											}
										]
									}
								]
							}
						]
					}
				]
			}
		],
		descriptors: []
	},
	controls: {},
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'height: 34rem; overflow: auto; border: 1px solid #e2e8f0; border-radius: 1rem; background-color: #ffffff;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeDomainBuilder>;
