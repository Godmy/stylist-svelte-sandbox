<script lang="ts">
	import createTokenTextState from '$stylist/token/component/atom/token-text/state.svelte';
	import TokenControlBase from '$stylist/token/component/atom/token-control-base/index.svelte';
	import type { RecipeTokenText } from '$stylist/token/interface/recipe/token-text';

	let props: RecipeTokenText = $props();
	const state = createTokenTextState(() => props);
</script>

<TokenControlBase definition={state.definition} layout="inline">
	<input
		class="token-text__input"
		type="text"
		value={state.value}
		placeholder={state.placeholder}
		oninput={state.handleInput}
	/>
</TokenControlBase>

<style>
	.token-text__input {
		min-width: min(100%, 15rem);
		min-height: 2.5rem;
		padding: 0.45rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid var(--md-sys-color-outline, #79747e);
		border-radius: 0.75rem;
		background: var(--md-sys-color-surface-container-low, #f7f2fa);
		color: var(--md-sys-color-on-surface, #1d1b20);
		transition:
			background 120ms ease,
			border-color 120ms ease;
	}

	.token-text__input:hover {
		background: color-mix(
			in srgb,
			var(--md-sys-color-primary, #6750a4) 6%,
			var(--md-sys-color-surface-container-low, #f7f2fa) 94%
		);
	}

	.token-text__input:focus {
		border-color: var(--md-sys-color-primary, #6750a4);
		outline: 2px solid var(--md-sys-color-primary, #6750a4);
		outline-offset: 2px;
	}
</style>
