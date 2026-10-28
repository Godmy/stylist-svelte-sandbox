import StoryRunner from '$stylist/domain/component/organism/story-runner/index.svelte';
import type { RecipeStoryRunner } from '$stylist/domain/interface/recipe/story-runner';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Story runner that imports and mounts every story module of the workspace. */
export default {
	component: StoryRunner,
	title: 'StoryRunner',
	description: 'Runs story diagnostics by importing and mounting story modules in the workspace.',
	args: { compact: true },
	controls: { compact: { type: 'boolean' } },
	presets: { Full: { compact: false } }
} satisfies ContractStory<RecipeStoryRunner>;
