/** One control of the story panel; the key in `ContractStory.controls` is the arg name. */
export interface SlotStoryControl {
	type: 'text' | 'number' | 'boolean' | 'select' | 'range' | 'color';
	label?: string;
	description?: string;
	options?: readonly (string | number)[];
	min?: number;
	max?: number;
	step?: number;
}
