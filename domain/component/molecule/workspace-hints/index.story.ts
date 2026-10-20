import WorkspaceHints from './index.svelte';
import type { RecipeWorkspaceHints } from '$stylist/domain/interface/recipe/workspace-hints';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Hint tooltips; index.story.svelte provides the labelled controls inside the root it watches. */
export default {
	component: WorkspaceHints,
	title: 'WorkspaceHints',
	description:
		'Tooltip layer that shows the title, data-hint or aria-label of workspace controls on hover and focus.',
	args: { root: '.workspace-hints-demo' },
	controls: { root: { type: 'text' } }
} satisfies ContractStory<RecipeWorkspaceHints>;
