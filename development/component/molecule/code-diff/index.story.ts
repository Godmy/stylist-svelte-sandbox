import CodeDiff from '$stylist/development/component/molecule/code-diff/index.svelte';
import type { RecipeCodeDiff } from '$stylist/development/interface/recipe/code-diff';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_CODE_LANGUAGE } from '$stylist/development/const/array/code-language';

/** Visual comparison between old and new code versions. */
export default {
	component: CodeDiff,
	title: 'CodeDiff',
	description: 'Visual comparison between old and new code versions.',
	args: {
		original: `function total(items) {\n  let sum = 0;\n  for (const item of items) sum += item.price;\n  return sum;\n}`,
		modified: `function total(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}`,
		language: 'javascript',
		showLineNumbers: true
	},
	controls: {
		original: { type: 'text' },
		modified: { type: 'text' },
		language: { type: 'select', options: TOKEN_CODE_LANGUAGE },
		showLineNumbers: { type: 'boolean' }
	},
	presets: {
		Refactor: {
			original: `function total(items) {\n  let sum = 0;\n  for (const item of items) sum += item.price;\n  return sum;\n}`,
			modified: `function total(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}`
		},
		Bugfix: {
			original: `function divide(a, b) {\n  return a / b;\n}`,
			modified: `function divide(a, b) {\n  if (b === 0) throw new Error('Cannot divide by zero');\n  return a / b;\n}`
		}
	}
} satisfies ContractStory<RecipeCodeDiff>;
