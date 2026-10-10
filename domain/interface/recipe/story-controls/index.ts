import type { ContractStory } from '$stylist/domain/interface/contract/story';
export interface RecipeStoryControls {
	story: ContractStory;
	/** Receives the full current args after every change, including the initial ones. */
	onChange?: (args: Record<string, unknown>) => void;
	class?: string;
}
