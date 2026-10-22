import SamoRiskBoard from '$stylist/domain/component/molecule/samo-risk-board/index.svelte';
import type { RecipeSamoRiskBoard } from '$stylist/domain/interface/recipe/samo-risk-board';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Common objections to SAMO with the mechanism that answers each one. */
export default {
	component: SamoRiskBoard,
	title: 'SamoRiskBoard',
	description: 'Common objections to SAMO with the mechanism that answers each one.',
	args: {
		eyebrow: 'Chapter 06',
		title: 'Risks, and how the structure answers them',
		description:
			'A methodology that only lists benefits is a brochure. These are the objections we hear most often — each with the mechanism that handles it.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoRiskBoard>;
