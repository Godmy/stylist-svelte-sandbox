import CardShell from '$stylist/token/component/atom/card-shell/index.svelte';
import type { RecipeCardShell } from '$stylist/token/interface/recipe/card-shell';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Expandable shell used by the orbit tooling panel. */
export default {
	component: CardShell,
	title: 'CardShell',
	description: 'Expandable shell used by the orbit tooling panel.',
	args: { expanded: true, title: 'Graph Node Controls' },
	controls: { expanded: { type: 'boolean' }, title: { type: 'text' } },
	presets: { Collapsed: { expanded: false } }
} satisfies ContractStory<RecipeCardShell>;
