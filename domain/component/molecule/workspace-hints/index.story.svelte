<script lang="ts">
	// Render of index.story.ts: the hint layer only decorates existing controls, so the story renders some inside its root.
	import WorkspaceHints from '$stylist/domain/component/molecule/workspace-hints/index.svelte';
	import type { RecipeWorkspaceHints } from '$stylist/domain/interface/recipe/workspace-hints';

	let args: RecipeWorkspaceHints = $props();
</script>

<div class="workspace-hints-demo">
	<button type="button" title="Reload the manifest">Reload</button>
	<button type="button" aria-label="Open settings">⚙</button>
	<button type="button" data-hint="Copy the entity path">Copy</button>
</div>
<WorkspaceHints {...args} />

<style>
	.workspace-hints-demo {
		display: flex;
		gap: 0.75rem;
	}
</style>
