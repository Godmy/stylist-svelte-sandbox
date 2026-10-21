import DomainList from './index.svelte';
import type { RecipeDomainList } from '$stylist/domain/interface/recipe/domain-list';
import type { ContractStory } from '$stylist/html/interface/contract/story';

const entities = [
	{
		name: 'clickable',
		path: '/src/lib/layout/component/atom/clickable',
		files: [{ path: 'index.svelte' }, { path: 'index.story.svelte' }, { path: 'index.ts' }]
	},
	{
		name: 'hoverable',
		path: '/src/lib/layout/component/atom/hoverable',
		files: [{ path: 'index.svelte' }, { path: 'index.ts' }]
	},
	{
		name: 'focusable',
		path: '/src/lib/layout/component/atom/focusable',
		files: [{ path: 'index.svelte' }, { path: 'index.story.svelte' }, { path: 'index.ts' }]
	}
];

/** Entity list; index.story.svelte keeps the active path onSelect reports. */
export default {
	component: DomainList,
	title: 'DomainList',
	description: 'Scrollable entity list with active item highlighting and file counts.',
	args: { entities, activePath: entities[0].path, draggable: false },
	controls: {
		activePath: { type: 'select', options: entities.map((entity) => entity.path) },
		draggable: { type: 'boolean' }
	},
	presets: { Empty: { entities: [] } }
} satisfies ContractStory<RecipeDomainList>;
