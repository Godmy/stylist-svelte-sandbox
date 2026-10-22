import DomainToolbar from '$stylist/domain/component/molecule/domain-toolbar/index.svelte';
import type { RecipeDomainToolbar } from '$stylist/domain/interface/recipe/domain-toolbar';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';

const domains = ['workspace', 'button', 'dialog', 'tree', 'webgl'];

/** Domain navigation rail; index.story.svelte keeps the active domain onSelect reports. */
export default {
	component: DomainToolbar,
	title: 'DomainToolbar',
	description: 'Primary domain navigation rail used by the domain explorer.',
	args: { domains, active: 'button', orientation: TOKEN_ORIENTATION[1], showLabel: true },
	controls: {
		active: { type: 'select', options: domains },
		orientation: { type: 'select', options: TOKEN_ORIENTATION },
		showLabel: { type: 'boolean' }
	},
	presets: { Horizontal: { orientation: TOKEN_ORIENTATION[0] } }
} satisfies ContractStory<RecipeDomainToolbar>;
