<script lang="ts">
	import TokenRadioControl from '$stylist/token/component/atom/token-radio/index.svelte';
	import TokenRangeControl from '$stylist/token/component/atom/token-range/index.svelte';
	import TokenSelectControl from '$stylist/token/component/atom/token-select/index.svelte';
	import TokenTextControl from '$stylist/token/component/atom/token-text/index.svelte';
	import type { RecipeToken } from '$stylist/token/interface/recipe/token';
	import createTokenControlComposerState from '$stylist/token/component/molecule/token/state.svelte';

	let props: RecipeToken = $props();
	const state = createTokenControlComposerState(() => props);
</script>

<div class="token">
	<div class="token__control">
		{#if state.radioDefinition}
			<TokenRadioControl
				definition={state.radioDefinition}
				value={state.value}
				onChange={state.onChange}
			/>
		{:else if state.selectDefinition}
			<TokenSelectControl
				definition={state.selectDefinition}
				value={state.value}
				onChange={state.onChange}
			/>
		{:else if state.rangeDefinition}
			<TokenRangeControl
				definition={state.rangeDefinition}
				value={state.rangeValue}
				onChange={(next) => state.onChange?.(next)}
			/>
		{:else if state.textDefinition}
			<TokenTextControl
				definition={state.textDefinition}
				value={state.textValue}
				onChange={(next) => state.onChange?.(next)}
			/>
		{/if}
	</div>
</div>

<style>
	.token {
		display: grid;
		width: 100%;
		color: var(--text, var(--color-text-primary, #1d1b20));
	}

	.token__control {
		min-width: 0;
	}
</style>
