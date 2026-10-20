import SamoMethodology from './index.svelte';
import type { RecipeSamoMethodology } from '$stylist/domain/interface/recipe/samo-methodology';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** All SAMO methodology chapters of the landing page. */
export default {
	component: SamoMethodology,
	title: 'SamoMethodology',
	description: 'All SAMO methodology chapters of the landing page with in-page navigation.',
	args: { navLabel: 'Inside the methodology', guideLabel: 'How it works' },
	controls: { navLabel: { type: 'text' }, guideLabel: { type: 'text' } }
} satisfies ContractStory<RecipeSamoMethodology>;
