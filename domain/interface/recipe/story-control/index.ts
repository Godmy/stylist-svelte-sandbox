import type { SlotStoryControl } from '$stylist/html/interface/slot/story-control';
export interface RecipeStoryControl {
	name: string;
	control: SlotStoryControl;
	value?: unknown;
	onChange?: (value: unknown) => void;
	/** The control is inferred from the arg value, not declared by the story. */
	auto?: boolean;
	class?: string;
}
