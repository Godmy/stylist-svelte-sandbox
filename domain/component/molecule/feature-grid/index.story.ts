import FeatureGrid from '$stylist/domain/component/molecule/feature-grid/index.svelte';
import type { RecipeFeatureGrid } from '$stylist/domain/interface/recipe/feature-grid';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Landing feature grid; the features default to the component's own list. */
export default {
	component: FeatureGrid,
	title: 'FeatureGrid',
	description: 'Landing grid of feature cards with a heading and subtitle.',
	args: {
		title: 'Why Stylist?',
		subtitle:
			'A readable operating surface for a component library that is organized by architecture, not by screenshots alone.'
	},
	controls: { title: { type: 'text' }, subtitle: { type: 'text' } },
	presets: {
		'Two features': {
			features: [
				{
					title: 'Atomic Design architecture',
					description: 'Atoms, molecules and organisms stay visible inside their domain context.',
					palette: 'fg-palette-orange',
					iconBg: 'fg-icon-orange',
					icon: 'git-branch'
				},
				{
					title: 'Story-first review',
					description: 'Stories sit next to source files, markdown notes and JSON structure.',
					palette: 'fg-palette-violet',
					iconBg: 'fg-icon-violet',
					icon: 'sparkles'
				}
			]
		}
	}
} satisfies ContractStory<RecipeFeatureGrid>;
