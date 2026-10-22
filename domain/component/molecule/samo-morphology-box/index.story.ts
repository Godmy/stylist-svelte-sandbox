import SamoMorphologyBox from '$stylist/domain/component/molecule/samo-morphology-box/index.svelte';
import type { RecipeSamoMorphologyBox } from '$stylist/domain/interface/recipe/samo-morphology-box';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Zwicky morphological box applied to a Material Design 3 button. */
export default {
	component: SamoMorphologyBox,
	title: 'SamoMorphologyBox',
	description: 'Zwicky morphological box applied to a Material Design 3 button.',
	args: {
		eyebrow: 'Morphological box',
		title: 'Zwicky’s method, applied to a button',
		description:
			'Fritz Zwicky designed the morphological box to explore multi-dimensional problems. SAMO decomposes a UI element into independent axes — domains horizontally, clusters vertically — and every cell becomes one small file. Here is a Material Design 3 button taken apart.',
		product: 'Material Design 3 Button'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		product: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoMorphologyBox>;
