import SyntaxHighlightedCode from './index.svelte';
import type { RecipeSyntaxHighlightedCode } from '$stylist/development/interface/recipe/syntax-highlighted-code';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_SIZE } from '$stylist/design-token/const/array/size';
import { TOKEN_CODE_LANGUAGE } from '$stylist/development/const/array/code-language';
import { TOKEN_CODE_VIEW } from '$stylist/development/const/array/code-view';

/** Code with syntax highlighting. */
export default {
	component: SyntaxHighlightedCode,
	title: 'SyntaxHighlightedCode',
	description: 'Syntax highlighted code component for displaying code with syntax highlighting.',
	args: {
		code: `function greet(name) {
  console.log('Hello, ' + name + '!');

  return {
    message: 'Welcome to our app',
    timestamp: new Date().toISOString()
  };
}`,
		language: 'javascript',
		showLineNumbers: false,
		variant: 'default',
		size: 'md'
	},
	controls: {
		code: { type: 'text' },
		language: { type: 'select', options: TOKEN_CODE_LANGUAGE },
		showLineNumbers: { type: 'boolean' },
		variant: { type: 'select', options: TOKEN_CODE_VIEW },
		// xs … 2xl: fractions map onto the same six size classes.
		size: { type: 'select', options: TOKEN_SIZE.slice(0, 6) }
	},
	presets: {
		TypeScript: {
			language: 'typescript',
			code: `interface User {
  id: number;
  name: string;
  email: string;
}`
		},
		HTML: {
			language: 'html',
			code: `<div class="container">
  <h1>Hello World</h1>
  <p>Welcome to our app</p>
</div>`
		}
	}
} satisfies ContractStory<RecipeSyntaxHighlightedCode>;
