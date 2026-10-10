<script lang="ts">
	import StoryControl from '$stylist/domain/component/atom/story-control/index.svelte';
	import type { RecipeStoryControls } from '$stylist/domain/interface/recipe/story-controls';
	import createStoryControlsState from './state.svelte';

	let props: RecipeStoryControls = $props();
	const state = createStoryControlsState(() => props);
</script>

<section class="c-story-controls {props.class ?? ''}" aria-label="Story controls">
	<header class="bar">
		{#if state.presets.length}
			<div class="presets" role="group" aria-label="Presets">
				<button
					type="button"
					aria-pressed={state.preset === ''}
					onclick={() => state.selectPreset('')}>Default</button
				>
				{#each state.presets as name (name)}
					<button
						type="button"
						aria-pressed={state.preset === name}
						onclick={() => state.selectPreset(name)}>{name}</button
					>
				{/each}
			</div>
		{/if}
		<button type="button" class="reset" disabled={!state.changed} onclick={state.reset}>
			Reset
		</button>
	</header>

	{#if state.controls.length}
		<div class="grid">
			{#each state.controls as [name, control] (name)}
				<StoryControl
					{name}
					control={control!}
					value={state.args[name]}
					onChange={(value) => state.set(name, value)}
				/>
			{/each}
		</div>
	{:else}
		<p class="empty">No controls.</p>
	{/if}
</section>

<style>
	.c-story-controls {
		display: grid;
		gap: 0.75rem;
		padding: 0.75rem 1rem 1rem;
		border-top: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
		overflow: auto;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	button {
		padding: 0.25rem 0.6rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 999px;
		background: var(--color-background-secondary);
		font: inherit;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		cursor: pointer;
	}

	button[aria-pressed='true'] {
		border-color: var(--color-primary-500);
		color: var(--color-text-primary);
	}

	button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.reset {
		margin-left: auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
		gap: 0.75rem 1rem;
	}

	.empty {
		margin: 0;
		font-size: 0.8rem;
		color: var(--color-text-tertiary);
	}
</style>
