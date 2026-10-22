<script lang="ts">
	import type { RecipeDocumentationBlock } from '$stylist/development/interface/recipe/documentation-block';
	import { createDocumentationBlockState } from '$stylist/development/component/molecule/documentation-block/state.svelte';
	import Code from '$stylist/development/component/molecule/code-block/index.svelte';
	import Badge from '$stylist/typography/component/atom/badge/index.svelte';
	import Divider from '$stylist/layout/component/atom/divider/index.svelte';

	let {
		title = '',
		content = '',
		variant = 'default',
		codeExamples = [],
		tags = [],
		class: className = '',
		...restProps
	}: RecipeDocumentationBlock = $props();

	const state = createDocumentationBlockState(() => ({
		title,
		content,
		variant,
		codeExamples,
		tags,
		class: className,
		...restProps
	}));
</script>

<div {...restProps} class={state.containerClass}>
	{#if title || tags.length > 0}
		<div class={state.headerContainerClass}>
			<div class={state.headerContentClass}>
				{#if title}
					<h2 class={state.titleClass}>{title}</h2>
				{/if}
				{#if tags && tags.length > 0}
					<div class={state.tagsContainerClass}>
						{#each tags as tag}
							<Badge variant="default" class={state.tagClass}>{tag}</Badge>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class={state.contentClass}>
		{@html content}
	</div>

	{#if codeExamples && codeExamples.length > 0}
		<div class={state.codeExamplesContainerClass}>
			{#each codeExamples as example, i}
				{#if i > 0}
					<Divider class={state.codeExampleDividerClass} />
				{/if}
				<Code
					title={example.title}
					code={example.code}
					language={example.language as any}
					showLineNumbers={example.showLineNumbers}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.c-documentation-block {
		overflow: hidden;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		background: var(--color-background-primary);
	}

	.c-documentation-block--info {
		border-color: var(--color-info-200, var(--color-primary-200));
		background: var(--color-info-50, var(--color-primary-50));
	}

	.c-documentation-block--warning {
		border-color: var(--color-warning-200);
		background: var(--color-warning-50);
	}

	.c-documentation-block--success {
		border-color: var(--color-success-200);
		background: var(--color-success-50);
	}

	.c-documentation-block--danger {
		border-color: var(--color-danger-200);
		background: var(--color-danger-50);
	}

	.c-documentation-block__header {
		border-bottom: 1px solid var(--color-border-primary);
		padding: 0.75rem 1rem;
		background: var(--color-background-secondary);
	}

	.c-documentation-block__header--info {
		background: var(--color-info-100, var(--color-primary-100));
	}

	.c-documentation-block__header--warning {
		background: var(--color-warning-100);
	}

	.c-documentation-block__header--success {
		background: var(--color-success-100);
	}

	.c-documentation-block__header--danger {
		background: var(--color-danger-100);
	}

	.c-documentation-block__header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.c-documentation-block__title {
		margin: 0;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.c-documentation-block__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.c-documentation-block__tag {
		font-size: 0.75rem;
	}

	.c-documentation-block__content {
		max-width: none;
		padding: 1rem;
		color: var(--color-text-secondary);
	}

	.c-documentation-block__content :global(h1),
	.c-documentation-block__content :global(h2),
	.c-documentation-block__content :global(h3),
	.c-documentation-block__content :global(strong) {
		color: var(--color-text-primary);
	}

	.c-documentation-block__examples {
		margin-top: 1.5rem;
		display: grid;
		gap: 1.5rem;
	}
</style>
