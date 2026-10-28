import ComponentFeedback from '$stylist/domain/component/organism/component-feedback/index.svelte';
import type { RecipeComponentFeedback } from '$stylist/domain/interface/recipe/component-feedback';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Local selection demo; its custom renderer never writes to the feedback API. */
export default {
	component: ComponentFeedback,
	args: { mode: 'card', storyId: 'html/component/atom/h1', componentName: 'H1' },
	controls: { mode: { type: 'select', options: ['card', 'panel'] } },
	presets: { Panel: { mode: 'panel' } }
} satisfies ContractStory<RecipeComponentFeedback>;
