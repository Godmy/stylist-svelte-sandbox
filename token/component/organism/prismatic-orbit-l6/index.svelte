<script lang="ts">
	import CardOpen from '$stylist/token/component/atom/card-open/index.svelte';
	import CardClose from '$stylist/token/component/atom/card-close/index.svelte';
	import CardShell from '$stylist/token/component/atom/card-shell/index.svelte';
	import OrbitBackground from '$stylist/token/component/atom/orbit-background/index.svelte';
	import Orbit from '$stylist/token/component/molecule/orbit/index.svelte';
	import { L6_TOKEN_DEFINITIONS } from '$stylist/token/const/object/orbit-control-definition';
	import type { RecipePrismaticOrbitL6 } from '$stylist/token/interface/recipe/prismatic-orbit-l6';

	let _props: RecipePrismaticOrbitL6 = $props();

	let expanded = $state(false);
	let orbitOpen = $state(false);
	let seedX = $state(64);
	let seedY = $state(118);
	let draggingSeed = $state(false);
	let seedMoved = $state(false);
	let shellElement = $state<HTMLElement | null>(null);

	let dragOffsetX = 0;
	let dragOffsetY = 0;
	const SEED_SIZE = 48;
	const SHELL_WIDTH = 500;
	const SHELL_HEIGHT = 230;
	const CARD_OFFSET_X = 0;
	const CARD_OFFSET_Y = 0;
	const ORBIT_OFFSET_X = -155;
	const ORBIT_OFFSET_Y = -160;

	const items = [
		{ id: 'architecture', label: 'Architecture', icon: 'component-size' },
		{ id: 'information', label: 'Information', icon: 'variants' },
		{ id: 'interaction', label: 'Interaction', icon: 'controls' },
		{ id: 'state', label: 'State', icon: 'state' }
	] as const;

	const architectureNodes = [
		{
			id: 'component-size',
			icon: 'component-size',
			label: 'Component Size',
			definition: L6_TOKEN_DEFINITIONS['component-size']
		},
		{ id: 'style', icon: 'style', label: 'Style', definition: L6_TOKEN_DEFINITIONS.style }
	] as const;

	const informationNodes = [
		{
			id: 'variants',
			icon: 'variants',
			label: 'Variants',
			definition: L6_TOKEN_DEFINITIONS.variants
		},
		{
			id: 'text-element',
			icon: 'text-element',
			label: 'Text Element',
			definition: L6_TOKEN_DEFINITIONS['text-element']
		}
	] as const;

	const interactionNodes = [
		{
			id: 'animations',
			icon: 'animations',
			label: 'Animations',
			definition: L6_TOKEN_DEFINITIONS.animations
		},
		{
			id: 'controls',
			icon: 'controls',
			label: 'Controls',
			definition: L6_TOKEN_DEFINITIONS.controls
		},
		{ id: 'state', icon: 'state', label: 'State', definition: L6_TOKEN_DEFINITIONS.state }
	] as const;

	function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	function handleSeedPointerDown(event: PointerEvent): void {
		if (event.button !== 0) return;
		const rect = shellElement?.getBoundingClientRect();
		if (!rect) return;
		draggingSeed = true;
		seedMoved = false;
		dragOffsetX = event.clientX - rect.left - seedX;
		dragOffsetY = event.clientY - rect.top - seedY;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function handleWindowPointerMove(event: PointerEvent): void {
		if (!draggingSeed) return;
		const rect = shellElement?.getBoundingClientRect();
		if (!rect) return;
		seedMoved = true;
		seedX = clamp(event.clientX - rect.left - dragOffsetX, 0, SHELL_WIDTH - SEED_SIZE);
		seedY = clamp(event.clientY - rect.top - dragOffsetY, 0, SHELL_HEIGHT - SEED_SIZE);
	}

	function handleWindowPointerUp(): void {
		draggingSeed = false;
	}

	function handleSeedClick(): void {
		if (!seedMoved) {
			if (!expanded) {
				expanded = true;
				orbitOpen = false;
			} else {
				orbitOpen = !orbitOpen;
			}
		}
		seedMoved = false;
	}

	function closeCard(): void {
		expanded = false;
		orbitOpen = false;
	}
</script>

<svelte:window
	onpointermove={handleWindowPointerMove}
	onpointerup={handleWindowPointerUp}
	onpointercancel={handleWindowPointerUp}
/>

<div class="l6-shell" bind:this={shellElement}>
	<CardOpen
		{orbitOpen}
		dragging={draggingSeed}
		style={`left:${seedX}px; top:${seedY}px;`}
		onPointerDown={handleSeedPointerDown}
		onClick={handleSeedClick}
	/>

	<div
		class="orbit-layer"
		class:opened={orbitOpen}
		aria-hidden={!orbitOpen}
		style={`left:${seedX + ORBIT_OFFSET_X}px; top:${seedY + ORBIT_OFFSET_Y}px;`}
	>
		<OrbitBackground opened={orbitOpen}>
			<Orbit opened={orbitOpen} radius={68} nodes={architectureNodes} />
			<Orbit opened={orbitOpen} radius={102} nodes={informationNodes} />
			<Orbit opened={orbitOpen} radius={136} nodes={interactionNodes} />
		</OrbitBackground>
	</div>

	<div
		style={`left:${seedX + CARD_OFFSET_X}px; top:${seedY + CARD_OFFSET_Y}px; position:absolute;`}
	>
		<CardShell {expanded} title="Graph Node Controls">
			{#each items as item, index}
				<span class:hidden={!expanded} style={`--i:${index};`}>
					<button type="button" class="item-btn" aria-label={item.label} title={item.label}>
						<span class="dot"></span>
						<em>{item.label}</em>
					</button>
				</span>
			{/each}

			{#snippet close()}
				<CardClose {expanded} onClick={closeCard} />
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
