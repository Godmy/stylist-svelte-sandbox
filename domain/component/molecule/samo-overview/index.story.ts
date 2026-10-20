import SamoOverview from './index.svelte';
import type { RecipeSamoOverview } from '$stylist/domain/interface/recipe/samo-overview';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** SAMO pillars and an interactive decoder of the four-part entity address. */
export default {
	component: SamoOverview,
	title: 'SamoOverview',
	description: 'SAMO pillars and an interactive decoder of the four-part entity address.',
	args: {
		eyebrow: 'The methodology behind the library',
		title: 'SAMO: the file tree is the interface between people and AI',
		description:
			'SOLID · Atomic · Morphological · Orchestration. Every entity in Stylist gets a strict four-part address, so a human reviewer and an AI agent can both tell what a file is, what it does and where its dependencies may flow — just by reading its path.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoOverview>;
