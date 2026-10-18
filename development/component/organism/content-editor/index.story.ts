import ContentEditor from './index.svelte';
import type { RecipeContentEditorStateProps } from '$stylist/development/interface/recipe/content-editor-state-props';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Rich content editor with multiple content types and formatting tools. */
export default {
	component: ContentEditor,
	title: 'ContentEditor',
	description: 'Rich content editor with multiple content types and formatting tools.',
	args: {
		initialContent: [
			{ id: '1', type: 'header', content: 'Welcome to Our Blog' },
			{ id: '2', type: 'text', content: 'This is the beginning of our new article.' },
			{ id: '3', type: 'quote', content: 'The only way to do great work is to love what you do.' }
		],
		placeholder: 'Start writing your content here...',
		showToolbar: true,
		showPreviewButton: true
	},
	controls: {
		placeholder: { type: 'text' },
		showToolbar: { type: 'boolean' },
		showPreviewButton: { type: 'boolean' }
	},
	presets: { Empty: { initialContent: [{ id: '1', type: 'text', content: '' }] } }
} satisfies ContractStory<RecipeContentEditorStateProps>;
