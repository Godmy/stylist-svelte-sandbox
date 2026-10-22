import SamoAssemblyPipeline from '$stylist/domain/component/molecule/samo-assembly-pipeline/index.svelte';
import type { RecipeSamoAssemblyPipeline } from '$stylist/domain/interface/recipe/samo-assembly-pipeline';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** The seven clusters and the one-way assembly direction with allowed joints. */
export default {
	component: SamoAssemblyPipeline,
	title: 'SamoAssemblyPipeline',
	description: 'The seven clusters and the one-way assembly direction with allowed joints.',
	args: {
		eyebrow: 'Architecture',
		title: 'One direction of assembly',
		description:
			'Seven clusters cover every construct of TypeScript and Svelte. Dependencies always flow from simpler to more complex: a level may import only from the levels to its left. Cycles and reverse imports are impossible by construction.',
		note: 'The cluster tells you the language form of a file before you open it. If a component needs a new number, it goes to const — never inlined as a magic value inside the component.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		note: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoAssemblyPipeline>;
