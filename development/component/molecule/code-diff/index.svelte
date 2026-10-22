<script lang="ts">
	import type { RecipeCodeDiff } from '$stylist/development/interface/recipe/code-diff';
	import { createCodeDiffState } from '$stylist/development/component/molecule/code-diff/state.svelte';

	let {
		original = '',
		modified = '',
		language = 'text',
		class: hostClass = '',
		contentClass = '',
		headerClass = '',
		showLineNumbers = true,
		...restProps
	}: RecipeCodeDiff = $props();

	const state = createCodeDiffState(() => ({
		original,
		modified,
		language,
		class: hostClass,
		contentClass,
		headerClass,
		showLineNumbers,
		...restProps
	}));
</script>

<div class={state.containerClass} {...restProps}>
	<div class={state.headerClassComputed}>Code Diff</div>

	<div class={state.mainContentClass}>
		{#if showLineNumbers}
			<div class={state.lineNumbersContainerClass}>
				{#each state.diffLines as line, index}
					<div class={state.lineNumberItemClass}>
						{line.lineNumber}
					</div>
				{/each}
			</div>
		{/if}

		<div class={state.contentContainerClass}>
			<div class={state.getDiffContentClass}>
				{#each state.diffLines as line}
					{#if line.type === 'unchanged'}
						<div class={state.diffLineClass(line.type)}>
							<span class={state.diffSpanClass(line.type)}>{line.original}</span>
						</div>
					{:else if line.type === 'added'}
						<div class={state.diffLineClass(line.type)}>
							<span class={state.diffSpanClass(line.type)}>+ {line.modified}</span>
						</div>
					{:else if line.type === 'removed'}
						<div class={state.diffLineClass(line.type)}>
							<span class={state.diffSpanClass(line.type)}>- {line.original}</span>
						</div>
					{:else if line.type === 'changed'}
						<div class={state.getChangedContainerClass}>
							<div class={state.diffLineClass('removed')}>
								<span
									class={[state.diffSpanClass('removed'), 'c-code-diff__text--struck'].join(' ')}
									>- {line.original}</span
								>
							</div>
							<div class={state.diffLineClass('added')}>
								<span class={state.diffSpanClass('added')}>+ {line.modified}</span>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.c-code-diff {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.75rem;
		background: var(--color-background-primary);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.c-code-diff__header {
		border-bottom: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.c-code-diff__main {
		display: flex;
	}

	.c-code-diff__line-numbers {
		user-select: none;
		width: 4rem;
		border-right: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		padding: 0.5rem 1rem 1rem 0.5rem;
		text-align: right;
		font-family: var(--font-family-mono, monospace);
		font-size: 0.875rem;
		color: var(--color-text-tertiary);
	}

	.c-code-diff__line-number {
		padding-right: 0.5rem;
	}

	.c-code-diff__content {
		flex: 1;
		overflow-x: auto;
	}

	.c-code-diff__body {
		font-size: 0.875rem;
	}

	.c-code-diff__line {
		padding: 0.25rem 1rem;
	}

	.c-code-diff__line--added {
		border-left: 4px solid var(--color-success-500);
		background: var(--color-success-50);
		color: var(--color-success-800);
	}

	.c-code-diff__line--removed {
		border-left: 4px solid var(--color-danger-500);
		background: var(--color-danger-50);
		color: var(--color-danger-800);
	}

	.c-code-diff__line--unchanged {
		background: var(--color-background-primary);
		color: var(--color-text-secondary);
	}

	.c-code-diff__changed {
		background: var(--color-background-primary);
	}

	.c-code-diff__text--added {
		color: var(--color-success-800);
	}

	.c-code-diff__text--removed {
		color: var(--color-danger-800);
	}

	.c-code-diff__text--unchanged {
		color: var(--color-text-secondary);
	}

	.c-code-diff__text--struck {
		text-decoration: line-through;
	}
</style>
