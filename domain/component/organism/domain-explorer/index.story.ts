import DomainExplorer from './index.svelte';
import type { RecipeDomainExplorer } from '$stylist/domain/interface/recipe/domain-explorer';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { DEVICE_FRAME_VIEWPORT } from '$stylist/domain/const/array/device-frame-viewport';

/** Main catalog screen of the sandbox. */
export default {
	component: DomainExplorer,
	title: 'DomainExplorer',
	description:
		'Main catalog screen: sidebar taxonomy, breadcrumbs, search, file tabs, and preview.',
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
											},
											{ name: 'index.ts', path: 'layout/component/atom/clickable/index.ts' }
										]
									},
									{
										name: 'hoverable',
										path: 'layout/component/atom/hoverable',
										files: [
											{
												name: 'index.svelte',
												path: 'layout/component/atom/hoverable/index.svelte'
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
		storyDevice: 'desktop'
	},
	controls: { storyDevice: { type: 'select', options: DEVICE_FRAME_VIEWPORT } },
	layout: 'fullscreen'
} satisfies ContractStory<RecipeDomainExplorer>;
