import type { Component } from 'svelte';
import type { HtmlNode } from '$stylist/html/type/alias/html-node';
import type { SlotStoryControl } from '$stylist/domain/interface/slot/story-control';

/**
 * `index.story.ts` contract between a component and the sandbox host. Typed by the
 * component recipe, so renamed or retyped props break the story at compile time.
 * The host renders controls in the sandbox window and passes args to the iframe,
 * so args must stay structured-cloneable (no functions, no DOM nodes).
 */
export interface ContractStory<TArgs extends object = Record<string, unknown>> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any component's props are the story args
	component: Component<any>;
	/** Values the story starts with. */
	args?: Partial<TArgs>;
	controls?: { [K in keyof TArgs & string]?: SlotStoryControl };
	/** Named arg sets applied over `args`. */
	presets?: Record<string, Partial<TArgs>>;
	/** Children snippet content as an HTML tree, rendered with the html `Node`. */
	content?: readonly HtmlNode[];
	/** `padded` (default), `centered` or `fullscreen` (no padding, full height). */
	layout?: 'padded' | 'centered' | 'fullscreen';
}
