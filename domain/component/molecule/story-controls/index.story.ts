import StoryControls from './index.svelte';
import type { RecipeStoryControls } from '$stylist/domain/interface/recipe/story-controls';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Story controls panel; index.story.svelte supplies the edited story and its markup, which are not serializable. */
export default {
	component: StoryControls,
	title: 'StoryControls',
	description:
		'Controls panel that edits story args and text content and shows the resulting HTML.',
	args: {},
	controls: { class: { type: 'text' } }
} satisfies ContractStory<RecipeStoryControls>;
