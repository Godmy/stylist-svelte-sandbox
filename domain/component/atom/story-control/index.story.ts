import StoryControl from './index.svelte';
import type { RecipeStoryControl } from '$stylist/domain/interface/recipe/story-control';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_SIZE } from '$stylist/design-token/const/array/size';

/** One control of the sandbox story panel, drawn for the type of its SlotStoryControl. */
export default {
	component: StoryControl,
	title: 'StoryControl',
	description:
		'One control of the sandbox story panel: text, number, boolean, select, range or color input, chosen by the control type.',
	args: {
		name: 'size',
		control: {
			type: 'select',
			label: 'Size',
			description: 'Size token of the component.',
			options: TOKEN_SIZE.slice(0, 6)
		},
		value: 'md'
	},
	controls: { name: { type: 'text' } },
	presets: {
		Text: { name: 'label', control: { type: 'text', label: 'Label' }, value: 'Click me' },
		Number: { name: 'count', control: { type: 'number', min: 0, max: 99 }, value: 12 },
		Range: {
			name: 'opacity',
			control: { type: 'range', label: 'Opacity', min: 0, max: 1, step: 0.1 },
			value: 0.6
		},
		Boolean: { name: 'disabled', control: { type: 'boolean', label: 'Disabled' }, value: true },
		Color: { name: 'accent', control: { type: 'color', label: 'Accent' }, value: '#3b82f6' }
	}
} satisfies ContractStory<RecipeStoryControl>;
