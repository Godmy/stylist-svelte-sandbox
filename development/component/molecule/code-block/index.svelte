<script lang="ts">
	import { PresetCodeBlock } from '$stylist/development/const/preset/code-block';
	import type { RecipeCodeBlock } from '$stylist/development/interface/recipe/code-block';
	import { createCodeBlockState } from '$stylist/development/component/molecule/code-block/state.svelte';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import Button from '$stylist/button/component/atom/button/index.svelte';
	import Badge from '$stylist/typography/component/atom/badge/index.svelte';

	let {
		code = '',
		language = 'text',
		showLineNumbers = false,
		highlightLines = [],
		title,
		tags = [],
		copyable = false,
		copyOnHover = false,
		class: hostClass = '',
		contentClass = '',
		lineNumberClass = '',
		codeClass = '',
		headerClass = '',
		...restProps
	}: RecipeCodeBlock = $props();

	const state = createCodeBlockState(() => ({
		code,
		language,
		showLineNumbers,
		highlightLines,
		title,
		tags,
		copyable,
		copyOnHover,
		class: hostClass,
		contentClass,
		lineNumberClass,
		codeClass,
		headerClass
	}));
</script>

<div class={state.containerClass} {...restProps}>
	{#if title || tags.length > 0}
		<div class={state.headerClassComputed}>
			<div class={state.headerContentClass}>
				{#if title}
					<span class={state.titleClass}>{title}</span>
				{/if}
				{#if tags.length > 0}
					<div class={state.tagsContainerClass}>
						{#each tags as tag}
							<Badge variant="default" class={state.tagClass}>{tag}</Badge>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class={state.getMainContentClass}>
		{#if showLineNumbers}
			<div class={state.lineNumbersContainerClass}>
				{#each state.codeLines as _, index}
					<div class={state.lineNumberItemClass(highlightLines.includes(index + 1))}>
						{index + 1}
					</div>
				{/each}
			</div>
		{/if}

		<div class={state.contentContainerClass}>
			<pre class={state.preClass}><code class={state.languageClass}>{code}</code></pre>
		</div>
	</div>

	{#if copyable}
		<div class={state.copyButtonContainerClass}>
			<Button variant="ghost" size="sm" onclick={state.handleCopy} aria-label="Copy code">
				{#if state.copied}
					<BaseIcon name={PresetCodeBlock.Check} class={state.iconClass} />
				{:else}
					<BaseIcon name={PresetCodeBlock.Copy} class={state.iconClass} />
				{/if}
			</Button>
		</div>
	{/if}
</div>

<style>
	.c-code-block {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.75rem;
		background: var(--color-background-primary);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.c-code-block__header {
		border-bottom: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.c-code-block__header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.c-code-block__title {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.c-code-block__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	:global(.c-code-block__tag) {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.c-code-block__main {
		display: flex;
	}

	.c-code-block__line-numbers {
		user-select: none;
		border-right: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		padding: 1rem 1rem 1rem 0.5rem;
		text-align: right;
		font-family: var(--font-family-mono, monospace);
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
	}

	.c-code-block__line-number--highlighted {
		background: var(--color-warning-100);
		color: var(--color-text-primary);
	}

	.c-code-block__content {
		flex: 1;
		overflow: auto;
	}

	.c-code-block__pre {
		overflow: auto;
		margin: 0;
		padding: 1rem;
		font-size: 0.875rem;
	}

	.c-code-block__copy {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
	}

	.c-code-block__copy--on-hover {
		opacity: 0;
		transition: opacity var(--motion-duration-150, 150ms) var(--motion-easing-ease, ease);
	}

	.c-code-block:hover .c-code-block__copy--on-hover,
	.c-code-block__copy--on-hover:focus-within {
		opacity: 1;
	}

	.c-code-block__icon {
		width: 1rem;
		height: 1rem;
	}
</style>
