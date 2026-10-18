<script lang="ts">
	// Render of index.story.ts: the toggle only reports clicks, so the story owns the open state.
	import DomainSearchToggle from './index.svelte';
	import type { RecipeDomainSearchToggle } from '$stylist/domain/interface/recipe/domain-search-toggle';

	let args: RecipeDomainSearchToggle = $props();
	// Follows the args and is overwritten by the toggle.
	let open = $derived(args.open ?? false);
</script>

<div class="_c1">
	<DomainSearchToggle {...args} {open} onToggle={() => (open = !open)} />
	<p class="_c2">State: {open ? 'open' : 'closed'}</p>
</div>

<style>
	._c1 {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	._c2 {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
</style>
