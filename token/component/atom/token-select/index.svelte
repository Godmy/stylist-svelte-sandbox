<script lang="ts">
	import TokenControlBase from '$stylist/token/component/atom/token-control-base/index.svelte';
	import type { RecipeTokenSelect } from '$stylist/token/interface/recipe/token-select';
	import createTokenSelectState from '$stylist/token/component/atom/token-select/state.svelte';

	let props: RecipeTokenSelect = $props();
	const state = createTokenSelectState(() => props);
</script>

<TokenControlBase definition={state.definition} layout="inline">
	<select class="token-select__input" value={state.internalIndex} onchange={state.handleChange}>
		{#each state.definition.options as option, index}
			<option value={index}>{option.label}</option>
		{/each}
	</select>
</TokenControlBase>

<style>
	.token-select__input {
		box-sizing: border-box;
		--token-select-bg: var(--surface, var(--color-background-primary, #ffffff));
		--token-select-bg-muted: var(--bg, var(--color-background-secondary, #f8fafc));
		--token-select-border: var(--line, var(--color-border-primary, #79747e));
		--token-select-text: var(--text, var(--color-text-primary, #1d1b20));
		--token-select-accent: var(--accent, var(--color-primary-600, #6750a4));
		min-width: 0;
		width: 100%;
		min-height: 2.5rem;
		padding: 0.45rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid var(--token-select-border);
		border-radius: 0.75rem;
		background: var(--token-select-bg-muted);
		color: var(--token-select-text);
		cursor: pointer;
	}

	.token-select__input:hover {
		background: color-mix(in srgb, var(--token-select-accent) 10%, var(--token-select-bg) 90%);
	}

	.token-select__input:focus {
		outline: 2px solid var(--token-select-accent);
		outline-offset: 2px;
	}
</style>
