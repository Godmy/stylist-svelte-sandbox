<script lang="ts">
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeOrbitContractL5 } from '$stylist/token/interface/recipe/orbit-contract-l5';

	let {
		opened: openedExternal = null,
		showCore = true,
		showCaption = true
	}: RecipeOrbitContractL5 = $props();

	type OrbitGroup = 'architecture' | 'information' | 'interaction';

	type OrbitNode = {
		id: string;
		icon: string;
		group: OrbitGroup;
		index: number;
		count: number;
		radius: string;
	};

	const nodes: OrbitNode[] = [
		{
			id: 'component-size',
			icon: 'component-size',
			group: 'architecture',
			index: 0,
			count: 2,
			radius: '68px'
		},
		{ id: 'style', icon: 'style', group: 'architecture', index: 1, count: 2, radius: '68px' },

		{ id: 'variants', icon: 'variants', group: 'information', index: 0, count: 2, radius: '102px' },
		{
			id: 'text-element',
			icon: 'text-element',
			group: 'information',
			index: 1,
			count: 2,
			radius: '102px'
		},

		{
			id: 'animations',
			icon: 'animations',
			group: 'interaction',
			index: 0,
			count: 3,
			radius: '136px'
		},
		{ id: 'controls', icon: 'controls', group: 'interaction', index: 1, count: 3, radius: '136px' },
		{ id: 'state', icon: 'state', group: 'interaction', index: 2, count: 3, radius: '136px' }
	];

	let openedLocal = $state(false);
	let active = $state<string>('component-size');
	const opened = $derived(openedExternal ?? openedLocal);

	function toggleOpened(): void {
		if (openedExternal === null) {
			openedLocal = !openedLocal;
		}
	}
</script>

