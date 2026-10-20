import MarkdownRenderer from './index.svelte';
import type { RecipeMarkdownRenderer } from '$stylist/domain/interface/recipe/markdown-renderer';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Renderer for markdown content inside documentation, notes, and file previews. */
export default {
	component: MarkdownRenderer,
	title: 'Markdown Renderer',
	description:
		'Information-domain renderer for markdown content inside documentation, notes, and file previews.',
	args: {
		content: `# Release Notes

The renderer supports **strong emphasis**, inline \`code\`, lists, blockquotes, and tables.

- Improved component catalog navigation
- Added typed domain moves for playground entities
- Refreshed story previews after migration

> Markdown content keeps inherited text color and spacing.

| Area | Status |
| --- | --- |
| Components | Updated |
| Stories | Reviewed |

\`\`\`ts
export const status = 'ready';
\`\`\`
`,
		class: ''
	},
	controls: { content: { type: 'text' }, class: { type: 'text' } }
} satisfies ContractStory<RecipeMarkdownRenderer>;
