<script lang="ts">
	import NavigationDrawer from '$stylist/navigation/component/organism/navigation-drawer/index.svelte';
	import TopAppBar from '$stylist/navigation/component/organism/top-app-bar/index.svelte';
	import Fragment from '$stylist/navigation/component/template/fragment/index.svelte';
	import DomainFilePreview from '$stylist/domain/component/organism/domain-file-preview/index.svelte';
	import DomainSearch from '$stylist/domain/component/molecule/domain-search/index.svelte';
	import DomainSidebar from '$stylist/domain/component/organism/domain-sidebar/index.svelte';
	import JointTabButtons from '$stylist/domain/component/molecule/joint-tab-buttons/index.svelte';
	import TaxonomyBreadcrumbs from '$stylist/domain/component/molecule/taxonomy-breadcrumbs/index.svelte';

	import type { RecipeDomainExplorer } from '$stylist/domain/interface/recipe/domain-explorer';
	import createDomainPageState from '$stylist/domain/component/organism/domain-explorer/state.svelte';
	type StoryModule = { default: unknown };
	let {
		menu,
		tree,
		initialDomain,
		initialCluster,
		initialJoint,
		initialEntityPath,
		initialPreviewMode,
		onSelectionChange,
		storyDevice = $bindable('desktop'),
		storyWidth,
		fullscreen = $bindable(false),
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- output-only binding, read by the parent
		deviceViewportVisible = $bindable(false),
		class: className = ''
	}: RecipeDomainExplorer = $props();

	const state = createDomainPageState(() => ({
		tree: tree,
		initialDomain: initialDomain,
		initialCluster: initialCluster,
		initialJoint: initialJoint,
		initialEntityPath: initialEntityPath,
		initialPreviewMode: initialPreviewMode,
		onSelectionChange: onSelectionChange,
		get deviceViewportVisible() {
			return deviceViewportVisible;
		},
		set deviceViewportVisible(value) {
			deviceViewportVisible = value;
		}
	}));
</script>

