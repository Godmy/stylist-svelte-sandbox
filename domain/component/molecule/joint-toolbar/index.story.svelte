<script lang="ts">
	// Render of index.story.ts: the active joint is controlled through onSelect and local state.
	import JointToolbar from './index.svelte';
	import type { RecipeJointToolbar } from '$stylist/domain/interface/recipe/joint-toolbar';

	let args: RecipeJointToolbar = $props();
	// Follows the args and is overwritten by the toolbar selection.
	let active = $derived(args.active);
</script>

<JointToolbar {...args} {active} onSelect={(name) => (active = name)} />
