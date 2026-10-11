import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { HtmlNode } from '$stylist/html/type/alias/html-node';
export interface RecipeStoryControls {
	story: ContractStory;
	/** Receives the full current args and content after every change, including the initial ones. */
	onChange?: (args: Record<string, unknown>, content?: readonly HtmlNode[]) => void;
	/** HTML of the story for the current args and content; enables the HTML tab. */
	markup?: (args: Record<string, unknown>, content?: readonly HtmlNode[]) => string | null;
	class?: string;
}
