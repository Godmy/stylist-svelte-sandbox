import StylistHero from '$stylist/domain/component/molecule/stylist-hero/index.svelte';
import type { RecipeStylistHero } from '$stylist/domain/interface/recipe/stylist-hero';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Landing hero; the AI model list defaults to the component's own list. */
export default {
	component: StylistHero,
	title: 'StylistHero',
	description: 'Landing hero with the product badge, headline, counters and AI model credits.',
	args: {
		title: 'Stylist Svelte',
		subtitle: 'Build beautiful Svelte interfaces.',
		subtitleAccent: 'Faster!',
		poweredByLabel: 'Developed with multiple AI perspectives',
		creditNote: 'Human-directed development',
		rootDomainCount: 42,
		storyModuleCount: 512
	},
	controls: {
		title: { type: 'text' },
		subtitle: { type: 'text' },
		subtitleAccent: { type: 'text' },
		description: { type: 'text' },
		badgeLabel: { type: 'text' },
		poweredByLabel: { type: 'text' },
		creditNote: { type: 'text' },
		rootDomainCount: { type: 'number', min: 0 },
		storyModuleCount: { type: 'number', min: 0 }
	},
	layout: 'fullscreen'
} satisfies ContractStory<RecipeStylistHero>;
