<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeGenericCodeViewer } from '$stylist/development/interface/recipe/generic-code-viewer';
	import { onDestroy } from 'svelte';
	import { createGenericCodeViewerState } from '$stylist/development/component/organism/generic-code-viewer/state.svelte';
	let props: RecipeGenericCodeViewer & HTMLAttributes<HTMLDivElement> = $props();
	const state = createGenericCodeViewerState(() => props);

	onDestroy(state.destroy);
</script>

<div class="gcv-wrap">
	<div class="gcv-header">
		<div class="gcv-traffic">
			<div style="width:0.5rem;height:0.5rem;border-radius:9999px;background:#ef4444"></div>
			<div style="width:0.5rem;height:0.5rem;border-radius:9999px;background:#eab308"></div>
			<div style="width:0.5rem;height:0.5rem;border-radius:9999px;background:#22c55e"></div>
			<span class="gcv-lang">{state.language}</span>
		</div>
		<div class="gcv-actions">
			<button
				class="gcv-copy-btn"
				onclick={state.copyCode}
				title={state.copied ? 'Copied!' : 'Copy code'}
			>
				{#if state.copied}
					<svg style="width:1rem;height:1rem;color:#4ade80" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="gcv-copied-text">Copied!</span>
				{:else}
					<svg style="width:1rem;height:1rem" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					<span>Copy</span>
				{/if}
			</button>
		</div>
	</div>

	<div class="gcv-content">
		{#if state.code && state.highlightedCode}
			<pre class="gcv-pre"><code>{@html state.highlightedCode}</code></pre>
		{:else if state.code}
			<pre class="gcv-pre gcv-pre--plain">{state.code}</pre>
		{:else}
			<div class="gcv-empty">
				<svg
					style="margin-bottom:0.75rem;width:3rem;height:3rem;color:#4b5563"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
					/>
				</svg>
				<p class="gcv-empty-title">No code to display</p>
				<p class="gcv-empty-desc">Adjust component props to see generated code</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.gcv-wrap {
		overflow: hidden;
		border-radius: 0.75rem;
		border: 1px solid #1f2937;
		background: linear-gradient(to bottom right, #111827, #030712);
		color: #f3f4f6;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
	.gcv-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #1f2937;
		background: rgb(17 24 39 / 0.8);
		padding: 0.75rem 1.25rem;
		backdrop-filter: blur(4px);
	}
	.gcv-traffic {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.gcv-lang {
		margin-left: 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.75rem;
		color: #9ca3af;
	}
	.gcv-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.gcv-copy-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		background: #1f2937;
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #e5e7eb;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		transition: all 0.15s;
		border: none;
		cursor: pointer;
	}
	.gcv-copy-btn:hover {
		transform: scale(1.05);
		background: #374151;
	}
	.gcv-copy-btn:active {
		transform: scale(0.95);
	}
	.gcv-copied-text {
		color: #4ade80;
	}
	.gcv-content {
		max-height: 24rem;
		overflow: auto;
		background: rgb(3 7 18 / 0.5);
		padding: 1.25rem;
	}
	.gcv-pre {
		margin: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.875rem;
		line-height: 1.625;
	}
	.gcv-pre--plain {
		color: #d1d5db;
	}
	.gcv-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 3rem;
		padding-bottom: 3rem;
		text-align: center;
	}
	.gcv-empty-title {
		font-size: 0.875rem;
		color: #6b7280;
	}
	.gcv-empty-desc {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: #4b5563;
	}
</style>
