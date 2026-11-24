<script lang="ts">
	import type { RecipeJsonTreeViewer } from '$stylist/domain/interface/recipe/json-tree-viewer';
	import createJsonTreeViewerComponentState from '$stylist/domain/component/molecule/json-tree-viewer/state.svelte';

	let { content = '', class: className = '' }: RecipeJsonTreeViewer = $props();

	const state = createJsonTreeViewerComponentState(() => ({ content: content }));
</script>

{#snippet renderNode(value: unknown, key: string | null, path: string, depth: number)}
	{@const t = state.typeOf(value)}
	{#if t === 'object' || t === 'array'}
		{@const entries =
			t === 'array'
				? (value as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
				: Object.entries(value as Record<string, unknown>)}
		{@const open = state.isOpen(path)}
		{@const count = entries.length}
		<div class="node" style:padding-left="{depth * 16}px">
			<button type="button" class="toggle" onclick={() => state.toggle(path)} aria-expanded={open}>
				<span class="chevron">{open ? '▾' : '▸'}</span>
			</button>
			{#if key !== null}<span class="key">"{key}"</span><span class="punct">: </span>{/if}
			<span class="bracket">{t === 'array' ? '[' : '{'}</span>
			{#if !open}
				<span class="count">{count} {count === 1 ? 'item' : 'items'}</span>
				<span class="bracket">{t === 'array' ? ']' : '}'}</span>
			{/if}
		</div>
		{#if open}
			{#each entries as [k, v], entryIndex (entryIndex)}
				{@render renderNode(v, t === 'object' ? k : null, `${path}/${k}`, depth + 1)}
			{/each}
			<div class="close-line" style:padding-left="{depth * 16}px">
				<span class="bracket">{t === 'array' ? ']' : '}'}</span>
			</div>
		{/if}
	{:else}
		<div class="leaf" style:padding-left="{depth * 16}px">
			{#if key !== null}<span class="key">"{key}"</span><span class="punct">: </span>{/if}
			{#if t === 'string'}
				<span class="val-string">"{value as string}"</span>
			{:else if t === 'number'}
				<span class="val-number">{value as number}</span>
			{:else if t === 'boolean'}
				<span class="val-bool">{String(value)}</span>
			{:else}
				<span class="val-null">null</span>
			{/if}
		</div>
	{/if}
{/snippet}

<div class="c-json-tree-viewer {className}">
	{#if state.parsed.error}
		<p class="parse-error">Invalid JSON: {state.parsed.error}</p>
	{:else}
		<div class="tree">
			{@render renderNode(state.parsed.value, null, 'root', 0)}
		</div>
	{/if}
</div>

<style>
	.c-json-tree-viewer {
		padding: 0.75rem 1rem;
		font-family: var(--font-mono, monospace);
		font-size: 12px;
		line-height: 1.6;
		color: #e2e8f0;
	}

	.node,
	.leaf,
	.close-line {
		display: flex;
		align-items: baseline;
		gap: 0.15rem;
		min-width: 0;
	}

	.toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		border: none;
		background: transparent;
		color: #64748b;
		cursor: pointer;
		padding: 0;
		font-size: 10px;
		line-height: 1;
	}

	.toggle:hover {
		color: #94a3b8;
	}

	.chevron {
		font-size: 10px;
	}

	.leaf {
		padding-left: 16px;
	}

	.key {
		color: #93c5fd;
		flex-shrink: 0;
	}

	.punct {
		color: #64748b;
		flex-shrink: 0;
	}

	.bracket {
		color: #94a3b8;
		flex-shrink: 0;
	}

	.count {
		color: #475569;
		margin: 0 0.25rem;
	}

	.val-string {
		color: #86efac;
		word-break: break-all;
	}

	.val-number {
		color: #fbbf24;
	}

	.val-bool {
		color: #f472b6;
	}

	.val-null {
		color: #64748b;
		font-style: italic;
	}

	.parse-error {
		margin: 0;
		color: #f87171;
		font-size: 12px;
		font-family: var(--font-mono, monospace);
	}
</style>
