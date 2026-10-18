<script lang="ts">
	import DomainAiAgent from './index.svelte';
	import type { RecipeDomainAiAgent } from '$stylist/domain/interface/recipe/domain-ai-agent';

	// Render of index.story.ts: the close button needs local state to hide and reopen the panel.
	let args: RecipeDomainAiAgent = $props();
	let dismissed = $state(false);
	const open = $derived(Boolean(args.open) && !dismissed);
</script>

<div class="_c1">
	<DomainAiAgent {...args} {open} onClose={() => (dismissed = true)} />
	{#if dismissed}
		<button type="button" class="_c2" onclick={() => (dismissed = false)}>Reopen panel</button>
	{/if}
</div>

<style>
	._c1 {
		position: relative;
		min-height: 24rem;
	}
	._c2 {
		border-radius: 999px;
		border: 1px solid #e2e8f0;
		background: #ffffff;
		padding: 0.6rem 1rem;
		cursor: pointer;
	}
</style>
