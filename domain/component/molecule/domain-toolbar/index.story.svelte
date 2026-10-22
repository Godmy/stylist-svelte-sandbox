<script lang="ts">
	// Render of index.story.ts: the active domain is controlled through onSelect and local state.
	import DomainToolbar from '$stylist/domain/component/molecule/domain-toolbar/index.svelte';
	import type { RecipeDomainToolbar } from '$stylist/domain/interface/recipe/domain-toolbar';

	let args: RecipeDomainToolbar = $props();
	// Follows the args and is overwritten by the toolbar selection.
	let active = $derived(args.active);
</script>

<DomainToolbar {...args} {active} onSelect={(name) => (active = name)} />
