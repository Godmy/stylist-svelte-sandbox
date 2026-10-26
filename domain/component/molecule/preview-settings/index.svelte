<script lang="ts">
	import StoryControl from '$stylist/domain/component/atom/story-control/index.svelte';
	import { PREVIEW_CONTROLS } from '$stylist/domain/const/object/preview-controls';
	import type { RecipePreviewSettings } from '$stylist/domain/interface/recipe/preview-settings';
	let { value, onChange, appearance = true }: RecipePreviewSettings = $props();
	const controls = $derived(
		Object.entries(PREVIEW_CONTROLS).filter(([name]) => appearance || name === 'locale')
	);
</script>

<section class="preview-settings" aria-label="Preview appearance">
	<header>
		<strong>Preview appearance</strong><button type="button" onclick={() => onChange({})}
			>Reset appearance</button
		>
	</header>
	<div class="controls">
		{#each controls as [name, control] (name)}
			<StoryControl
				{name}
				{control}
				value={name === 'skin' ? value.skin !== false : value[name as keyof typeof value]}
				onChange={(next) => onChange({ ...value, [name]: next })}
			/>
		{/each}
	</div>
</section>

<style>
	.preview-settings {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--color-border-primary);
	}
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
		font-size: 0.8125rem;
	}
	.controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 0.75rem;
	}
	button {
		font: inherit;
		color: inherit;
		background: var(--color-background-secondary);
		border: 1px solid var(--color-border-primary);
		border-radius: 0.375rem;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
	}
</style>
