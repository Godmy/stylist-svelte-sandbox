import StoryCanvas from './index.svelte';
import type { RecipeStoryCanvas } from '$stylist/domain/interface/recipe/story-canvas';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Story canvas; index.story.svelte supplies the previewed story, which is not serializable. */
export default {
	component: StoryCanvas,
	title: 'StoryCanvas',
	description: 'Canvas that renders a story with its args, content and preview environment.',
	args: {
		args: { type: 'button' },
		content: [{ kind: 'text', value: 'Save changes' }],
		environment: { skin: true }
	},
	controls: { class: { type: 'text' } },
	presets: {
		Disabled: { args: { type: 'button', disabled: true } },
		'Without skin': { environment: { skin: false } }
	}
} satisfies ContractStory<RecipeStoryCanvas>;
