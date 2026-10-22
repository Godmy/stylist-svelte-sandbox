import SamoSolidGrid from '$stylist/domain/component/molecule/samo-solid-grid/index.svelte';
import type { RecipeSamoSolidGrid } from '$stylist/domain/interface/recipe/samo-solid-grid';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** The five SOLID principles as SAMO encodes them into the file system. */
export default {
	component: SamoSolidGrid,
	title: 'SamoSolidGrid',
	description: 'The five SOLID principles as SAMO encodes them into the file system.',
	args: {
		eyebrow: 'Foundation',
		title: 'SOLID, enforced by the file system',
		description:
			'In SAMO the five principles are not good intentions for code review. They are encoded into where a file may live and what it may export, so AI-generated code cannot quietly degrade.',
		note: 'A self-analysis script walks the whole tree and checks every file against these rules — architecture control happens on every change, not once a quarter.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		note: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoSolidGrid>;
