import TokenIcon from './index.svelte';
import type { RecipeTokenIcon } from '$stylist/token/interface/recipe/token-icon';
import type { ContractStory } from '$stylist/html/interface/contract/story';

const icons = ['settings', 'palette', 'grid', 'animation', 'state', 'typography'];

/** Icon token selector for choosing a value from a visual icon set. */
export default {
	component: TokenIcon,
	title: 'Token Icon',
	description: 'Icon token selector for choosing a value from a visual icon set.',
	args: { title: 'Visual token', icons, value: 'settings' },
	controls: { title: { type: 'text' }, value: { type: 'select', options: icons } }
} satisfies ContractStory<RecipeTokenIcon>;