{#snippet sidebar()}
	<DomainSidebar
		activeDomain={state.s.activeDomain}
		activeCluster={state.s.activeCluster}
		activeJoint={state.s.activeJoint}
		availableDomains={state.s.availableDomainNames}
		availableClusters={state.s.availableClusterNames}
		availableJoints={state.s.availableJointNames}
		entities={state.s.entities}
		activeEntityPath={state.s.activeEntityPath}
		onDomainSelect={state.s.handleDomainSelect}
		onClusterSelect={state.s.handleClusterSelect}
		onJointSelect={state.s.handleJointSelect}
		onEntitySelect={state.s.selectNavigationEntity}
	/>
{/snippet}

<main class="c-domain-explorer {className}" class:fullscreen>
	{#if state.s.mobile}
		<NavigationDrawer
			sections={[]}
			open={state.s.drawerOpen}
			onClose={state.s.closeDrawer}
			label="Components"
			class="explorer-drawer"
		>
			{#snippet header()}<button type="button" onclick={state.s.closeDrawer}
					>Close navigation</button
				>{/snippet}
			{#snippet footer()}{@render sidebar()}{/snippet}
		</NavigationDrawer>
	{:else}
		<div class="explorer-rail" inert={fullscreen}>
			{@render sidebar()}
		</div>
	{/if}
	<section
		class="content-panel"
		aria-label="Content viewer"
		inert={state.s.mobile && state.s.drawerOpen}
	>
		{#if state.s.mobile}
			<TopAppBar
				heading={state.s.activeFamilyName || 'Playground'}
				navigation="menu"
				navigationLabel="Choose component"
				menuOpen={state.s.drawerOpen}
				onNavigation={state.s.openDrawer}
				actions={menu}
			/>
		{/if}
		<div class="viewer">
			<div class="viewer-chrome" inert={fullscreen}>
				<div class="taxonomy-row">
					<TaxonomyBreadcrumbs
						module={state.activeModule}
						domain={state.s.activeDomain}
						cluster={state.s.activeCluster}
						joint={state.s.activeJoint}
						family={state.s.activeFamilyName}
						file={state.s.breadcrumbFile}
					/>
					<DomainSearch
						entries={state.s.searchEntries}
						currentPath={[
							state.s.activeDomain,
							state.s.activeCluster,
							state.s.activeJoint,
							state.s.activeFamilyName,
							state.s.breadcrumbFile
						]
							.filter(Boolean)
							.join('\\')}
						onSelect={state.s.selectSearchEntry}
					/>
				</div>

				{#if state.s.activeEntity}
					<JointTabButtons
						files={state.s.activeEntity.files}
						markdownFile={state.s.markdownFile}
						storyFile={state.s.storyFile}
						selectedEntityName={state.s.activeFamily}
						activeFilePath={state.s.activeFilePath}
						previewMode={state.s.previewMode}
						previewKind={state.s.previewKind}
						activeJoint={state.s.activeJoint}
						hasDependencyPreview={state.s.hasDependencyPreview}
						onFileSelect={state.s.handleFileSelect}
						onMarkdownSelect={state.s.handleMarkdownSelect}
						onStorySelect={state.s.handleStorySelect}
						onJsonTreeSelect={state.s.handleJsonTreeSelect}
						onDependencySelect={() => state.s.handleDependencySelect()}
					/>
				{/if}
			</div>
			<Fragment layout="fill" class="explorer-fragment">
				<DomainFilePreview
					{storyWidth}
					{fullscreen}
					storyPath={state.s.storyFile?.path}
					previewMode={state.s.previewMode}
					fileContent={state.s.fileContent}
					fileLoading={state.s.fileLoading}
					fileError={state.s.fileError}
					storyPreviewComponent={state.s.storyPreviewComponent}
					storyPreviewLoading={state.s.storyPreviewLoading}
					storyPreviewError={state.s.storyPreviewError}
					dependencyItems={state.s.dependencyItems}
					dependencyTreeNodes={state.s.dependencyTreeNodes}
					selectedDependencyKey={state.s.selectedDependencyKey}
					selectedDependencyFiles={state.s.selectedDependencyFiles}
					dependencyLoading={state.s.dependencyLoading}
					dependencyError={state.s.dependencyError}
					onDependencySelect={state.s.handleDependencySelect}
					previewKind={state.s.previewKind}
					bind:storyDevice
				/>
			</Fragment>
		</div>
	</section>
</main>

<style>
	:global(.explorer-fragment > .c-domain-file-preview) {
		flex: 1;
	}
	:global(.explorer-drawer.c-navigation-drawer) {
		padding: 0;
		width: min(32rem, calc(100vw - 1rem));
		overflow: hidden;
	}
	:global(.explorer-drawer .c-navigation-drawer__nav) {
		display: none;
	}
	:global(.explorer-drawer .c-navigation-drawer__footer) {
		flex: 1;
		min-height: 0;
		padding: 0;
		margin: 0;
	}
	:global(.explorer-drawer .c-domain-sidebar) {
		height: 100%;
		min-height: 0;
	}
	:global(.explorer-drawer .c-navigation-drawer__header button) {
		min-height: 44px;
		padding-inline: 1rem;
		font: inherit;
		color: var(--color-text-primary);
		background: var(--color-background-primary);
		border: 1px solid var(--color-border-primary);
		border-radius: 8px;
	}

	.c-domain-explorer {
		display: grid;
		grid-template-columns: minmax(281px, max-content) minmax(0, 1fr);
		transition: grid-template-columns 180ms ease;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
	}

	.explorer-rail {
		box-sizing: border-box;
		min-height: 0;
		border-right: 1px solid var(--color-border-primary, #cbd5e1);
		min-width: 0;
		overflow: hidden;
		transition: transform 180ms ease;
	}
	.explorer-rail :global(.c-domain-sidebar) {
		width: 100%;
		box-sizing: border-box;
		height: 100%;
		min-height: 0;
		border-right: 0;
	}
	.viewer-chrome {
		position: relative;
		z-index: 1;
		min-width: 0;
		/* Search results extend over the preview below this row. */
		overflow: visible;
	}
	.fullscreen {
		grid-template-columns: 0 minmax(0, 1fr);
	}
	.fullscreen .explorer-rail {
		transform: translateX(-100%);
		visibility: hidden;
	}
	.fullscreen .viewer-chrome {
		display: none;
	}
	.fullscreen .viewer {
		grid-template-rows: 1fr;
	}
	@media (prefers-reduced-motion: reduce) {
		.c-domain-explorer,
		.explorer-rail {
			transition: none;
		}
	}

	.content-panel {
		grid-template-rows: minmax(0, 1fr);
		display: grid;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	.viewer {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		min-height: 0;
		overflow: hidden;
	}

	/* Same height and divider as the cluster toolbar next to it (icon + 12px button, 2px padding, 1px border). */
	.taxonomy-row {
		display: grid;
		grid-template-columns: minmax(0, 500px) auto;
		justify-content: start;
		align-items: center;
		gap: 15px;
		box-sizing: border-box;
		height: calc(
			max(var(--domain-cluster-icon-size, 16px), var(--domain-search-icon-size, 16px)) + 17px
		);
		min-width: 0;
		padding: 2px 4px 2px 0;
		border-bottom: 1px solid var(--color-border-primary);
	}

	/* Direct child only: breadcrumbs inside search results keep their own spacing. */
	.taxonomy-row > :global(.c-taxonomy-breadcrumbs) {
		width: 500px;
		max-width: 100%;
		min-width: 0;
		padding-block: 0;
		padding-left: calc(0.35rem + 2px);
		border-bottom: 0;
	}

	.taxonomy-row :global(.c-domain-search) {
		flex-shrink: 0;
		/* Covers the breadcrumbs column and gap, leaving the field-to-toggle gap (0.35rem) on the left too. */
		--domain-search-overlay-width: calc(500px + 15px - 0.7rem);
	}

	@media (max-width: 840px) {
		.content-panel {
			grid-template-rows: auto minmax(0, 1fr);
		}
		.fullscreen .explorer-rail {
			display: none;
		}
		.explorer-rail :global(.c-domain-sidebar) {
			width: 100%;
		}
		.c-domain-explorer {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(0, 1fr);
		}
		.c-domain-explorer.fullscreen {
			grid-template-rows: minmax(0, 1fr);
		}
	}
</style>
