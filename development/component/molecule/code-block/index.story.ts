import CodeBlock from '$stylist/development/component/molecule/code-block/index.svelte';
import type { RecipeCodeBlock } from '$stylist/development/interface/recipe/code-block';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_CODE_LANGUAGE } from '$stylist/development/const/array/code-language';

/** General code renderer. */
export default {
	component: CodeBlock,
	title: 'Code',
	description: 'General code renderer with optional title, line numbers and copy action.',
	args: {
		code: 'function hello(name) {\n  return `Hello, ${name}`;\n}\n\nhello("World");',
		language: 'javascript',
		showLineNumbers: false,
		copyable: true,
		copyOnHover: false,
		title: 'Example snippet'
	},
	controls: {
		code: { type: 'text' },
		language: { type: 'select', options: TOKEN_CODE_LANGUAGE },
		showLineNumbers: { type: 'boolean' },
		copyable: { type: 'boolean' },
		copyOnHover: { type: 'boolean' },
		title: { type: 'text' }
	},
	presets: {
		'Secondary preview': {
			code: `const endpoint = '/api/orders';\nfetch(endpoint);`,
			language: 'javascript',
			title: 'Secondary preview',
			tags: ['api', 'fetch'],
			copyable: true,
			copyOnHover: true
		},
		'Highlighted lines': { showLineNumbers: true, highlightLines: [2] }
	}
} satisfies ContractStory<RecipeCodeBlock>;
