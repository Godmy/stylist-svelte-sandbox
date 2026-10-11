<script lang="ts">
	import MarkdownRenderer from '$stylist/domain/component/organism/markdown-renderer/index.svelte';
	import JsonTreeViewer from '$stylist/domain/component/molecule/json-tree-viewer/index.svelte';
	import FlatTree from '$stylist/tree/component/molecule/flat-tree/index.svelte';
	import StoryControls from '$stylist/domain/component/molecule/story-controls/index.svelte';
	import { ManagerStoryViewportContext } from '$stylist/theme/class/manager/story-viewport-context';
	import type { RecipeDomainFilePreview } from '$stylist/domain/interface/recipe/domain-file-preview';
	import type { ContractStory } from '$stylist/html/interface/contract/story';

	let {
		previewMode = 'file',
		fileContent = '',
		fileLoading = false,
		fileError = '',
		storyPreviewComponent = null,
		storyPreviewLoading = false,
		storyPreviewError = '',
		dependencyItems = [],
		dependencyTreeNodes = [],
		selectedDependencyKey = '',
		selectedDependencyFiles = [],
		dependencyLoading = false,
		dependencyError = '',
		onDependencySelect,
		previewKind = 'text',
		storyDevice = $bindable('desktop'),
		storyWidth,
		fullscreen = false,
		storyPath = '',
		class: className = ''
	}: RecipeDomainFilePreview = $props();

	ManagerStoryViewportContext.set(
		() => storyDevice,
		() => fullscreen,
		() => true
	);
	let frame = $state<HTMLIFrameElement>();
	let frameHost = $state<HTMLDivElement>();
	let availableWidth = $state(0);
	let availableHeight = $state(0);
	const viewportWidth = $derived(
		storyWidth ?? { mobile: 375, tablet: 768, desktop: 1440, fullscreen: null }[storyDevice]
	);
	const frameScale = $derived(
		viewportWidth && availableWidth ? Math.min(1, availableWidth / viewportWidth) : 1
	);
	$effect(() => {
		if (!frameHost) return;
		const observer = new ResizeObserver(([entry]) => {
			availableWidth = entry.contentRect.width;
			availableHeight = entry.contentRect.height;
		});
		observer.observe(frameHost);
		return () => observer.disconnect();
	});
	const frameUrl = $derived(
		`/preview?story=${encodeURIComponent(storyPath.replace(/^\/?src\/lib\//, '').replace(/^\//, ''))}`
	);
	// `index.story.ts`: controls live here, the iframe only renders the component with args.
	const story = $derived(
		storyPath.endsWith('.story.ts') ? (storyPreviewComponent as ContractStory) : null
	);
	let storyArgs: Record<string, unknown> | undefined;
	// The frame stays transparent until it has the theme and the story painted: no white flash.
	let readyUrl = $state('');
	const frameReady = $derived(readyUrl === frameUrl);
	function sendArgs(args: Record<string, unknown>) {
		storyArgs = args;
		frame?.contentWindow?.postMessage({ type: 'stylist:story-args', args }, window.location.origin);
	}
	function syncFrame() {
		frame?.contentWindow?.postMessage(
			{ type: 'stylist:viewport', device: storyDevice, fullscreen },
			window.location.origin
		);
		if (storyArgs) sendArgs(storyArgs);
	}
	function receiveFrame(event: MessageEvent) {
		if (event.origin !== window.location.origin || event.source !== frame?.contentWindow) return;
		if (event.data?.type === 'stylist:preview-ready') syncFrame();
		if (event.data?.type === 'stylist:story-ready') readyUrl = frameUrl;
		if (event.data?.type === 'stylist:exit-fullscreen')
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
	}
	$effect(() => {
		// Read only to re-sync the frame when the device or fullscreen mode changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		storyDevice;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		fullscreen;
		syncFrame();
	});
	$effect(() => {
		if (!frame) return;
		const observer = new MutationObserver(syncFrame);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['style', 'class', 'data-theme']
		});
		return () => observer.disconnect();
	});

	const renderedContent = $derived.by(() => {
		if (previewKind !== 'json') return fileContent;
		try {
			return JSON.stringify(JSON.parse(fileContent), null, 2);
		} catch {
			return fileContent;
		}
	});
</script>

<svelte:window onmessage={receiveFrame} />

