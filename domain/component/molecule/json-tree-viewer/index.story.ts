import JsonTreeViewer from '$stylist/domain/component/molecule/json-tree-viewer/index.svelte';
import type { RecipeJsonTreeViewer } from '$stylist/domain/interface/recipe/json-tree-viewer';
import type { ContractStory } from '$stylist/html/interface/contract/story';

const validJson = JSON.stringify(
	{
		domain: 'layout',
		component: 'clickable',
		story: {
			ready: true,
			coverage: ['click', 'double click', 'context menu'],
			metrics: { events: 3, gaps: 0 }
		}
	},
	null,
	2
);

/** JSON explorer; the Invalid preset shows the parse error state. */
export default {
	component: JsonTreeViewer,
	title: 'JsonTreeViewer',
	description: 'Interactive JSON explorer with collapse and parse error handling.',
	args: { content: validJson },
	controls: { content: { type: 'text' } },
	presets: { Invalid: { content: '{ "domain": "layout", "story": [1, 2, }' } }
} satisfies ContractStory<RecipeJsonTreeViewer>;
