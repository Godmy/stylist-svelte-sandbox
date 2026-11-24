<script lang="ts">
	import type { Snippet } from 'svelte';
	import Node from '$stylist/html/component/template/node/index.svelte';
	import type { RecipeStoryCanvas } from '$stylist/domain/interface/recipe/story-canvas';

	import HtmlStyle from '$stylist/html/component/atom/style/index.svelte';
	import LocaleProvider from '$stylist/localization/component/atom/locale-provider/index.svelte';
	import createStoryCanvasComponentState from '$stylist/domain/component/molecule/story-canvas/state.svelte';

	let {
		story,
		args,
		content,
		environment,
		locale,
		render = null,
		class: className = ''
	}: RecipeStoryCanvas = $props();

	const state = createStoryCanvasComponentState(() => ({
		story: story,
		args: args,
		content: content,
		environment: environment
	}));
</script>

{#snippet element()}
	<story.component {...state.values} children={state.nodes ? contentNodes : undefined} />
{/snippet}

{#snippet contentNodes()}
	{#each state.nodes ?? [] as node, index (index)}
		<Node {node} />
	{/each}
{/snippet}

<svelte:head
	>{#if state.skin}<HtmlStyle text={state.stylesheet} />{/if}</svelte:head
>

<div
	bind:this={state.root}
	class="c-story-canvas {className}"
	data-layout={story.layout ?? 'padded'}
	data-html-skin={state.skin || undefined}
>
	<LocaleProvider locale={locale ?? environment?.locale}>
		{#if render}
			{@const Render = render}
			<Render {...state.values} />
		{:else if story.context}
			<!-- svelte2tsx types a template snippet as a function; the cast matches scratch-route-script. -->
			<Node node={story.context} outlet={element as Snippet} />
		{:else}
			{@render element()}
		{/if}
	</LocaleProvider>
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
