<script lang="ts">
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeTokenIcon } from '$stylist/token/interface/recipe/token-icon';

	let {
		title = 'Icon',
		icons = ['settings', 'palette', 'grid', 'motion', 'state'],
		value = icons[0] ?? '',
		class: className = '',
		onSelect
	}: RecipeTokenIcon = $props();
</script>

<div class={`token-icon ${className}`.trim()}>
	<div class="token-icon__label">{title}</div>
	<div class="token-icon__list" role="listbox" aria-label={title}>
		{#each icons as icon}
			<button
				type="button"
				role="option"
				class="token-icon__button"
				class:token-icon__button--active={value === icon}
				aria-label={icon}
				aria-selected={value === icon}
				onclick={() => onSelect?.(icon)}
			>
				<Icon name={icon} size={18} container="none" />
			</button>
		{/each}
	</div>
</div>

<style>
	.token-icon {
		display: grid;
		gap: 0.5rem;
		color: var(--md-sys-color-on-surface, #1d1b20);
	}

	.token-icon__label {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0;
		color: var(--md-sys-color-on-surface-variant, #49454f);
	}

	.token-icon__list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.token-icon__button {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
		border-radius: 0.75rem;
		background: var(--md-sys-color-surface-container-low, #f7f2fa);
		color: var(--md-sys-color-on-surface-variant, #49454f);
		cursor: pointer;
		transition:
			background 140ms ease,
			border-color 140ms ease,
			color 140ms ease,
			box-shadow 140ms ease;
	}

	.token-icon__button:hover {
		background: var(--md-sys-color-secondary-container, #e8def8);
		color: var(--md-sys-color-on-secondary-container, #1d192b);
	}

	.token-icon__button:focus-visible {
		outline: 2px solid var(--md-sys-color-primary, #6750a4);
		outline-offset: 2px;
	}

	.token-icon__button--active {
		border-color: var(--md-sys-color-primary, #6750a4);
		background: var(--md-sys-color-primary-container, #eaddff);
		color: var(--md-sys-color-on-primary-container, #21005d);
		box-shadow: inset 0 0 0 1px var(--md-sys-color-primary, #6750a4);
	}
</style>
