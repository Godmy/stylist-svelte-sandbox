<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeCodeViewer } from '$stylist/development/interface/recipe/code-viewer';
	import { onMount } from 'svelte';
	import { createCodeViewerState } from '$stylist/development/component/organism/code-viewer/state.svelte';
	let props: RecipeCodeViewer & HTMLAttributes<HTMLDivElement> = $props();
	const state = createCodeViewerState(() => props);

	onMount(() => {
		if (!window.matchMedia) return;
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		state.darkMode = media.matches;
		const handler = (e: MediaQueryListEvent) => {
			state.darkMode = e.matches;
		};
		media.addEventListener('change', handler);

		return () => media.removeEventListener('change', handler);
	});
</script>

<div class="pcv-wrap" data-code-theme={state.isDark ? 'dark' : 'light'}>
	<div class="pcv-tabs">
		<div class="pcv-tabs-left">
			<span class="pcv-lang-badge">{state.language.toUpperCase()}</span>
			<span class="pcv-lang-label">Component Code</span>
		</div>
	</div>

	<div class="pcv-toolbar">
		<div class="pcv-toolbar-info">
			{state.language} • {state.code.split('\n').length} lines
			{#if state.componentName}
				• {state.componentName}
			{/if}
		</div>
		<div class="pcv-toolbar-btns">
			<button onclick={state.copyCode} class="pcv-btn" title="Copy code">Copy</button>
			<button onclick={state.downloadCode} class="pcv-btn" title="Download file">Download</button>
		</div>
	</div>

	<div class="pcv-content">
		{#if state.code}
			<pre class="pcv-pre"><code>{@html state.highlightedCode}</code></pre>
		{:else}
			<div class="pcv-empty">No code to display</div>
		{/if}
	</div>
</div>

<style>
	.pcv-pre {
		margin: 0;
		padding: 1rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.875rem;
		line-height: 1.625;
		tab-size: 2;
	}
	.pcv-wrap[data-code-theme='dark'] {
		--code-comment: #8b949e;
		--code-tag: #7ee787;
		--code-attribute: #79c0ff;
		--code-string: #a5d6ff;
		--code-keyword: #ff7b72;
		--code-number: #79c0ff;
		background: #0d1117;
		color: #e6edf3;
	}
	.pcv-wrap {
		--code-comment: #57606a;
		--code-tag: #116329;
		--code-attribute: #0550ae;
		--code-string: #0a3069;
		--code-keyword: #cf222e;
		--code-number: #0550ae;
		background: #ffffff;
		color: #24292f;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}
	.pcv-wrap[data-code-theme='dark'] {
		border-color: #374151;
	}
	.pcv-tabs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
		padding: 0.5rem 1rem;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-tabs {
		border-color: #374151;
		background: #1f2937;
	}
	.pcv-tabs-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.pcv-lang-badge {
		border-radius: 0.25rem;
		background: #ffedd5;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: #c2410c;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-lang-badge {
		background: rgb(124 45 18 / 0.3);
		color: #fb923c;
	}
	.pcv-lang-label {
		font-size: 0.75rem;
		color: #6b7280;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-lang-label {
		color: #9ca3af;
	}
	.pcv-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e5e7eb;
		background: #f3f4f6;
		padding: 0.5rem;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-toolbar {
		border-color: #374151;
		background: #1f2937;
	}
	.pcv-toolbar-info {
		font-size: 0.75rem;
		color: #6b7280;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-toolbar-info {
		color: #9ca3af;
	}
	.pcv-toolbar-btns {
		display: flex;
		gap: 0.5rem;
	}
	.pcv-btn {
		border-radius: 0.25rem;
		background: #e5e7eb;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		color: #1f2937;
		border: none;
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.pcv-btn:hover {
		background: #d1d5db;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-btn {
		background: #374151;
		color: #e5e7eb;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-btn:hover {
		background: #4b5563;
	}
	.pcv-content {
		max-height: 24rem;
		overflow: auto;
	}
	.pcv-empty {
		padding: 1rem;
		color: #6b7280;
	}
	.pcv-wrap[data-code-theme='dark'] .pcv-empty {
		color: #9ca3af;
	}
</style>
