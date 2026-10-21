import DomainEntity from './index.svelte';
import type { RecipeDomainEntity } from '$stylist/domain/interface/recipe/domain-entity';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Selectable item in the domain explorer entity list. */
export default {
	component: DomainEntity,
	title: 'DomainEntity',
	description: 'Selectable item in the domain explorer entity list.',
	args: {
		name: 'filter-bar',
		path: '/src/lib/table/component/molecule/filter-bar',
		fileCount: 3,
		active: false,
		draggable: false
	},
	controls: {
		name: { type: 'text' },
		path: { type: 'text' },
		fileCount: { type: 'number', min: 0 },
		active: { type: 'boolean' },
		draggable: { type: 'boolean' }
	},
	presets: { Active: { active: true } }
} satisfies ContractStory<RecipeDomainEntity>;
