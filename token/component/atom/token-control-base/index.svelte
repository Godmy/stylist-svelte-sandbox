<script lang="ts">
	import type { RecipeTokenControlBase } from '$stylist/token/interface/recipe/token-control-base';
	import createTokenControlBaseState from '$stylist/token/component/atom/token-control-base/state.svelte';

	let props: RecipeTokenControlBase = $props();
	const state = createTokenControlBaseState(() => props);
</script>

<article class={state.cssClass}>
	<header class="token-control-base__header">
		<div class="token-control-base__name-row">
			<svg
				class="token-control-base__icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d={state.iconPath} />
			</svg>
			<div class="token-control-base__name">{state.definition.tokenName}</div>
			<sup class="token-control-base__count">{state.tokenCount}</sup>
		</div>
		{#if state.description}
			<p class="token-control-base__description">{state.description}</p>
		{/if}
	</header>
	<div class="token-control-base__body">
		{#if state.children}{@render state.children()}{/if}
	</div>
</article>

<style>
	.token-control-base {
		box-sizing: border-box;
		--token-control-bg: var(--surface, var(--color-background-primary, #ffffff));
		--token-control-bg-muted: var(--bg, var(--color-background-secondary, #f8fafc));
		--token-control-border: var(--line, var(--color-border-primary, #cbd5e1));
		--token-control-text: var(--text, var(--color-text-primary, #1d1b20));
		--token-control-muted: var(--muted, var(--color-text-secondary, #49454f));
		--token-control-accent: var(--accent, var(--color-primary-600, #6750a4));
		border: 1px solid var(--token-control-border);
		border-radius: 0.75rem;
		background: var(--token-control-bg);
		color: var(--token-control-text);
		padding: var(--spacing-3, 1rem);
		display: grid;
		gap: var(--spacing-2, 0.75rem);
		justify-self: stretch;
		min-width: 0;
		width: 100%;
		max-width: 100%;
		box-shadow: 0 1px 2px rgba(29, 27, 32, 0.08);
	}

	.token-control-base__header {
		display: grid;
		gap: var(--spacing-1, 0.35rem);
		min-width: 0;
	}

	.token-control-base__name-row {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-1, 0.45rem);
		min-width: 0;
	}

	.token-control-base__icon {
		width: 1rem;
		height: 1rem;
		flex: 0 0 auto;
		color: var(--token-control-muted);
	}

	.token-control-base__name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--font-size-3, 0.875rem);
		font-weight: var(--font-weight-bold, 700);
		color: var(--token-control-text);
	}

	.token-control-base__count {
		font-size: 0.75rem;
		line-height: 1;
		font-weight: 700;
		color: var(--token-control-text);
		border: 1px solid
			color-mix(in srgb, var(--token-control-accent) 24%, var(--token-control-border) 76%);
		border-radius: 999px;
		background: color-mix(
			in srgb,
			var(--token-control-bg-muted) 84%,
			var(--token-control-accent) 16%
		);
		padding: 0.15rem 0.35rem;
	}

	.token-control-base__description {
		margin: 0;
		font-size: var(--font-size-3, 0.875rem);
		color: var(--token-control-muted);
	}

	.token-control-base__body {
		display: grid;
		gap: var(--spacing-2, 0.75rem);
		min-width: 0;
	}

	.token-control-base--inline {
		grid-template-columns: minmax(0, 14rem) minmax(0, 1fr);
		align-items: center;
		gap: var(--spacing-3, 1rem);
	}

	.token-control-base--inline .token-control-base__header {
		display: block;
	}

	.token-control-base--inline .token-control-base__body {
		display: block;
	}

	@media (max-width: 640px) {
		.token-control-base--inline {
			grid-template-columns: 1fr;
		}
	}
</style>
