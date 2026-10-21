import GenericCodeViewer from './index.svelte';
import type { RecipeGenericCodeViewer } from '$stylist/development/interface/recipe/generic-code-viewer';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_CODE_LANGUAGE } from '$stylist/development/const/array/code-language';

const svelteCode =
	`<scr` +
	`ipt lang="ts">
  let value = $state('');
</scr` +
	`ipt>

<input bind:value placeholder="Type here..." />`;

/** Syntax-highlighted code viewer for arbitrary source snippets. */
export default {
	component: GenericCodeViewer,
	title: 'Generic Code Viewer',
	description: 'Development-domain syntax-highlighted code viewer for arbitrary source snippets.',
	args: {
		code: svelteCode,
		language: 'svelte'
	},
	controls: {
		code: { type: 'text' },
		language: { type: 'select', options: TOKEN_CODE_LANGUAGE }
	},
	presets: {
		Svelte: { code: svelteCode, language: 'svelte' },
		HTML: { code: '<button class="primary" type="button">Click me</button>', language: 'html' },
		CSS: {
			code: 'button {\n  color: #fff;\n  background: #2563eb;\n  padding: 0.5rem 1rem;\n}',
			language: 'css'
		}
	}
} satisfies ContractStory<RecipeGenericCodeViewer>;
