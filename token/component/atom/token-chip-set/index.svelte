<script lang="ts">
	import type { RecipeTokenChipSet } from '$stylist/token/interface/recipe/token-chip-set';
	import createTokenChipSetState from '$stylist/token/component/atom/token-chip-set/state.svelte';

	let props: RecipeTokenChipSet = $props();
	const state = createTokenChipSetState(() => props);

	const restProps = $derived.by(() => {
		const {
			class: _class,
			title: _title,
			tokens: _tokens,
			value: _value,
			dedupe: _dedupe,
			onSelect: _onSelect,
			...rest
		} = props;
		return rest;
	});
</script>

<div class={`token-chip-set ${state.className}`.trim()}>
	<div class="token-chip-set__title">{state.title}</div>
	<div class="token-chip-set__items">
		{#each state.displayTokens as token}
			<button
				type="button"
				class={`token-chip-set__chip ${state.value === token ? 'token-chip-set__chip--active' : ''}`.trim()}
				onclick={() => state.onSelect?.(token)}
				{...restProps}
			>
				{token}
			</button>
		{/each}
	</div>
</div>

<style>
	.token-chip-set {
		display: grid;
		grid-template-columns: minmax(8rem, 12rem) minmax(0, 1fr);
		gap: 0.75rem;
		align-items: start;
		color: var(--md-sys-color-on-surface, #1d1b20);
	}

	.token-chip-set__title {
		padding-top: 0.45rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--md-sys-color-on-surface-variant, #49454f);
	}

	.token-chip-set__items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.token-chip-set__chip {
		min-height: 2rem;
		border: 1px solid var(--md-sys-color-outline, #79747e);
		border-radius: 999px;
		background: var(--md-sys-color-surface-container-low, #f7f2fa);
		color: var(--md-sys-color-on-surface, #1d1b20);
		padding: 0.35rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			background 120ms ease,
			border-color 120ms ease,
			color 120ms ease;
	}

	.token-chip-set__chip:hover {
		background: color-mix(
			in srgb,
			var(--md-sys-color-primary, #6750a4) 8%,
			var(--md-sys-color-surface-container-low, #f7f2fa) 92%
		);
	}

	.token-chip-set__chip:focus-visible {
		outline: 2px solid var(--md-sys-color-primary, #6750a4);
		outline-offset: 2px;
	}

	.token-chip-set__chip--active {
		border-color: var(--md-sys-color-primary, #6750a4);
		background: var(--md-sys-color-secondary-container, #e8def8);
		color: var(--md-sys-color-on-secondary-container, #1d192b);
	}

	@media (max-width: 720px) {
		.token-chip-set {
			grid-template-columns: 1fr;
		}
	}
</style>
