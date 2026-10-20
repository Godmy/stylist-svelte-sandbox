import CodeEditor from './index.svelte';
import type { RecipeCodeEditor } from '$stylist/development/interface/recipe/code-editor';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_CODE_LANGUAGE } from '$stylist/development/const/array/code-language';

/** Editable code area with copy, download and reset actions. */
export default {
	component: CodeEditor,
	title: 'Code Editor',
	description: 'Editable code area with a language label and copy, download and reset actions.',
	args: {
		code: `function greet(name) {\n  return "Hello, " + name + "!";\n}`,
		language: 'javascript',
		height: 300,
		readOnly: false,
		showLineNumbers: true,
		FONT_SIZE: 14,
		showCopyButton: true
	},
	controls: {
		code: { type: 'text' },
		language: { type: 'select', options: TOKEN_CODE_LANGUAGE },
		height: { type: 'number', min: 100, max: 800, step: 20 },
		width: { type: 'number', min: 200, max: 1200, step: 20 },
		readOnly: { type: 'boolean' },
		showLineNumbers: { type: 'boolean' },
		FONT_SIZE: { type: 'range', label: 'Font size', min: 10, max: 24, step: 1 },
		showCopyButton: { type: 'boolean' }
	},
	presets: { 'Read only': { readOnly: true } }
} satisfies ContractStory<RecipeCodeEditor>;
