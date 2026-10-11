import type { Component } from 'svelte';
import type { ContractStory } from '$stylist/html/interface/contract/story';
export interface RecipeStoryCanvas {
	story: ContractStory;
	/** Current args; `story.args` when the host has not sent any yet. */
	args?: Record<string, unknown>;
	/** Optional `index.story.svelte` next to `index.story.ts`: custom render that receives args. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any component's props are the story args
	render?: Component<any> | null;
	class?: string;
}
