import ComponentPreview from './index.svelte';
import type { RecipeComponentPreview } from '$stylist/development/interface/recipe/component-preview';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_CODE_LANGUAGE } from '$stylist/development/const/array/code-language';

/** Preview card with a demo/code tab switch; index.story.svelte supplies the demo snippet. */
export default {
	component: ComponentPreview,
	title: 'ComponentPreview',
	description: 'Preview card with demo/code tab switch and configurable snippet text.',
	args: {
		title: 'Primary Button',
		description: 'Button used for key actions in forms.',
		code: '<Button variant="primary">Save</Button>',
		language: 'svelte',
		showCode: false,
		demoVariant: 'primary'
	},
	controls: {
		title: { type: 'text' },
		description: { type: 'text' },
		code: { type: 'text' },
		language: { type: 'select', options: TOKEN_CODE_LANGUAGE },
		showCode: { type: 'boolean', description: 'Opens the code tab first (read on mount).' },
		// Story-only knob: styles the demo button of the render, not a component prop.
		demoVariant: {
			type: 'select',
			options: ['primary', 'secondary', 'danger'],
			description: 'Style of the demo button inside the preview.'
		}
	}
} satisfies ContractStory<RecipeComponentPreview & { demoVariant?: string }>;
