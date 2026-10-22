import RibbonMenu from '$stylist/token/component/molecule/ribbon-menu/index.svelte';
import type { RecipeRibbonMenu } from '$stylist/token/interface/recipe/ribbon-menu';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Expandable ribbon launcher for primary stylist sections. */
export default {
	component: RibbonMenu,
	title: 'RibbonMenu',
	description: 'Expandable ribbon launcher for primary stylist sections.',
	args: {},
	controls: {},
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'border: 1px solid #e2e8f0; border-radius: 1.5rem; background-color: #ffffff; padding: 2rem;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeRibbonMenu>;
