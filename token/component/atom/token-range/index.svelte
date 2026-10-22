<script lang="ts">
	import TokenControlBase from '$stylist/token/component/atom/token-control-base/index.svelte';
	import type { RecipeTokenRange } from '$stylist/token/interface/recipe/token-range';
	import createTokenRangeState from '$stylist/token/component/atom/token-range/state.svelte';

	let props: RecipeTokenRange = $props();
	const state = createTokenRangeState(() => props);
</script>

<TokenControlBase definition={state.definition} layout="inline">
	<div class="token-range">
		<input
			class="token-range__input"
			type="range"
			min={state.definition.min}
			max={state.definition.max}
			step={state.definition.step ?? 1}
			value={state.internalValue}
			oninput={state.handleInput}
		/>
		<span class="token-range__value">{state.internalValue}</span>
	</div>
</TokenControlBase>

<style>
	.token-range {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.75rem;
		align-items: center;
		min-width: min(100%, 15rem);
	}

	.token-range__value {
		display: inline-grid;
		place-items: center;
		min-width: 3rem;
		min-height: 2rem;
		border-radius: 999px;
		background: var(--md-sys-color-secondary-container, #e8def8);
		color: var(--md-sys-color-on-secondary-container, #1d192b);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.token-range__input {
		appearance: none;
		width: 100%;
		height: 0.35rem;
		border-radius: 999px;
		background: var(--md-sys-color-outline-variant, #cac4d0);
		cursor: pointer;
	}

	.token-range__input:focus-visible {
		outline: 2px solid var(--md-sys-color-primary, #6750a4);
		outline-offset: 0.35rem;
	}

	.token-range__input::-webkit-slider-thumb {
		appearance: none;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: var(--md-sys-color-primary, #6750a4);
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(29, 27, 32, 0.24);
	}

	.token-range__input::-moz-range-thumb {
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: var(--md-sys-color-primary, #6750a4);
		cursor: pointer;
		border: none;
		box-shadow: 0 1px 3px rgba(29, 27, 32, 0.24);
	}
</style>
