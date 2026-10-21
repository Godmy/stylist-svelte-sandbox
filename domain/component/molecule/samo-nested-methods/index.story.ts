import SamoNestedMethods from './index.svelte';
import type { RecipeSamoNestedMethods } from '$stylist/domain/interface/recipe/samo-nested-methods';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Map of the methodologies nested inside SAMO: DDD, functional taxonomy, Atomic Design, DSIAP and trait refinement. */
export default {
	component: SamoNestedMethods,
	title: 'SamoNestedMethods',
	description:
		'Map of the methodologies nested inside SAMO: DDD, functional taxonomy, Atomic Design, DSIAP and trait refinement.',
	args: {
		eyebrow: 'Nested methodologies',
		title: 'A methodology made of methodologies',
		description:
			'SAMO does not replace proven ideas — it gives each of them a precise place in the address. Module ownership groups domains into repositories, Domain-Driven Design works at the domain level, Atomic Design lives inside component/, DSIAP inside interface/, and trait refinement shapes the family name. Pick a layer to see how each one works.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoNestedMethods>;
