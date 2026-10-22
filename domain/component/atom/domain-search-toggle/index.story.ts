import DomainSearchToggle from '$stylist/domain/component/atom/domain-search-toggle/index.svelte';
import type { RecipeDomainSearchToggle } from '$stylist/domain/interface/recipe/domain-search-toggle';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Search toggle; index.story.svelte keeps the open state onToggle reports. */
export default {
	component: DomainSearchToggle,
	title: 'DomainSearchToggle',
	description: 'Round toggle button that opens or closes the domain search overlay.',
	args: { open: false },
	controls: { open: { type: 'boolean' } },
	presets: { Open: { open: true } }
} satisfies ContractStory<RecipeDomainSearchToggle>;
