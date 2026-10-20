<script lang="ts">
	// Render of index.story.ts: the active cluster is controlled through onSelect and local state.
	import ClusterToolbar from './index.svelte';
	import type { RecipeClusterToolbar } from '$stylist/domain/interface/recipe/cluster-toolbar';

	let args: RecipeClusterToolbar = $props();
	// Follows the args and is overwritten by the toolbar selection.
	let active = $derived(args.active);
</script>

<ClusterToolbar {...args} {active} onSelect={(name) => (active = name)} />
