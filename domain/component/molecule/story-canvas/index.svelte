<script lang="ts">
	import type { Snippet } from 'svelte';
	import Node from '$stylist/html/component/template/node/index.svelte';
	import type { RecipeStoryCanvas } from '$stylist/domain/interface/recipe/story-canvas';
	import { resolvePreviewVariables } from '$stylist/domain/function/resolve/preview-variables';
	import { serializeHtmlStylesheet } from '$stylist/html/function/serialize/html-stylesheet';
	import HtmlStyle from '$stylist/html/component/atom/style/index.svelte';

	let {
		story,
		args,
		content,
		environment,
		render = null,
		class: className = ''
	}: RecipeStoryCanvas = $props();
	let root = $state<HTMLDivElement>();
	const skin = $derived(environment !== undefined && environment.skin !== false);
	const stylesheet = serializeHtmlStylesheet();
	$effect(() => {
		if (!root || !environment || !skin) return;
		const target = root;
		const vars = resolvePreviewVariables(environment);
		const previous = Object.keys(vars).map(
			(key) => [key, target.style.getPropertyValue(key)] as const
		);
		for (const [key, value] of Object.entries(vars)) target.style.setProperty(key, value);
		return () => {
			for (const [key, value] of previous) {
				if (value) target.style.setProperty(key, value);
				else target.style.removeProperty(key);
			}
		};
	});

	const values = $derived(args ?? story.args ?? {});
	const nodes = $derived(content ?? story.content);
</script>

{#snippet element()}
	<story.component {...values} children={nodes ? contentNodes : undefined} />
{/snippet}

{#snippet contentNodes()}
	{#each nodes ?? [] as node, index (index)}
		<Node {node} />
	{/each}
{/snippet}

<svelte:head
	>{#if skin}<HtmlStyle text={stylesheet} />{/if}</svelte:head
>

<div
	bind:this={root}
	class="c-story-canvas {className}"
	data-layout={story.layout ?? 'padded'}
	data-html-skin={skin || undefined}
>
	{#if render}
		{@const Render = render}
		<Render {...values} />
	{:else if story.context}
		<!-- svelte2tsx types a template snippet as a function; the cast matches scratch-route-script. -->
		<Node node={story.context} outlet={element as Snippet} />
	{:else}
		{@render element()}
	{/if}
</div>

<style>
	.c-story-canvas {
		box-sizing: border-box;
		min-height: 100%;
		padding: 1.5rem;
		background: var(--color-background-primary);
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
