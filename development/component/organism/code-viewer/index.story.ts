import CodeViewer from '$stylist/development/component/organism/code-viewer/index.svelte';
import type { RecipeCodeViewer } from '$stylist/development/interface/recipe/code-viewer';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_CODE_LANGUAGE } from '$stylist/development/const/array/code-language';

const svelteCode =
	`<scr` +
	`ipt lang="ts">
  let count = $state(0);
</scr` +
	`ipt>

<button onclick={() => count++}>
  Count: {count}
</button>`;

/** Development-domain code viewer. */
export default {
	component: CodeViewer,
	title: 'Code Viewer',
	description:
		'Development-domain code viewer with syntax highlighting, copy, and download actions.',
	args: { code: svelteCode, componentName: 'Button', language: 'svelte' },
	controls: {
		code: { type: 'text' },
		componentName: { type: 'text' },
		language: { type: 'select', options: TOKEN_CODE_LANGUAGE },
		theme: { type: 'select', options: ['light', 'dark', 'github-light', 'github-dark'] }
	},
	presets: {
		Svelte: { code: svelteCode, language: 'svelte' },
		HTML: { code: '<button class="primary" type="button">Click me</button>', language: 'html' },
		CSS: {
			code: 'button {\n  color: #fff;\n  background: #2563eb;\n  padding: 0.5rem 1rem;\n}',
			language: 'css'
		}
	}
} satisfies ContractStory<RecipeCodeViewer>;
