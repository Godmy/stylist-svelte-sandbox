<script lang="ts">
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeRibbonMenu } from '$stylist/token/interface/recipe/ribbon-menu';
	import type { TokenIconName } from '$stylist/svg/type/alias/icon-name';

	type RibbonItem = {
		id: string;
		label: string;
		icon: TokenIconName;
	};

	const items: RibbonItem[] = [
		{ id: 'components', label: 'Components', icon: 'stylist-organism' },
		{ id: 'models', label: 'Models', icon: 'design-tokens-organism' },
		{ id: 'contracts', label: 'Contracts', icon: 'style' },
		{ id: 'colors', label: 'Colors', icon: 'colors' },
		{ id: 'styles', label: 'Styles', icon: 'style' },
		{ id: 'themes', label: 'Themes', icon: 'color-swatch' },
		{ id: 'tokens', label: 'Tokens', icon: 'design-tokens-organism' },
		{ id: 'icons', label: 'Icons', icon: 'favicon' }
	];

	let _props: RecipeRibbonMenu = $props();
	let opened = $state(false);
</script>

<div class="stylist-ribbon" class:opened>
	<button type="button" class="seed" onclick={() => (opened = true)} aria-label="Open stylist menu">
		<Icon name="stylist-organism" size={16} container="none" />
	</button>

	<div class="strip" class:opened aria-hidden={!opened}>
		<div class="strip-items">
			{#each items as item, index}
				<button
					type="button"
					class="node"
					class:opened
					style={`--i:${index};`}
					aria-label={item.label}
					title={item.label}
				>
					<Icon name={item.icon} size={14} container="none" />
					<span>{item.label}</span>
				</button>
			{/each}

			<button
				type="button"
				class="close"
				class:opened
				onclick={() => (opened = false)}
				aria-label="Close menu"
			>
				<Icon name="x" size={14} container="none" />
			</button>
		</div>
	</div>
</div>

<style>
	.stylist-ribbon {
		position: relative;
		display: grid;
		align-items: center;
		min-height: 54px;
	}

	.seed,
	.close {
		width: 48px;
		height: 48px;
		border-radius: 999px;
		border: 1px solid #1d4ed8;
		background: linear-gradient(145deg, #0f172a 0%, #1e3a8a 100%);
		color: #fff;
		display: grid;
		place-items: center;
		cursor: pointer;
		box-shadow: 0 10px 18px rgba(15, 23, 42, 0.28);
		z-index: 4;
	}

	.seed:focus-visible,
	.node:focus-visible,
	.close:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	.strip {
		position: absolute;
		left: 58px;
		top: 50%;
		transform: translateY(-50%);
		height: 54px;
		width: 0;
		border-radius: 999px;
		border: 1px solid #dbe7ff;
		background: #fff;
		box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
		opacity: 0;
		overflow: hidden;
		pointer-events: none;
		transition:
			width 520ms cubic-bezier(0.2, 1.06, 0.34, 1),
			opacity 220ms ease;
	}

	.strip.opened {
		width: 690px;
		opacity: 1;
		pointer-events: auto;
	}

	.strip-items {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0 0.3rem 0 0.45rem;
	}

	.node {
		border: 1px solid #d9e2ef;
		border-radius: 999px;
		background: #fff;
		color: #334155;
		height: 38px;
		padding: 0 0.55rem;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		cursor: pointer;
		transform: translateX(-6px);
		opacity: 0;
		transition:
			transform 280ms ease,
			opacity 220ms ease,
			border-color 140ms ease,
			color 140ms ease;
		transition-delay: calc(var(--i) * 38ms);
		white-space: nowrap;
		font-size: 0.75rem;
	}

	.node.opened {
		transform: translateX(0);
		opacity: 1;
	}

	.node:hover {
		border-color: #93c5fd;
		color: #1d4ed8;
	}

	.close {
		margin-left: 0.15rem;
		transform: scale(0.72) rotate(-22deg);
		opacity: 0;
		transition:
			transform 260ms ease,
			opacity 220ms ease;
		transition-delay: 320ms;
	}

	.close.opened {
		transform: scale(1) rotate(0deg);
		opacity: 1;
	}
</style>
