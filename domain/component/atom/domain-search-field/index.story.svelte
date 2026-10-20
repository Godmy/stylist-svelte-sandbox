<script lang="ts">
	// Render of index.story.ts: the value is bound to local state that onEscape clears.
	import DomainSearchField from './index.svelte';
	import type { RecipeDomainSearchField } from '$stylist/domain/interface/recipe/domain-search-field';

	let args: RecipeDomainSearchField = $props();
	// Follows the args and is overwritten by typing and Escape.
	let value = $derived(args.value ?? '');
</script>

<div class="_c1">
	<DomainSearchField {...args} bind:value onEscape={() => (value = '')} />
	<p class="_c2">Value: {value || 'empty'}</p>
</div>

<style>
	._c1 {
		display: grid;
		gap: 0.5rem;
	}
	._c2 {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
</style>
