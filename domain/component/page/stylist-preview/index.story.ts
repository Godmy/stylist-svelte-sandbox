import StylistPreview from '$stylist/domain/component/page/stylist-preview/index.svelte';
import type { RecipeStylistPreview } from '$stylist/domain/interface/recipe/stylist-preview';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_STYLIST_PREVIEW_VIEW_MODE } from '$stylist/domain/const/array/stylist-preview-view-mode';
import { TOKEN_STYLIST_PREVIEW_SORT_BY } from '$stylist/domain/const/array/stylist-preview-sort-by';

const stories = [
	{ id: 'button-story', componentName: 'Button', category: 'Atoms', subcategory: 'button' },
	{ id: 'input-story', componentName: 'Text Field', category: 'Atoms', subcategory: 'input' },
	{ id: 'card-story', componentName: 'Metric Card', category: 'Molecules', subcategory: 'card' },
	{ id: 'table-story', componentName: 'Data Table', category: 'Organisms', subcategory: 'table' }
];

/** Component catalog; index.story.svelte supplies the selection sets and the required callbacks. */
export default {
	component: StylistPreview,
	title: 'Stylist Preview',
	description:
		'Searchable sandbox catalog for browsing component stories by category, tags, and view mode.',
	args: {
		stories,
		categories: ['Atoms', 'Molecules', 'Organisms'],
		categoryCounts: { Atoms: 2, Molecules: 1, Organisms: 1 },
		tags: ['button', 'input', 'card', 'table', 'analytics'],
		searchQuery: '',
		viewMode: 'grid',
		sortBy: 'name',
		showFilters: true,
		stats: { total: stories.length, filtered: stories.length }
	},
	controls: {
		searchQuery: { type: 'text' },
		viewMode: { type: 'select', options: TOKEN_STYLIST_PREVIEW_VIEW_MODE },
		sortBy: { type: 'select', options: TOKEN_STYLIST_PREVIEW_SORT_BY },
		showFilters: { type: 'boolean' }
	},
	presets: { List: { viewMode: 'list' } }
} satisfies ContractStory<RecipeStylistPreview>;
