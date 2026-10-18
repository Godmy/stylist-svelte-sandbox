<script lang="ts">
	import ErrorBoundary from './index.svelte';
	import type { RecipeErrorBoundary } from '$stylist/development/interface/recipe/error-boundary';

	// Render of index.story.ts: without a component the boundary only shows its children snippet.
	let args: RecipeErrorBoundary = $props();
</script>

<ErrorBoundary {...args}>
	<div class="_c1">Boundary active. Inject a runtime error in this area to test fallback UI.</div>
</ErrorBoundary>

<style>
	._c1 {
		border-radius: 0.5rem;
		border-width: 1px;
		border-style: dashed;
		border-color: #d1d5db;
		padding: 1rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: #374151;
	}
</style>
