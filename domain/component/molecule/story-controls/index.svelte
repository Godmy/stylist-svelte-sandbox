<script lang="ts">
	import StoryControl from '$stylist/domain/component/atom/story-control/index.svelte';
	import type { RecipeStoryControls } from '$stylist/domain/interface/recipe/story-controls';
	import createStoryControlsState from '$stylist/domain/component/molecule/story-controls/state.svelte';

	let props: RecipeStoryControls = $props();

	const state = createStoryControlsState(() => props);
</script>

<section class="c-story-controls {props.class ?? ''}" aria-label="Story controls">
	<header class="bar">
		{#if state.controlsState.markup !== null}
			<div class="tabs" role="group" aria-label="Story panel">
				<button
					type="button"
					aria-pressed={state.controlsState.tab === 'controls'}
					onclick={() => state.controlsState.selectTab('controls')}>Controls</button
				>
				<button
					type="button"
					aria-pressed={state.controlsState.tab === 'html'}
					onclick={() => state.controlsState.selectTab('html')}>HTML</button
				>
			</div>
		{/if}
		{#if state.controlsState.presets.length}
			<div class="presets" role="group" aria-label="Presets">
				<button
					type="button"
					aria-pressed={state.controlsState.preset === ''}
					onclick={() => state.controlsState.selectPreset('')}>Default</button
				>
				{#each state.controlsState.presets as name (name)}
					<button
						type="button"
						aria-pressed={state.controlsState.preset === name}
						onclick={() => state.controlsState.selectPreset(name)}>{name}</button
					>
				{/each}
			</div>
		{/if}
		<button
			type="button"
			class="reset"
			disabled={!state.controlsState.changed}
			onclick={state.controlsState.reset}
		>
			Reset
		</button>
	</header>

	{#if state.controlsState.tab === 'html' && state.controlsState.markup !== null}
		<div class="markup">
			<button type="button" class="copy" onclick={state.copy}
				>{state.copied ? 'Copied' : 'Copy'}</button
			>
			<pre><code>{state.controlsState.markup}</code></pre>
			{#if state.copyError}<p role="status">{state.copyError}</p>{/if}
		</div>
	{:else if state.controlsState.controls.length || state.controlsState.text !== null}
		<div class="grid">
			{#if state.controlsState.text !== null}
				<StoryControl
					name="content-text"
					control={state.TEXT}
					value={state.controlsState.text}
					onChange={state.controlsState.setText}
				/>
			{/if}
			{#each state.controlsState.controls as { name, control, auto } (name)}
				<StoryControl
					{name}
					{control}
					{auto}
					value={state.controlsState.args[name]}
					onChange={(value) => state.controlsState.set(name, value)}
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

	.tabs {
		display: flex;
		gap: 0.25rem;
	}

	.tabs button[aria-pressed='true'] {
		border-color: var(--color-primary-500);
		color: var(--color-text-primary);
	}

	.markup {
		position: relative;
		min-width: 0;
	}

	.markup pre {
		margin: 0;
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.375rem;
		background: var(--color-background-secondary);
		overflow: auto;
		font-family: var(--font-family-mono, ui-monospace, monospace);
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--color-text-primary);
		white-space: pre;
	}

	.copy {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
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
