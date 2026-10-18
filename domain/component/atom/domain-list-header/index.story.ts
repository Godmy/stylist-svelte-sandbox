import DomainListHeader from './index.svelte';
import type { RecipeDomainListHeader } from '$stylist/domain/interface/recipe/domain-list-header';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** List header with a compact title and entity count. */
export default {
	component: DomainListHeader,
	title: 'DomainListHeader',
	description: 'List header with a compact title and entity count.',
	args: { label: 'Entities', count: 12 },
	controls: { label: { type: 'text' }, count: { type: 'number', min: 0 } }
} satisfies ContractStory<RecipeDomainListHeader>;
