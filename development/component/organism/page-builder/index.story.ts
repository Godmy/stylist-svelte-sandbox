import PageBuilder from '$stylist/development/component/organism/page-builder/index.svelte';
import type { RecipePageBuilder } from '$stylist/development/interface/recipe/page-builder';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Visual page builder with drag-and-drop ordering. */
export default {
	component: PageBuilder,
	title: 'Page Builder',
	description: 'Visual page builder with drag-and-drop ordering.',
	args: {
		showToolbar: true,
		editable: true
	},
	controls: {
		showToolbar: { type: 'boolean' },
		editable: { type: 'boolean' }
	},
	presets: {
		'Read only': { showToolbar: false, editable: false }
	}
} satisfies ContractStory<RecipePageBuilder>;
