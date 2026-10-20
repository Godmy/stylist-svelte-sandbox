import DomainLanding from './index.svelte';
import type { RecipeDomainLanding } from '$stylist/domain/interface/recipe/domain-landing';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Landing page of the domain workspace. */
export default {
	component: DomainLanding,
	title: 'DomainLanding',
	description: 'Landing page for the domain workspace with calls to open the component playground.',
	args: { rootDomainCount: 12, storyModuleCount: 84 },
	controls: { rootDomainCount: { type: 'number' }, storyModuleCount: { type: 'number' } }
} satisfies ContractStory<RecipeDomainLanding>;
