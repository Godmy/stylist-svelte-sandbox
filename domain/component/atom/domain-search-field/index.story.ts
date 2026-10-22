import DomainSearchField from '$stylist/domain/component/atom/domain-search-field/index.svelte';
import type { RecipeDomainSearchField } from '$stylist/domain/interface/recipe/domain-search-field';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Search input; index.story.svelte binds its value and clears it on Escape. */
export default {
	component: DomainSearchField,
	title: 'DomainSearchField',
	description: 'Search input used inside the domain quick-search overlay.',
	args: { value: '', placeholder: 'Search domain entities...' },
	controls: { value: { type: 'text' }, placeholder: { type: 'text' } }
} satisfies ContractStory<RecipeDomainSearchField>;
