<script lang="ts">
	import type { RecipeComponentPreview } from '$stylist/development/interface/recipe/component-preview';
	import { createComponentPreviewState } from '$stylist/development/component/molecule/component-preview/state.svelte';
	import CodeBlock from '$stylist/development/component/molecule/code-block/index.svelte';

	let {
		title,
		description,
		code,
		language = 'svelte',
		componentDemo,
		showCode = false,
		class: className = ''
	}: RecipeComponentPreview = $props();

	const state = createComponentPreviewState(() => ({
		title,
		description,
		code,
		language,
		componentDemo,
		showCode,
		class: className
	}));
</script>

<div class={state.classes}>
	<div class={state.headerClasses}>
		<h3 class={state.titleClasses}>{title}</h3>
		{#if description}
			<p class={state.descriptionClasses}>{description}</p>
		{/if}
	</div>

	<div class={state.tabContainerClasses}>
		<div class={state.tabListClasses}>
			<button
				type="button"
				class={state.tabButtonClasses(state.activeTab === 'preview')}
				onclick={() => state.setPreviewTab('preview')}
			>
				Preview
			</button>
			<button
				type="button"
				class={state.tabButtonClasses(state.activeTab === 'code')}
				onclick={() => state.setPreviewTab('code')}
			>
				Code
			</button>
		</div>
	</div>

	{#if state.activeTab === 'preview'}
		<div class={state.previewContainerClasses}>
			<div class={state.demoContainerClasses}>
				{@render componentDemo()}
			</div>
		</div>
	{:else}
		<div class={state.codeContainerClasses}>
			<CodeBlock language={language as any} {code} />
		</div>
	{/if}
</div>

<style>
	.c-component-preview {
		overflow: hidden;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		background: var(--color-background-primary);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.c-component-preview__header {
		border-bottom: 1px solid var(--color-border-primary);
		padding: 1rem 1.5rem;
	}

	.c-component-preview__title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.c-component-preview__description {
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.c-component-preview__tabs {
		border-bottom: 1px solid var(--color-border-primary);
	}

	.c-component-preview__tab-list {
		display: flex;
		margin-bottom: -1px;
	}

	.c-component-preview__tab {
		border: none;
		border-bottom: 2px solid transparent;
		border-radius: 0.5rem 0.5rem 0 0;
		padding: 0.5rem 1rem;
		background: transparent;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
		cursor: pointer;
	}

	.c-component-preview__tab:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}

	.c-component-preview__tab--active {
		border-bottom-color: var(--color-primary-500);
		background: var(--color-primary-50);
		color: var(--color-primary-600);
	}

	.c-component-preview__tab--inactive:hover {
		border-bottom-color: var(--color-border-primary);
		color: var(--color-text-primary);
	}

	.c-component-preview__preview {
		border-bottom: 1px solid var(--color-border-primary);
		padding: 1.5rem;
	}

	.c-component-preview__demo {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100px;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.75rem;
		background: var(--color-background-secondary);
		padding: 1rem;
	}
</style>
