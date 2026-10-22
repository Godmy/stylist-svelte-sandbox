import TokenSettings from '$stylist/token/component/organism/token-settings/index.svelte';
import type { RecipeTokenSettings } from '$stylist/token/interface/recipe/token-settings';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Registry browser for every token setting array, its control type, and the live control preview. */
export default {
	component: TokenSettings,
	title: 'TokenSettings',
	description:
		'Registry browser for every token setting array, its control type, and the live control preview.',
	args: { title: 'Design Token Registry', columns: 3, showColumnControl: true },
	controls: {
		title: { type: 'text' },
		columns: { type: 'range', min: 1, max: 6, step: 1 },
		showColumnControl: { type: 'boolean' }
	},
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'box-sizing: border-box; min-width: 0; border: 1px solid var(--line, var(--color-border-primary, #d7dee8)); border-radius: 0.5rem; background: var(--bg, var(--color-background-secondary, #f8fafc)); padding: 1.25rem;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeTokenSettings>;
