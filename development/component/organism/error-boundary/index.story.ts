import ErrorBoundary from '$stylist/development/component/organism/error-boundary/index.svelte';
import type { RecipeErrorBoundary } from '$stylist/development/interface/recipe/error-boundary';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Wrapper that shows a fallback when a dynamically rendered component throws; index.story.svelte supplies the children. */
export default {
	component: ErrorBoundary,
	title: 'Error Boundary',
	description:
		'Development-domain wrapper for previewing fallback behavior around dynamic component rendering.',
	args: {
		component: null
	}
} satisfies ContractStory<RecipeErrorBoundary>;
