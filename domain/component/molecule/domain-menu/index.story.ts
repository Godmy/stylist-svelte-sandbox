import DomainMenu from '$stylist/domain/component/molecule/domain-menu/index.svelte';
import type { RecipeDomainMenu } from '$stylist/domain/interface/recipe/domain-menu';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Floating navigation; index.story.svelte switches the screen and settings the toggles report. */
export default {
	component: DomainMenu,
	title: 'DomainMenu',
	description: 'Floating navigation pill that switches between app screens and opens settings.',
	args: {
		landingVisible: false,
		domainVisible: true,
		diagnosticsOpen: false,
		howItWorksOpen: false,
		settingsOpen: false
	},
	controls: {
		landingVisible: { type: 'boolean' },
		domainVisible: { type: 'boolean' },
		diagnosticsOpen: { type: 'boolean' },
		howItWorksOpen: { type: 'boolean' },
		settingsOpen: { type: 'boolean' }
	},
	presets: {
		Landing: { landingVisible: true, domainVisible: false },
		'Settings open': { settingsOpen: true }
	}
} satisfies ContractStory<RecipeDomainMenu>;
