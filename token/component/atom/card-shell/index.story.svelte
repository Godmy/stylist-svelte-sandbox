<script lang="ts">
	import type { RecipeCardShell } from '$stylist/token/interface/recipe/card-shell';
	import CardShell from './index.svelte';
	import CardClose from '../card-close/index.svelte';

	// Render of index.story.ts: the shell needs chip children and a close snippet whose CardClose follows `expanded`.
	let args: RecipeCardShell = $props();
</script>

<div class="token-story-stage">
	<div class="token-story-card-position">
		<CardShell {...args}>
			<button type="button" class="token-story-chip">Layout</button>
			<button type="button" class="token-story-chip">Variants</button>
			<button type="button" class="token-story-chip">States</button>

			{#snippet close()}
				<CardClose expanded={args.expanded} />
			{/snippet}
		</CardShell>
	</div>
</div>

<style>
	.token-story-stage {
		position: relative;
		min-height: 18rem;
		overflow: visible;
		border: 1px solid #d7dee8;
		border-radius: 0.5rem;
		background: #f8fafc;
		padding: 2rem;
	}
	.token-story-card-position {
		position: relative;
		margin: 3rem 0 0 1rem;
	}
	.token-story-chip {
		border: 1px solid #cbd5e1;
		border-radius: 9999px;
		background: #ffffff;
		padding: 0.3rem 0.75rem;
		font-size: 0.75rem;
		line-height: 1rem;
		font-weight: 500;
		color: #334155;
	}
</style>
