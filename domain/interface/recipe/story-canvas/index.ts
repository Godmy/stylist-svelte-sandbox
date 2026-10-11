import type { Component } from 'svelte';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { HtmlNode } from '$stylist/html/type/alias/html-node';
import type { ContractPreviewEnvironment } from '../../contract/preview-environment';
export interface RecipeStoryCanvas {
	story: ContractStory;
	/** Current args; `story.args` when the host has not sent any yet. */
	args?: Record<string, unknown>;
	/** Current content; `story.content` when the host has not sent any yet. */
	content?: readonly HtmlNode[];
	/** Opt-in visual HTML preview environment; never spread into component props. */
	environment?: ContractPreviewEnvironment;
	/** Optional `index.story.svelte` next to `index.story.ts`: custom render that receives args. */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any component's props are the story args
	render?: Component<any> | null;
	class?: string;
}
