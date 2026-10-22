<script lang="ts">
	import ComponentPreview from '$stylist/development/component/molecule/component-preview/index.svelte';
	import type { RecipeComponentPreview } from '$stylist/development/interface/recipe/component-preview';

	// Render of index.story.ts: the required componentDemo snippet cannot be passed as an arg.
	let {
		demoVariant = 'primary',
		...args
	}: Omit<RecipeComponentPreview, 'componentDemo'> & { demoVariant?: string } = $props();
</script>

<div class="_c1">
	<ComponentPreview {...args}>
		{#snippet componentDemo()}
			<button class={`_c2 _c2--${demoVariant}`} type="button">Preview action</button>
		{/snippet}
	</ComponentPreview>
</div>

<style>
	._c1 {
		border-radius: 0.75rem;
		background-color: var(--color-background-secondary);
		padding: 1rem;
	}

	._c2 {
		border-radius: 0.25rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: var(--color-text-inverse);
		background-color: var(--color-primary-600);
	}

	._c2--secondary {
		background-color: var(--color-neutral-800);
	}

	._c2--danger {
		background-color: var(--color-danger-600);
	}
</style>
