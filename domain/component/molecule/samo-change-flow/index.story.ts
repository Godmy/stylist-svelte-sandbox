import SamoChangeFlow from './index.svelte';
import type { RecipeSamoChangeFlow } from '$stylist/domain/interface/recipe/samo-change-flow';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** The route of a change from task to release, with owners, commands and an autoplay mode. */
export default {
	component: SamoChangeFlow,
	title: 'SamoChangeFlow',
	description:
		'The route of a change from task to release, with owners, commands and an autoplay mode.',
	args: {
		eyebrow: 'Chapter 01',
		title: 'The life of a change',
		description:
			'Every change — written by a person or by an agent — travels the same route. The route is short, every step has an owner, and nothing reaches the package without passing the generators and the checks.',
		note: 'Why do people, not agents, run the CLIs? They scan and rewrite the whole tree. Several agents running them in parallel would race each other’s edits — so agents finish the code and hand over.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		note: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoChangeFlow>;
