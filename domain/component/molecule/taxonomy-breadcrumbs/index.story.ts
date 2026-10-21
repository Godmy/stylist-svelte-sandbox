import TaxonomyBreadcrumbs from './index.svelte';
import type { RecipeTaxonomyBreadcrumbs } from '$stylist/domain/interface/recipe/taxonomy-breadcrumbs';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Taxonomy breadcrumb for the active coordinates. */
export default {
	component: TaxonomyBreadcrumbs,
	title: 'TaxonomyBreadcrumbs',
	description: 'Compact path breadcrumb for the active taxonomy coordinates and current file.',
	args: {
		domain: 'interaction',
		cluster: 'component',
		joint: 'atom',
		family: 'clickable',
		file: 'index.story.ts'
	},
	controls: {
		domain: { type: 'text' },
		cluster: { type: 'text' },
		joint: { type: 'text' },
		family: { type: 'text' },
		file: { type: 'text' }
	},
	presets: { 'Without file': { file: '' } }
} satisfies ContractStory<RecipeTaxonomyBreadcrumbs>;
