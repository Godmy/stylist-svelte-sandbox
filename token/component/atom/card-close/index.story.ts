import CardClose from './index.svelte';
import type { RecipeCardClose } from '$stylist/token/interface/recipe/card-close';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Floating close affordance for expanded orbit cards. */
export default {
	component: CardClose,
	title: 'CardClose',
	description: 'Floating close affordance for expanded orbit cards.',
	args: { expanded: true },
	controls: { expanded: { type: 'boolean' } },
	presets: { Hidden: { expanded: false } },
	// The button is absolutely positioned on the top-right corner of its card.
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'position: relative; height: 6rem; width: 16rem; margin: 2rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #ffffff;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeCardClose>;
