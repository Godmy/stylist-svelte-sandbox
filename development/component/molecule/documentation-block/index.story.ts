import DocumentationBlock from './index.svelte';
import type { RecipeDocumentationBlock } from '$stylist/development/interface/recipe/documentation-block';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_COLOR_TONE } from '$stylist/design-token/const/array/color-tone';

/** Rich documentation section with HTML content and optional code examples. */
export default {
	component: DocumentationBlock,
	title: 'DocumentationBlock',
	description: 'Rich documentation section with HTML content and optional code examples.',
	args: {
		title: 'Deployment Guide',
		variant: 'info',
		tags: ['docs', 'deploy'],
		content: `
    <h3>Overview</h3>
    <p>This block explains deployment prerequisites and rollout sequence.</p>
    <h3>Checklist</h3>
    <ul>
      <li>Run tests</li>
      <li>Build artifacts</li>
      <li>Monitor first 15 minutes</li>
    </ul>
  `,
		codeExamples: [
			{
				title: 'Build command',
				code: 'yarn check\nyarn build',
				language: 'bash',
				showLineNumbers: true
			},
			{
				title: 'Deploy command',
				code: 'kubectl apply -f deploy.yaml',
				language: 'bash',
				showLineNumbers: false
			}
		]
	},
	controls: {
		title: { type: 'text' },
		// default, success, info, warning, danger: the tones the block styles.
		variant: { type: 'select', options: [TOKEN_COLOR_TONE[0], ...TOKEN_COLOR_TONE.slice(5, 9)] },
		content: { type: 'text', description: 'HTML content of the block.' }
	},
	presets: {
		'Without code examples': { codeExamples: [] },
		Warning: { variant: 'warning', title: 'Breaking changes', tags: ['docs', 'migration'] }
	}
} satisfies ContractStory<RecipeDocumentationBlock>;
