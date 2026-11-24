<script lang="ts">
	import type { RecipeWorkspaceHints } from '$stylist/domain/interface/recipe/workspace-hints';
	import createWorkspaceHintsComponentState from '$stylist/domain/component/molecule/workspace-hints/state.svelte';

	let { root = '.c-domain-playground' }: RecipeWorkspaceHints = $props();
	const id = $props.id();
	const state = createWorkspaceHintsComponentState(() => ({ root: root, __id: id }));
</script>

{#if state.hint}
	<div
		bind:this={state.tooltip}
		{id}
		role="tooltip"
		class="workspace-hint"
		style:left="{state.left}px"
		style:top="{state.top}px"
	>
		{state.hint}
	</div>
{/if}

<style>
	.workspace-hint {
		position: fixed;
		z-index: 10000;
		pointer-events: none;
		max-width: min(320px, calc(100vw - 32px));
		padding: 0.5rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--color-primary-500) 20%, var(--color-border-primary));
		border-radius: 10px;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
		box-shadow: 0 6px 24px rgb(15 23 42 / 0.16);
		font: 500 12px/1.45 var(--font-family-sans, 'Segoe UI', sans-serif);
		overflow-wrap: anywhere;
	}
</style>
