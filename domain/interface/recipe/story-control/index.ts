import type { SlotStoryControl } from '$stylist/domain/interface/slot/story-control';
export interface RecipeStoryControl {
	name: string;
	control: SlotStoryControl;
	value?: unknown;
	onChange?: (value: unknown) => void;
	class?: string;
}
