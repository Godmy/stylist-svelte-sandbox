<script lang="ts">
	import MarkdownRenderer from '$stylist/domain/component/organism/markdown-renderer/index.svelte';
	import JsonTreeViewer from '$stylist/domain/component/molecule/json-tree-viewer/index.svelte';
	import FlatTree from '$stylist/tree/component/molecule/flat-tree/index.svelte';
	import StoryControls from '$stylist/domain/component/molecule/story-controls/index.svelte';
	import { ManagerStoryViewportContext } from '$stylist/theme/class/manager/story-viewport-context';
	import type { RecipeDomainFilePreview } from '$stylist/domain/interface/recipe/domain-file-preview';
	import type { ContractStory } from '$stylist/html/interface/contract/story';
	import type { HtmlNode } from '$stylist/html/type/alias/html-node';
	import { createHtmlStoryNode } from '$stylist/html/function/create/html-story-node';
	import { serializeHtmlMarkup } from '$stylist/html/function/serialize/html-markup';
	import PreviewSettings from '$stylist/domain/component/molecule/preview-settings/index.svelte';
	import { resolvePreviewSkin } from '$stylist/domain/function/resolve/preview-skin';
	import type { ContractPreviewEnvironment } from '$stylist/domain/interface/contract/preview-environment';
	import { captureElementImage } from '$stylist/domain/function/capture/element-image';
	import { resolveContentArea } from '$stylist/domain/function/resolve/content-area';
	import { serializeUnknownError } from '$stylist/domain/function/serialize/unknown-error';

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
	let storyContent: readonly HtmlNode[] | undefined;
	let environment = $state<ContractPreviewEnvironment>({});
	const visualHtml = $derived(resolvePreviewSkin(storyPath));
	$effect(() => {
		// Story args are per story. Appearance is a shared explicit environment choice.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		storyPath;
		storyArgs = undefined;
		storyContent = undefined;
	});
	const family = $derived(storyPath.split('/').at(-2) ?? '');
	const storyTitle = $derived(
		story?.title ??
			family
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
	);
	// `/src/lib/html/component/atom/a/index.story.ts` -> `html / atom / a`
	const storyLocation = $derived(
		storyPath
			.replace(/^\/?src\/lib\//, '')
			.split('/')
			.slice(0, -1)
			.filter((part) => part !== 'component')
			.join(' / ')
	);
	// Fullscreen hides the panel behind a bookmark tab on the right edge; it opens as a drawer.
	const panelId = $props.id();
	let panelOpen = $state(false);
	$effect(() => {
		if (!fullscreen) panelOpen = false;
	});
	let capturing = $state(false);
	let captureError = $state('');
	/** One click: the painted component (not the whole frame) is saved as `<family>.png`. */
	async function takeScreenshot() {
		// Contract canvas first, then the legacy `Story` surface (its own controls stay out).
		const canvas = ['.c-story-canvas', '.component-preview__surface', '.preview-story > *']
			.map((selector) => frame?.contentDocument?.querySelector(selector))
			.find(Boolean);
		if (!canvas || capturing) return;
		capturing = true;
		captureError = '';
		try {
			const blob = await captureElementImage(canvas, resolveContentArea(canvas));
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = `${family || 'story'}.png`;
			link.click();
			setTimeout(() => URL.revokeObjectURL(link.href));
		} catch (error) {
			captureError = `Screenshot failed: ${serializeUnknownError(error).message}`;
		} finally {
			capturing = false;
		}
	}
	// html stories are elements: the HTML tab shows the story tree (context included) as markup.
	const storyMarkup = $derived.by(() => {
		if (!story || !storyPath.includes('/html/component/')) return undefined;
		// Foreign content is supplied by custom render components, not HtmlNode.
		if (family === 'svg' || family === 'math') return undefined;
		const current = story;
		return (args: Record<string, unknown>, content?: readonly HtmlNode[]) => {
			try {
				const node = createHtmlStoryNode(family, current, args, content);
				return node ? serializeHtmlMarkup(node) : null;
			} catch {
				return 'Unable to serialize this content as HTML.';
			}
		};
	});
	// The frame stays transparent until it has the theme and the story painted: no white flash.
	let readyUrl = $state('');
	const frameReady = $derived(readyUrl === frameUrl);
	function sendArgs(args: Record<string, unknown>, content?: readonly HtmlNode[]) {
		storyArgs = args;
		storyContent = content;
		frame?.contentWindow?.postMessage(
			{ type: 'stylist:story-args', args, content },
			window.location.origin
		);
	}
	function syncFrame() {
		frame?.contentWindow?.postMessage(
			{ type: 'stylist:viewport', device: storyDevice, fullscreen },
			window.location.origin
		);
		if (storyArgs) sendArgs(storyArgs, storyContent);
		frame?.contentWindow?.postMessage(
			{
				type: 'stylist:preview-environment',
				settings: visualHtml ? $state.snapshot(environment) : {}
			},
			window.location.origin
		);
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
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		environment;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		visualHtml;
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
		{#snippet screenshotButton(floating: boolean)}
			<button
				type="button"
				class="story-screenshot"
				class:story-screenshot--floating={floating}
				aria-label="Save component screenshot"
				title="Save component screenshot (PNG)"
				disabled={!frameReady || capturing}
				onclick={takeScreenshot}
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path
						d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"
					/>
					<circle cx="12" cy="13" r="3" />
				</svg>
			</button>
		{/snippet}
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
				{#if story && fullscreen}
					<button
						type="button"
						class="story-panel-tab"
						class:story-panel-tab--open={panelOpen}
						aria-controls={panelId}
						aria-expanded={panelOpen}
						aria-label={panelOpen ? 'Hide story controls' : 'Show story controls'}
						title={panelOpen ? 'Hide story controls' : 'Show story controls'}
						onclick={() => (panelOpen = !panelOpen)}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"
						>
							<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
							<circle cx="16" cy="6" r="2" />
							<circle cx="10" cy="12" r="2" />
							<circle cx="18" cy="18" r="2" />
						</svg>
					</button>
				{/if}
				{#if story}
					<!-- Kept mounted in fullscreen (only hidden): control values survive the drawer. -->
					<aside
						id={panelId}
						class="story-panel"
						class:story-panel--drawer={fullscreen}
						hidden={fullscreen && !panelOpen}
						aria-label="Story controls"
					>
						<header class="story-panel__header">
							<div class="story-panel__heading">
								<h2 class="story-panel__title">{storyTitle}</h2>
								{#if storyLocation}<p class="story-panel__location">{storyLocation}</p>{/if}
								{#if story.description}<p class="story-panel__description">
										{story.description}
									</p>{/if}
							</div>
							{@render screenshotButton(false)}
						</header>
						{#if captureError}<p class="story-panel__error" role="alert">{captureError}</p>{/if}
						<div class="story-controls">
							{#if visualHtml}<PreviewSettings
									value={environment}
									onChange={(next) => (environment = next)}
								/>{/if}
							{#key storyPath}
								<StoryControls {story} onChange={sendArgs} markup={storyMarkup} />
							{/key}
						</div>
					</aside>
				{:else}
					{@render screenshotButton(true)}
					{#if captureError}<p class="story-panel__error story-panel__error--floating" role="alert">
							{captureError}
						</p>{/if}
				{/if}
			{:else if typeof StoryPreviewComponent === 'function'}
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
	/* Preview on the left, the story panel (title, screenshot, controls) on the right. */
	.story-preview-shell--controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 24rem);
		gap: 1rem;
	}

	.story-panel {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		margin: -1rem -1rem -1rem 0;
		border-left: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
		overflow: auto;
	}

	.story-panel[hidden] {
		display: none;
	}

	/* Fullscreen: the panel is a drawer over the preview, opened from the bookmark tab. */
	/* Starts below the fixed viewport toolbar so the title and screenshot stay reachable. */
	.story-panel--drawer {
		position: absolute;
		top: 5.5rem;
		right: 0;
		bottom: 1rem;
		z-index: 2;
		width: min(24rem, calc(100% - 3rem));
		margin: 0;
		border: 1px solid var(--color-border-primary);
		border-right: 0;
		border-radius: 14px 0 0 14px;
		box-shadow: -16px 0 38px rgba(15, 23, 42, 0.16);
	}

	.story-panel__header {
		position: sticky;
		top: 0;
		z-index: 1;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
	}

	.story-panel__heading {
		flex: 1;
		min-width: 0;
	}

	.story-panel__title {
		margin: 0;
		font-size: 1rem;
		font-weight: 650;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}

	.story-panel__location,
	.story-panel__description {
		margin: 0.2rem 0 0;
		color: var(--color-text-secondary);
		font-size: 12px;
		line-height: 1.4;
	}

	.story-panel__location {
		font-family: var(--font-mono, monospace);
	}

	.story-panel__error {
		margin: 0;
		padding: 0.5rem 1rem;
		color: var(--color-danger-600, #b42318);
		font-size: 12px;
	}

	.story-panel__error--floating {
		position: absolute;
		right: 1rem;
		bottom: 4rem;
		z-index: 2;
		max-width: 24rem;
		border-radius: 10px;
		background: var(--color-background-primary);
	}

	.story-screenshot,
	.story-panel-tab {
		display: inline-grid;
		place-items: center;
		border: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.story-screenshot {
		flex-shrink: 0;
		width: 2.3rem;
		height: 2.3rem;
		border-radius: 10px;
	}

	.story-screenshot:hover:not(:disabled),
	.story-panel-tab:hover {
		background: var(--color-background-secondary);
	}

	.story-screenshot:disabled {
		cursor: progress;
		opacity: 0.55;
	}

	.story-screenshot--floating {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		z-index: 2;
		box-shadow: 0 8px 22px rgba(15, 23, 42, 0.14);
	}

	/* The bookmark: a small tab glued to the right edge of the fullscreen preview. */
	.story-panel-tab {
		position: absolute;
		top: 50%;
		right: 0;
		z-index: 3;
		width: 1.75rem;
		height: 3.5rem;
		border-right: 0;
		border-radius: 10px 0 0 10px;
		box-shadow: -6px 0 18px rgba(15, 23, 42, 0.12);
		transform: translateY(-50%);
	}

	.story-panel-tab--open {
		right: min(24rem, calc(100% - 3rem));
	}

	@media (max-width: 760px) {
		.story-preview-shell--controls {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(0, 1fr) auto;
		}

		.story-preview-shell--controls .story-panel {
			max-height: 45vh;
			margin: 0 -1rem -1rem;
			border-top: 1px solid var(--color-border-primary);
			border-left: 0;
		}
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
