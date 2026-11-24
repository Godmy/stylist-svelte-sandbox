<script lang="ts">
	import CardOpen from '$stylist/token/component/atom/card-open/index.svelte';
	import CardClose from '$stylist/token/component/atom/card-close/index.svelte';
	import CardShell from '$stylist/token/component/atom/card-shell/index.svelte';
	import OrbitBackground from '$stylist/token/component/atom/orbit-background/index.svelte';
	import Orbit from '$stylist/token/component/molecule/orbit/index.svelte';

	import type { RecipePrismaticOrbitL6 } from '$stylist/token/interface/recipe/prismatic-orbit-l6';
	import createPrismaticOrbitL6ComponentState from '$stylist/token/component/organism/prismatic-orbit-l6/state.svelte';

	let _props: RecipePrismaticOrbitL6 = $props();

	const state = createPrismaticOrbitL6ComponentState();
</script>

<svelte:window
	onpointermove={state.handleWindowPointerMove}
	onpointerup={state.handleWindowPointerUp}
	onpointercancel={state.handleWindowPointerUp}
/>

<div class="l6-shell" bind:this={state.shellElement}>
	<CardOpen
		orbitOpen={state.orbitOpen}
		dragging={state.draggingSeed}
		style={`left:${state.seedX}px; top:${state.seedY}px;`}
		onPointerDown={state.handleSeedPointerDown}
		onClick={state.handleSeedClick}
	/>

	<div
		class="orbit-layer"
		class:opened={state.orbitOpen}
		aria-hidden={!state.orbitOpen}
		style={`left:${state.seedX + state.ORBIT_OFFSET_X}px; top:${state.seedY + state.ORBIT_OFFSET_Y}px;`}
	>
		<OrbitBackground opened={state.orbitOpen}>
			<Orbit opened={state.orbitOpen} radius={68} nodes={state.architectureNodes} />
			<Orbit opened={state.orbitOpen} radius={102} nodes={state.informationNodes} />
			<Orbit opened={state.orbitOpen} radius={136} nodes={state.interactionNodes} />
		</OrbitBackground>
	</div>

	<div
		style={`left:${state.seedX + state.CARD_OFFSET_X}px; top:${state.seedY + state.CARD_OFFSET_Y}px; position:absolute;`}
	>
		<CardShell expanded={state.expanded} title="Graph Node Controls">
			{#each state.items as item, index (index)}
				<span class:hidden={!state.expanded} style={`--i:${index};`}>
					<button type="button" class="item-btn" aria-label={item.label} title={item.label}>
						<span class="dot"></span>
						<em>{item.label}</em>
					</button>
				</span>
			{/each}

			{#snippet close()}
				<CardClose expanded={state.expanded} onClick={state.closeCard} />
			{/snippet}
		</CardShell>
	</div>
</div>

<style>
	.l6-shell {
		position: relative;
		width: 460px;
		height: 230px;
		overflow: visible;
		user-select: none;
	}

	.orbit-layer {
		position: absolute;
		width: 360px;
		height: 360px;
		display: grid;
		place-items: center;
		opacity: 0;
		transform: scale(0.35);
		transition:
			transform 380ms cubic-bezier(0.2, 1.1, 0.34, 1),
			opacity 280ms ease;
		pointer-events: none;
		z-index: 300;
	}

	.orbit-layer.opened {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	span {
		padding: 0.1rem 0;
		white-space: nowrap;
		visibility: visible;
		opacity: 1;
		transition: 0.3s;
		transform: rotateY(0deg);
	}

	span:nth-of-type(1) {
		transition-delay: 0.4s;
	}
	span:nth-of-type(2) {
		transition-delay: 0.5s;
	}
	span:nth-of-type(3) {
		transition-delay: 0.6s;
	}
	span:nth-of-type(4) {
		transition-delay: 0.7s;
	}

	span.hidden {
		width: 0;
		padding-inline: 0;
		visibility: hidden;
		opacity: 0;
		transform: rotateY(90deg);
	}

	span.hidden:nth-of-type(1) {
		transition-delay: 0.3s;
	}
	span.hidden:nth-of-type(2) {
		transition-delay: 0.2s;
	}
	span.hidden:nth-of-type(3) {
		transition-delay: 0.1s;
	}
	span.hidden:nth-of-type(4) {
		transition-delay: 0s;
	}

	.item-btn {
		border: 0;
		background: transparent;
		color: #0f172a;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		cursor: pointer;
		font: inherit;
		font-size: 0.84rem;
		padding: 0.2rem 0;
	}

	.item-btn:hover {
		color: #1d4ed8;
	}

	.item-btn em {
		font-style: normal;
		font-weight: 500;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: #60a5fa;
		display: inline-block;
	}
</style>
