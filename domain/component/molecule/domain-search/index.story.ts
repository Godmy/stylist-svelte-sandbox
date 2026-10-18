import DomainSearch from './index.svelte';
import type { RecipeDomainSearch } from '$stylist/domain/interface/recipe/domain-search';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Quick-search overlay; the context gives the overlay, which opens to the left, room to render. */
export default {
	component: DomainSearch,
	title: 'DomainSearch',
	description:
		'Quick-search overlay for domain entities with a copy-path shortcut for the currently selected entity.',
	args: {
		entries: [
			{
				id: 'commerce/component/molecule/price-tag',
				domain: 'commerce',
				cluster: 'component',
				joint: 'molecule',
				family: 'price-tag',
				entityPath: 'commerce/component/molecule/price-tag',
				searchText: 'commerce component molecule price-tag'
			},
			{
				id: 'layout/component/atom/clickable',
				domain: 'layout',
				cluster: 'component',
				joint: 'atom',
				family: 'clickable',
				entityPath: 'layout/component/atom/clickable',
				searchText: 'layout component atom clickable'
			}
		],
		currentPath: 'commerce\\component\\molecule\\price-tag\\index.svelte'
	},
	controls: { currentPath: { type: 'text' } },
	presets: { 'No current path': { currentPath: '' }, Empty: { entries: [] } },
	context: {
		kind: 'element',
		tag: 'div',
		attrs: { style: 'display: flex; justify-content: flex-end; min-height: 20rem;' },
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeDomainSearch>;
