import CardOpen from '$stylist/token/component/atom/card-open/index.svelte';
import type { RecipeCardOpen } from '$stylist/token/interface/recipe/card-open';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Seed button that toggles the orbit panel between closed and opened states. */
export default {
	component: CardOpen,
	title: 'CardOpen',
	description: 'Seed button that toggles the orbit panel between closed and opened states.',
	args: { orbitOpen: false, dragging: false, style: 'left: calc(50% - 24px); top: 4.5rem;' },
	controls: { orbitOpen: { type: 'boolean' }, dragging: { type: 'boolean' } },
	presets: { Opened: { orbitOpen: true }, Dragging: { dragging: true } },
	// The seed is absolutely positioned by `style` inside its stage.
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'position: relative; min-height: 12rem; overflow: hidden; border: 1px solid #d7dee8; border-radius: 0.5rem; background: #f8fafc;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeCardOpen>;
