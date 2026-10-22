<script lang="ts">
	import type { RecipeSyntaxHighlightedCode } from '$stylist/development/interface/recipe/syntax-highlighted-code';
	import createSyntaxHighlightedCodeState from '$stylist/development/component/atom/syntax-highlighted-code/state.svelte';
	import Code from '$stylist/development/component/molecule/code-block/index.svelte';

	let props: RecipeSyntaxHighlightedCode = $props();

	const state = createSyntaxHighlightedCodeState(() => props);
</script>

<div {...props}>
	<Code
		code={state.code}
		language={state.language}
		showLineNumbers={state.showLineNumbers}
		class={state.containerClasses}
	/>
</div>

<style>
	:global(.shc) {
		border-radius: 0.375rem;
	}
	:global(.shc--default) {
		background-color: var(--color-neutral-900);
		color: var(--color-text-inverse);
	}
	:global(.shc--terminal) {
		background-color: var(--color-neutral-900);
		color: var(--color-success-400, #34d399);
		font-family: var(--font-mono, monospace);
	}
	:global(.shc--diff) {
		background-color: var(--color-background-secondary);
		color: var(--color-text-primary);
	}
	:global(.shc--xs) {
		font-size: 0.625rem;
		padding: 0.375rem;
	}
	:global(.shc--sm) {
		font-size: 0.75rem;
		padding: 0.5rem;
	}
	:global(.shc--md) {
		font-size: 0.875rem;
		padding: 1rem;
	}
	:global(.shc--lg) {
		font-size: 1rem;
		padding: 1.5rem;
	}
	:global(.shc--xl) {
		font-size: 1.125rem;
		padding: 2rem;
	}
	:global(.shc--2xl) {
		font-size: 1.25rem;
		padding: 2.5rem;
	}
</style>
