import StylistHero from '$stylist/domain/component/organism/stylist-hero/index.svelte';
import type { RecipeStylistHero } from '$stylist/domain/interface/recipe/stylist-hero';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Domain entry hero composed from the Stylist landing surface. */
export default {
	component: StylistHero,
	title: 'Stylist Hero',
	description: 'Domain entry hero composed from the Stylist landing surface.',
	args: { rootDomainCount: 42, storyModuleCount: 318 },
	controls: { rootDomainCount: { type: 'number' }, storyModuleCount: { type: 'number' } }
} satisfies ContractStory<RecipeStylistHero>;
