import DomainHowItWorks from './index.svelte';
import type { RecipeDomainHowItWorks } from '$stylist/domain/interface/recipe/domain-how-it-works';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** The How it works page of the domain workspace. */
export default {
	component: DomainHowItWorks,
	title: 'DomainHowItWorks',
	description:
		'The How it works page of the domain workspace, opened from the question-mark menu button.',
	args: {}
} satisfies ContractStory<RecipeDomainHowItWorks>;