<div class="orbit-l5" class:opened>
	<div class="stage">
		<div class="system" class:opened>
			<div class="orbit orbit-architecture" aria-hidden="true"></div>
			<div class="orbit orbit-information" aria-hidden="true"></div>
			<div class="orbit orbit-interaction" aria-hidden="true"></div>

			{#each nodes as node}
				<button
					type="button"
					class="node"
					class:opened
					class:active={active === node.id}
					class:architecture={node.group === 'architecture'}
					class:information={node.group === 'information'}
					class:interaction={node.group === 'interaction'}
					style={`--index:${node.index}; --count:${node.count}; --radius:${node.radius};`}
					onclick={() => (active = node.id)}
					aria-label={node.id}
					title={node.id}
				>
					<Icon name={node.icon} size={16} container="none" />
				</button>
			{/each}
		</div>

		{#if showCore}
			<button
				type="button"
				class="core"
				onclick={toggleOpened}
				aria-expanded={opened}
				aria-label="Toggle L5 orbit menu"
			>
				<span class="face icon-face" aria-hidden={opened}>
					<Icon name="ontology-node-component" size={16} container="none" />
				</span>
				<span class="face close-face" aria-hidden={!opened}>
					<span></span>
					<span></span>
				</span>
			</button>
		{/if}
	</div>

	{#if showCaption}
		<p class="caption">
			Graph node contract controls: <strong>{active}</strong>
		</p>
	{/if}
</div>

<style>
	.orbit-l5 {
		width: 360px;
		display: grid;
		justify-items: center;
		gap: 0.75rem;
	}

	.stage {
		position: relative;
		width: 320px;
		height: 320px;
		display: grid;
		place-items: center;
	}

	.system {
		position: relative;
		width: 320px;
		height: 320px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		background: radial-gradient(
			circle at 34% 24%,
			rgba(255, 255, 255, 0.96) 0%,
			rgba(230, 242, 255, 0.94) 58%,
			rgba(209, 228, 255, 0.92) 100%
		);
		border: 1px solid #c9ddff;
		box-shadow:
			inset 0 1px 0 #fff,
			0 20px 34px rgba(29, 78, 216, 0.2);
		transform: scale(0.2);
		opacity: 0;
		transition:
			transform 430ms cubic-bezier(0.2, 1.1, 0.34, 1),
			opacity 320ms ease;
		pointer-events: none;
	}

	.system.opened {
		transform: scale(1);
		opacity: 1;
		pointer-events: auto;
	}

	.orbit {
		position: absolute;
		border-radius: 999px;
		border: 1px dashed transparent;
		opacity: 0;
		transform: scale(0.78);
		transition:
			transform 360ms ease,
			opacity 360ms ease,
			border-color 360ms ease;
	}

	.orbit-architecture {
		width: 148px;
		height: 148px;
		border-color: rgba(37, 99, 235, 0.5);
		transition-delay: 70ms;
	}

	.orbit-information {
		width: 216px;
		height: 216px;
		border-color: rgba(14, 116, 144, 0.45);
		transition-delay: 130ms;
	}

	.orbit-interaction {
		width: 282px;
		height: 282px;
		border-color: rgba(147, 51, 234, 0.4);
		transition-delay: 190ms;
	}

	.system.opened .orbit {
		opacity: 1;
		transform: scale(1);
	}

	.node {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 36px;
		height: 36px;
		margin-left: -18px;
		margin-top: -18px;
		border-radius: 999px;
		border: 1px solid #c8dafb;
		background: #fff;
		color: #1e3a8a;
		display: grid;
		place-items: center;
		cursor: pointer;
		transform: rotate(calc((360deg / var(--count)) * var(--index))) translate(var(--radius))
			rotate(calc((-360deg / var(--count)) * var(--index))) scale(0.2);
		opacity: 0;
		transition:
			transform 390ms cubic-bezier(0.2, 1.15, 0.35, 1),
			opacity 300ms ease,
			border-color 160ms ease,
			box-shadow 160ms ease,
			color 160ms ease,
			background 160ms ease;
		box-shadow: 0 10px 18px rgba(30, 64, 175, 0.16);
	}

	.node.opened {
		opacity: 1;
		transform: rotate(calc((360deg / var(--count)) * var(--index))) translate(var(--radius))
			rotate(calc((-360deg / var(--count)) * var(--index))) scale(1);
		transition-delay: calc(var(--index) * 60ms + 180ms);
	}

	.node.architecture {
		color: #1d4ed8;
	}

	.node.information {
		color: #0f766e;
	}

	.node.interaction {
		color: #7e22ce;
	}

	.node:hover {
		border-color: #93c5fd;
		box-shadow: 0 12px 24px rgba(59, 130, 246, 0.24);
	}

	.node.active {
		background: linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%);
		border-color: #1d4ed8;
		color: #fff;
	}

	.core {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 58px;
		height: 58px;
		transform: translate(-50%, -50%);
		border-radius: 999px;
		border: 1px solid #1e3a8a;
		background: linear-gradient(145deg, #0f172a 0%, #1e3a8a 100%);
		color: #fff;
		display: grid;
		place-items: center;
		cursor: pointer;
		box-shadow: 0 10px 20px rgba(15, 23, 42, 0.3);
		z-index: 8;
	}

	.core:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	.face {
		position: absolute;
		display: grid;
		place-items: center;
		transition:
			opacity 180ms ease,
			transform 220ms ease;
	}

	.icon-face {
		opacity: 1;
		transform: scale(1) rotate(0deg);
	}

	.orbit-l5.opened .icon-face {
		opacity: 0;
		transform: scale(0.55) rotate(50deg);
	}

	.close-face {
		width: 26px;
		height: 26px;
		opacity: 0;
		transform: scale(0.6) rotate(-45deg);
	}

	.orbit-l5.opened .close-face {
		opacity: 1;
		transform: scale(1) rotate(0deg);
	}

	.close-face span {
		position: absolute;
		width: 20px;
		height: 2px;
		border-radius: 999px;
		background: #fff;
	}

	.close-face span:first-child {
		transform: rotate(45deg);
	}

	.close-face span:last-child {
		transform: rotate(-45deg);
	}

	.caption {
		margin: 0;
		font-size: 0.74rem;
		color: #4b5563;
		text-align: center;
	}

	.caption strong {
		color: #0f172a;
	}
</style>
