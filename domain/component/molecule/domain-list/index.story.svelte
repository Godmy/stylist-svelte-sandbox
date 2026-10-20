<script lang="ts">
	// Render of index.story.ts: the active path is controlled through onSelect and the list needs a bounded height.
	import DomainList from './index.svelte';
	import type { RecipeDomainList } from '$stylist/domain/interface/recipe/domain-list';

	let args: RecipeDomainList = $props();
	// Follows the args and is overwritten by the list selection.
	let activePath = $derived(args.activePath);
</script>

<div class="_c1">
	<DomainList {...args} {activePath} onSelect={(path) => (activePath = path)} />
</div>

<style>
	._c1 {
		height: 20rem;
		overflow: hidden;
	}
</style>
