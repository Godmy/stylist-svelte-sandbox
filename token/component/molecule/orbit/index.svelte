<script lang="ts">
	import OrbitTokenNode from '$stylist/token/component/atom/orbit-token-node/index.svelte';
	import type { RecipeOrbit } from '$stylist/token/interface/recipe/orbit';

	let { opened = false, radius = 112, nodes }: RecipeOrbit = $props();

	const toTransform = (index: number, count: number) =>
		`transform: rotate(${(360 / count) * index}deg) translate(${radius}px) rotate(${-(360 / count) * index}deg);`;
</script>

<div
	class={`token-orbit ${opened ? 'token-orbit--opened' : ''}`.trim()}
	style={`--token-orbit-radius:${radius}px;`}
>
	<div class="token-orbit__ring" aria-hidden="true"></div>
	{#if opened}
		{#each nodes as node, index}
			<OrbitTokenNode
				id={node.id}
				icon={node.icon}
				label={node.label}
				{opened}
				definition={node.definition}
				style={toTransform(index, nodes.length)}
			/>
		{/each}
	{/if}
</div>

<style>
	.token-orbit {
		position: relative;
		display: grid;
		place-items: center;
		width: calc(var(--token-orbit-radius) * 2 + 5rem);
		height: calc(var(--token-orbit-radius) * 2 + 5rem);
	}

	.token-orbit__ring {
		position: absolute;
		width: calc(var(--token-orbit-radius) * 2);
		height: calc(var(--token-orbit-radius) * 2);
		border: 1px dashed var(--md-sys-color-outline-variant, #cac4d0);
		border-radius: 999px;
		opacity: 0.76;
	}

	.token-orbit--opened .token-orbit__ring {
		border-color: var(--md-sys-color-primary, #6750a4);
	}
</style>
