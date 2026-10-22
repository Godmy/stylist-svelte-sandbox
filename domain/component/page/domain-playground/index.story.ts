import DomainPlayground from '$stylist/domain/component/page/domain-playground/index.svelte';
import type { RecipeDomainPlayground } from '$stylist/domain/interface/recipe/domain-playground';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { DOMAIN_SCREEN } from '$stylist/domain/const/object/domain-screen';

/** Root domain shell of the sandbox. */
export default {
	component: DomainPlayground,
	title: 'DomainPlayground',
	description:
		'Root domain shell: switches between landing/components/how-it-works screens and always shows DomainMenu on top.',
	// The tree and initial screen seed the shell once; navigation is internal state.
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
		initialScreen: DOMAIN_SCREEN.DOMAIN
	},
	layout: 'fullscreen'
} satisfies ContractStory<RecipeDomainPlayground>;
