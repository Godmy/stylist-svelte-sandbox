<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeMarkdownRenderer } from '$stylist/domain/interface/recipe/markdown-renderer';
	import { marked } from 'marked';
	import { createMarkdownRendererState } from '$stylist/domain/component/organism/markdown-renderer/state.svelte';
	let props: RecipeMarkdownRenderer & HTMLAttributes<HTMLDivElement> = $props();
	const state = createMarkdownRendererState(() => props);

	// Configure marked for safe rendering
	marked.setOptions({
		gfm: true,
		breaks: true
	});

	$effect(() => {
		try {
			state.html = marked.parse(state.content) as string;
		} catch (error) {
			console.error('Error parsing markdown:', error);
			state.html = `<p class="mr-error">Error rendering markdown</p>`;
		}
	});
</script>

<div class={`markdown-content ${state.hostClass}`}>
	{@html state.html}
</div>

<style>
	:global(.mr-error) {
		color: var(--color-danger-600);
	}
	:global(.markdown-content) {
		color: inherit;
	}

	:global(.markdown-content h1) {
		font-size: var(--font-size-8);
		font-weight: var(--font-weight-bold);
		margin-top: var(--space-8);
		margin-bottom: var(--space-4);
		color: inherit;
	}

	:global(.markdown-content h2) {
		font-size: var(--font-size-6);
		font-weight: var(--font-weight-semibold);
		margin-top: var(--space-6);
		margin-bottom: var(--space-3);
		color: inherit;
		border-bottom: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
		padding-bottom: var(--space-2);
	}

	:global(.markdown-content h3) {
		font-size: var(--font-size-5);
		font-weight: var(--font-weight-semibold);
		margin-top: var(--space-5);
		margin-bottom: var(--space-2);
		color: inherit;
	}

	:global(.markdown-content p) {
		margin-top: var(--space-3);
		margin-bottom: var(--space-3);
		line-height: var(--line-height-relaxed);
		color: inherit;
	}

	:global(.markdown-content ul),
	:global(.markdown-content ol) {
		margin-top: var(--space-3);
		margin-bottom: var(--space-3);
		padding-left: var(--space-6);
		color: inherit;
	}

	:global(.markdown-content li) {
		margin-top: var(--space-1);
		margin-bottom: var(--space-1);
		color: inherit;
	}

	:global(.markdown-content code) {
		background-color: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		padding: var(--space-1) var(--space-1);
		border-radius: var(--radius-1-5);
		font-size: var(--font-size-3);
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	}

	:global(.dark .markdown-content code) {
		background-color: color-mix(in srgb, var(--color-background-primary) 10%, transparent);
	}

	:global(.markdown-content pre) {
		background-color: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		padding: var(--space-4);
		border-radius: var(--radius-2);
		overflow-x: auto;
		margin-top: var(--space-4);
		margin-bottom: var(--space-4);
	}

	:global(.dark .markdown-content pre) {
		background-color: color-mix(in srgb, var(--color-background-primary) 5%, transparent);
	}

	:global(.markdown-content pre code) {
		background-color: transparent;
		padding: 0;
		border-radius: 0;
	}

	:global(.markdown-content blockquote) {
		border-left: 4px solid color-mix(in srgb, var(--color-text-primary) 20%, transparent);
		padding-left: var(--space-4);
		margin-top: var(--space-4);
		margin-bottom: var(--space-4);
		color: color-mix(in srgb, var(--color-text-primary) 70%, transparent);
	}

	:global(.dark .markdown-content blockquote) {
		border-left-color: color-mix(in srgb, var(--color-background-primary) 20%, transparent);
		color: color-mix(in srgb, var(--color-background-primary) 70%, transparent);
	}

	:global(.markdown-content a) {
		color: var(--color-primary-500);
		text-decoration: underline;
	}

	:global(.markdown-content a:hover) {
		color: var(--color-primary-600);
	}

	:global(.dark .markdown-content a) {
		color: var(--color-primary-400);
	}

	:global(.dark .markdown-content a:hover) {
		color: var(--color-primary-300);
	}

	:global(.markdown-content table) {
		width: 100%;
		border-collapse: collapse;
		margin-top: var(--space-4);
		margin-bottom: var(--space-4);
	}

	:global(.markdown-content th),
	:global(.markdown-content td) {
		border: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
		padding: var(--space-2);
		text-align: left;
	}

	:global(.dark .markdown-content th),
	:global(.dark .markdown-content td) {
		border-color: color-mix(in srgb, var(--color-background-primary) 10%, transparent);
	}

	:global(.markdown-content th) {
		background-color: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		font-weight: var(--font-weight-semibold);
	}

	:global(.dark .markdown-content th) {
		background-color: color-mix(in srgb, var(--color-background-primary) 5%, transparent);
	}

	:global(.markdown-content hr) {
		border: 0;
		border-top: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
		margin-top: var(--space-8);
		margin-bottom: var(--space-8);
	}

	:global(.dark .markdown-content hr) {
		border-top-color: color-mix(in srgb, var(--color-background-primary) 10%, transparent);
	}
</style>
