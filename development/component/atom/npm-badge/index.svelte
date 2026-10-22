<script lang="ts">
	import createNpmBadgeState from '$stylist/development/component/atom/npm-badge/state.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
	import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
	import type { RecipeNpmBadge } from '$stylist/development/interface/recipe/npm-badge';

	let props: RecipeNpmBadge & HTMLAttributes<HTMLElement> & SlotThemeBorder & SlotTypography =
		$props();

	const state = createNpmBadgeState(() => props);
	const value = $derived(props.value);
	const link = $derived(props.link);
	const restProps = $derived(
		(() => {
			const {
				class: _class,
				type: _type,
				label: _label,
				value: _value,
				link: _link,
				...rest
			} = props;
			return rest;
		})()
	);
</script>

{#if link}
	<a href={link} class={state.linkClasses} target="_blank" rel="noopener noreferrer" {...restProps}>
		<span class={state.classes}>
			<span class="npm-badge-label">{state.label}:</span>
			<span class="npm-badge-value">{value}</span>
		</span>
	</a>
{:else}
	<span class={state.classes} {...restProps}>
		<span class="npm-badge-label">{state.label}:</span>
		<span class="npm-badge-value">{value}</span>
	</span>
{/if}

<style>
	.npm-badge-link {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		color: inherit;
		text-decoration: none;
	}

	.npm-badge-link:hover {
		opacity: var(--opacity-80, 0.8);
	}

	.npm-badge {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		max-width: 100%;
		padding: 0.125rem 0.625rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.25rem;
		overflow-wrap: anywhere;
	}

	.npm-badge--version {
		background: var(--color-primary-100);
		color: var(--color-primary-800);
	}

	.npm-badge--downloads {
		background: var(--color-success-100);
		color: var(--color-success-800);
	}

	.npm-badge--license {
		background: var(--color-secondary-100);
		color: var(--color-secondary-800);
	}

	.npm-badge--size {
		background: var(--color-warning-100);
		color: var(--color-warning-800);
	}

	.npm-badge--custom {
		background: var(--color-neutral-100);
		color: var(--color-neutral-800);
	}

	.npm-badge-label {
		font-weight: 600;
	}
	.npm-badge-value {
		margin-left: 0.25rem;
	}
</style>
