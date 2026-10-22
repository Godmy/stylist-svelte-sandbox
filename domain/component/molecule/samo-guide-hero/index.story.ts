import SamoGuideHero from '$stylist/domain/component/molecule/samo-guide-hero/index.svelte';
import type { RecipeSamoGuideHero } from '$stylist/domain/interface/recipe/samo-guide-hero';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Dark hero of the How it works page with an animated change terminal and chapter cards. */
export default {
	component: SamoGuideHero,
	title: 'SamoGuideHero',
	description:
		'Dark hero of the How it works page with an animated change terminal and chapter cards.',
	args: {
		eyebrow: 'Under the hood',
		title: 'How Stylist',
		titleAccent: 'actually works',
		description:
			'The landing explains what SAMO is. This page shows how it lives day to day: how a change travels from a task to a release, how a component grows without breaking, how the umbrella repository and its modules fit together, how to connect the library to your own site, what the platform is made of, which risks exist — and how a team adopts it.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		titleAccent: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoGuideHero>;
