import TokenChipSet from './index.svelte';
import type { RecipeTokenChipSet } from '$stylist/token/interface/recipe/token-chip-set';
import type { ContractStory } from '$stylist/html/interface/contract/story';

const tokens = ['React', 'Vue', 'Svelte', 'Angular', 'Solid'];

/** Compact chip-set control for choosing one value from a token list. */
export default {
	component: TokenChipSet,
	title: 'Token Chip Set',
	description: 'Compact chip-set control for choosing one value from a token list.',
	args: { title: 'Frameworks', tokens, dedupe: true, value: '' },
	controls: {
		title: { type: 'text' },
		dedupe: { type: 'boolean' },
		// '' selects no chip.
		value: { type: 'select', options: ['', ...tokens] }
	},
	presets: { Selected: { value: 'Svelte' } }
} satisfies ContractStory<RecipeTokenChipSet>;
