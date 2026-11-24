<script lang="ts">
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import TokenControlComposer from '$stylist/token/component/molecule/token/index.svelte';
	import type { RecipeOrbitTokenNode } from '$stylist/token/interface/recipe/orbit-token-node';

	import createOrbitTokenNodeComponentState from '$stylist/token/component/atom/orbit-token-node/state.svelte';

	let { id, icon, label, opened = false, style = '', definition }: RecipeOrbitTokenNode = $props();

	const state = createOrbitTokenNodeComponentState(() => ({
		id: id,
		opened: opened,
		definition: definition
	}));
</script>

<div class="node-wrap" {style}>
	<button
		type="button"
		class="node"
		class:active={state.active}
		onclick={() => {
			if (opened) state.active = !state.active;
		}}
		aria-label={label}
		title={label}
	>
		<Icon name={state.active ? 'x' : icon} size={12} container="none" />
	</button>

	{#if state.active}
		<div class="popover">
			<TokenControlComposer
				definition={state.controlDefinition}
				value={state.value}
				onChange={(next) => (state.value = next)}
			/>
		</div>
	{/if}
</div>

<style>
	.node-wrap {
		position: absolute;
		top: 50%;
		left: 50%;
	}

	.node {
		width: 30px;
		height: 30px;
		margin-left: -15px;
		margin-top: -15px;
		border-radius: 999px;
		border: 1px solid #c8dafb;
		background: #fff;
		color: #1d4ed8;
		display: grid;
		place-items: center;
		box-shadow: 0 8px 14px rgba(30, 64, 175, 0.16);
		cursor: pointer;
	}

	.node.active {
		background: linear-gradient(145deg, #0f172a 0%, #1d4ed8 100%);
		color: #fff;
		border-color: #1d4ed8;
	}

	.popover {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		z-index: 8;
		background: #fff;
		border: 1px solid #d9e2ef;
		border-radius: 10px;
		padding: 0.35rem;
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
		min-width: 220px;
	}

	.popover :global(.token-control-base) {
		background: #fff;
	}
</style>
