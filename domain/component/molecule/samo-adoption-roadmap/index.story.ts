import SamoAdoptionRoadmap from './index.svelte';
import type { RecipeSamoAdoptionRoadmap } from '$stylist/domain/interface/recipe/samo-adoption-roadmap';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Four adoption stages with deliverables and the value for each audience. */
export default {
	component: SamoAdoptionRoadmap,
	title: 'SamoAdoptionRoadmap',
	description: 'Four adoption stages with deliverables and the value for each audience.',
	args: {
		eyebrow: 'Chapter 07',
		title: 'Adoption without a rewrite',
		description:
			'Nobody has to rewrite everything. The library is introduced as a layer that starts paying off on the very next changes — and support keeps it from turning into an archive after the first release.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoAdoptionRoadmap>;
