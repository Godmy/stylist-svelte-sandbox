import StylistLanding from '$stylist/domain/component/page/stylist-landing/index.svelte';
import type { RecipeStylistLanding } from '$stylist/domain/interface/recipe/stylist-landing';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Stylist landing page assembled from the hero and methodology sections. */
export default {
	component: StylistLanding,
	title: 'Stylist Landing',
	description: 'Stylist landing page assembled from the hero and methodology sections.',
	args: { rootDomainCount: 42, storyModuleCount: 318 },
	controls: { rootDomainCount: { type: 'number' }, storyModuleCount: { type: 'number' } }
} satisfies ContractStory<RecipeStylistLanding>;
