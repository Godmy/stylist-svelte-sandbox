<script lang="ts">
	import Node from '$stylist/html/component/template/node/index.svelte';
	import type { RecipeStoryCanvas } from '$stylist/domain/interface/recipe/story-canvas';

	let { story, args, render = null, class: className = '' }: RecipeStoryCanvas = $props();

	const values = $derived(args ?? story.args ?? {});
</script>

{#snippet content()}
	{#each story.content ?? [] as node, index (index)}
		<Node {node} />
	{/each}
{/snippet}

<div class="c-story-canvas {className}" data-layout={story.layout ?? 'padded'}>
	{#if render}
		{@const Render = render}
		<Render {...values} />
	{:else}
		<story.component {...values} children={story.content ? content : undefined} />
	{/if}
</div>

<style>
	.c-story-canvas {
		box-sizing: border-box;
		min-height: 100%;
		padding: 1.5rem;
		/* Previewed components can react to the iframe width with @container. */
		container-type: inline-size;
	}

	.c-story-canvas[data-layout='centered'] {
		display: grid;
		place-items: center;
		min-height: 100vh;
	}

	.c-story-canvas[data-layout='fullscreen'] {
		padding: 0;
		min-height: 100vh;
	}
</style>