<div
	class="c-domain-file-preview {className}"
	class:fullscreen
	class:c-domain-file-preview--story={previewMode === 'story'}
>
	<!-- One loader for both stages (story module, then frame): same shell, place and text. -->
	{#snippet storyLoading()}
		<p class="empty-state story-frame-loading" role="status">Loading story…</p>
	{/snippet}

	{#if previewMode === 'story' && storyPreviewLoading}
		<div class="story-preview-shell">
			<div class="story-frame-scroll">{@render storyLoading()}</div>
		</div>
	{:else if previewMode === 'story' && storyPreviewError}
		<div class="story-preview-shell">
			<div class="story-frame-scroll">
				<p class="empty-state story-frame-loading" role="alert">{storyPreviewError}</p>
			</div>
		</div>
	{:else if previewMode === 'story' && storyPreviewComponent}
		{@const StoryPreviewComponent = storyPreviewComponent}
		<div class="story-preview-shell" class:story-preview-shell--controls={story && !fullscreen}>
			{#if storyPath}
				<div class="story-frame-scroll" bind:this={frameHost}>
					{#if !frameReady}
						{@render storyLoading()}
					{/if}
					<iframe
						bind:this={frame}
						src={frameUrl}
						title="Component story preview"
						class:story-frame--pending={!frameReady}
						onload={syncFrame}
						style:width={viewportWidth ? `${viewportWidth}px` : '100%'}
						style:height={availableHeight ? `${availableHeight / frameScale}px` : '100%'}
						style:transform={`translateX(-50%) scale(${frameScale})`}
					></iframe>
				</div>
				{#if story && !fullscreen}
					{#key storyPath}
						<StoryControls class="story-controls" {story} onChange={sendArgs} />
					{/key}
				{/if}
			{:else}
				<StoryPreviewComponent />
			{/if}
		</div>
	{:else if fileLoading}
		<p class="empty-state">Loading preview...</p>
	{:else if fileError}
		<p class="empty-state">{fileError}</p>
	{:else if previewMode === 'markdown' && fileContent}
		<div class="markdown-preview">
			<MarkdownRenderer content={fileContent} />
		</div>
	{:else if previewMode === 'json-tree' && fileContent}
		<JsonTreeViewer content={fileContent} />
	{:else if previewMode === 'di'}
		<div class="dependency-preview">
			<aside class="dependency-list" aria-label="Dependency list">
				<div class="dependency-list__header">
					<span>DI</span>
					<span>{dependencyItems.length}</span>
				</div>
				{#if dependencyLoading && dependencyItems.length === 0}
					<p class="dependency-empty">Loading dependencies...</p>
				{:else if dependencyError}
					<p class="dependency-empty">{dependencyError}</p>
				{:else if dependencyItems.length === 0}
					<p class="dependency-empty">No dependencies found for this component.</p>
				{:else}
					<FlatTree
						nodes={dependencyTreeNodes}
						selectedId={selectedDependencyKey}
						onSelect={(node) => onDependencySelect?.(node.id)}
						class="dependency-tree"
					/>
				{/if}
			</aside>
			<section class="dependency-detail" aria-label="Dependency source">
				{#if dependencyLoading && selectedDependencyFiles.length === 0}
					<p class="empty-state">Loading source...</p>
				{:else if dependencyError}
					<p class="empty-state">{dependencyError}</p>
				{:else if selectedDependencyFiles.length === 0}
					<p class="empty-state">Select a dependency to preview source.</p>
				{:else}
					<div class="dependency-detail__title">{selectedDependencyKey}</div>
					{#each selectedDependencyFiles as file (file.name)}
						<div class="dependency-source">
							<div class="dependency-source__name">{file.name}</div>
							<pre><code>{file.content}</code></pre>
						</div>
					{/each}
				{/if}
			</section>
		</div>
	{:else if fileContent && previewKind === 'svg'}
		<div class="svg-preview">
			<div class="svg-art">
				{@html fileContent}
			</div>
			<pre><code>{fileContent}</code></pre>
		</div>
	{:else if fileContent}
		<pre class:json-content={previewKind === 'json'}><code>{renderedContent}</code></pre>
	{:else}
		<p class="empty-state">Select an entity with files to preview content.</p>
	{/if}
</div>

<style>
	.c-domain-file-preview {
		min-height: 0;
		overflow: auto;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
	}

	.c-domain-file-preview--story {
		min-width: 0;
		overflow: hidden;
	}

	.svg-preview {
		display: grid;
		grid-template-rows: minmax(180px, 34vh) auto;
		min-height: 100%;
	}

	.markdown-preview,
	.story-preview-shell {
		min-height: 100%;
		padding: 1rem;
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
	}

	.story-preview-shell {
		box-sizing: border-box;
		height: 100%;
		min-height: 0;
		/* Previewed stories can use any z-index for their own internal layering
		   (overlays, panels, dropdowns). Without a stacking context boundary here,
		   those z-indexes compete directly with the shell's own fixed chrome
		   (e.g. the top-right DomainMenu, z-index: 20) and can paint over it. */
		position: relative;
		isolation: isolate;
		overflow: hidden;
	}

	.story-frame-scroll {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 0;
		overflow: hidden;
	}
	.story-frame-scroll iframe {
		display: block;
		flex-shrink: 0;
		border: 0;
		position: absolute;
		top: 0;
		left: 50%;
		transform-origin: top center;
		height: 100%;
		background: var(--color-background-primary);
	}
	.story-preview-shell--controls {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
	}

	.story-preview-shell--controls :global(.story-controls) {
		max-height: 40vh;
		margin: 1rem -1rem -1rem;
	}

	.story-frame-scroll iframe {
		transition: opacity 120ms ease;
	}

	.story-frame-scroll iframe.story-frame--pending {
		opacity: 0;
	}

	.story-frame-loading {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		margin: 0;
	}

	.fullscreen .story-preview-shell {
		padding: 0;
	}

	.svg-art {
		display: grid;
		place-items: center;
		padding: 1.25rem;
		background:
			linear-gradient(45deg, var(--color-background-secondary) 25%, transparent 25%),
			linear-gradient(-45deg, var(--color-background-secondary) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--color-background-secondary) 75%),
			linear-gradient(-45deg, transparent 75%, var(--color-background-secondary) 75%),
			var(--color-background-primary);
		background-position:
			0 0,
			0 8px,
			8px -8px,
			-8px 0;
		background-size: 16px 16px;
		border-bottom: 1px solid var(--color-border-primary);
		color: var(--color-text-primary);
	}

	.svg-art :global(svg) {
		width: min(220px, 60%);
		height: min(220px, 60%);
		max-width: 100%;
		max-height: 100%;
	}

	pre {
		margin: 0;
		padding: 1rem;
		tab-size: 2;
		white-space: pre-wrap;
		word-break: break-word;
		font-size: 12px;
		line-height: 1.55;
	}

	.json-content {
		white-space: pre;
	}

	.empty-state {
		padding: 1rem;
		color: var(--color-text-secondary);
		font-size: 13px;
	}

	.dependency-preview {
		display: grid;
		grid-template-columns: minmax(220px, 32%) minmax(0, 1fr);
		min-height: 100%;
		background: var(--color-background-primary);
	}

	.dependency-list {
		min-width: 0;
		border-right: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		overflow: auto;
	}

	.dependency-list__header {
		position: sticky;
		top: 0;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		color: var(--color-text-secondary);
		font-family: var(--font-mono, monospace);
		font-size: 12px;
	}

	.dependency-list :global(.dependency-tree) {
		padding: 0.35rem;
		font-family: var(--font-mono, monospace);
		font-size: 12px;
		line-height: 1.35;
	}

	.dependency-detail {
		min-width: 0;
		overflow: auto;
	}

	.dependency-detail__title,
	.dependency-source__name {
		position: sticky;
		top: 0;
		z-index: 1;
		padding: 0.65rem 1rem;
		border-bottom: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
		color: var(--color-text-secondary);
		font-family: var(--font-mono, monospace);
		font-size: 12px;
		word-break: break-word;
	}

	.dependency-source__name {
		position: static;
		border-top: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
	}

	.dependency-empty {
		margin: 0;
		padding: 0.75rem;
		color: var(--color-text-secondary);
		font-size: 12px;
	}

	@media (max-width: 760px) {
		.dependency-preview {
			grid-template-columns: 1fr;
		}

		.dependency-list {
			max-height: 15rem;
			border-right: none;
			border-bottom: 1px solid var(--color-border-primary);
		}
	}
</style>
