<script lang="ts">
	import TokenControlBase from '$stylist/token/component/atom/token-control-base/index.svelte';
	import type { RecipeTokenRadio } from '$stylist/token/interface/recipe/token-radio';
	import createTokenRadioState from '$stylist/token/component/atom/token-radio/state.svelte';

	let props: RecipeTokenRadio = $props();
	const state = createTokenRadioState(() => props);
</script>

<TokenControlBase definition={state.definition} layout="inline">
	<div class="token-radio">
		{#each state.definition.options as option}
			<button
				type="button"
				class="token-radio__option"
				data-active={state.internalValue === option.value || undefined}
				onclick={() => state.selectOption(option.value)}
			>
				{option.label}
			</button>
		{/each}
	</div>
</TokenControlBase>

<style>
	.token-radio {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		--token-radio-bg: var(--surface, var(--color-background-primary, #ffffff));
		--token-radio-bg-muted: var(--bg, var(--color-background-secondary, #f8fafc));
		--token-radio-border: var(--line, var(--color-border-primary, #79747e));
		--token-radio-text: var(--text, var(--color-text-primary, #1d1b20));
		--token-radio-accent: var(--accent, var(--color-primary-600, #6750a4));
	}

	.token-radio__option {
		display: inline-flex;
		align-items: center;
		min-height: 2rem;
		padding: 0.35rem 0.65rem;
		border: 1px solid var(--token-radio-border);
		border-radius: 999px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		background: var(--token-radio-bg-muted);
		color: var(--token-radio-text);
		transition:
			background 120ms ease,
			border-color 120ms ease,
			color 120ms ease;
	}

	.token-radio__option:hover:not([data-disabled]) {
		background: color-mix(in srgb, var(--token-radio-accent) 12%, var(--token-radio-bg) 88%);
	}

	.token-radio__option:focus-visible {
		outline: 2px solid var(--token-radio-accent);
		outline-offset: 2px;
	}

	.token-radio__option[data-active] {
		border-color: var(--token-radio-accent);
		background: color-mix(in srgb, var(--token-radio-accent) 22%, var(--token-radio-bg) 78%);
		color: var(--token-radio-text);
	}
</style>
