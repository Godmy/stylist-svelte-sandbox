<script lang="ts">
	import DomainFilePreview from '$stylist/domain/component/organism/domain-file-preview/index.svelte';
	import DomainSearch from '$stylist/domain/component/molecule/domain-search/index.svelte';
	import DomainSidebar from '$stylist/domain/component/organism/domain-sidebar/index.svelte';
	import JointTabButtons from '$stylist/domain/component/molecule/joint-tab-buttons/index.svelte';
	import TaxonomyBreadcrumbs from '$stylist/domain/component/molecule/taxonomy-breadcrumbs/index.svelte';
	import createDomainPageState from './state.svelte';
	import type { RecipeDomainExplorer } from '$stylist/domain/interface/recipe/domain-explorer';

	type StoryModule = { default: unknown };

	const physicalStoryModules = import.meta.glob([
		'/src/lib/**/component/**/index.story.{svelte,ts}',
		'/modules/*/*/component/**/index.story.{svelte,ts}',
		'/modules/*/component/**/index.story.{svelte,ts}'
	]) as Record<string, () => Promise<StoryModule>>;
	const storyModules = Object.fromEntries(
		Object.entries(physicalStoryModules).map(([path, load]) => [
			path
				.replace(/^\/modules\/([^/]+)\/component\//, '/src/lib/$1/component/')
				.replace(/^\/modules\/[^/]+\//, '/src/lib/'),
			load
		])
	);

	let {
		tree,
		initialDomain,
		initialCluster,
		initialJoint,
		initialPreviewMode,
		onSelectionChange,
		storyDevice = $bindable('desktop'),
		storyWidth,
		fullscreen = $bindable(false),
		deviceViewportVisible = $bindable(false),
		class: className = ''
	}: RecipeDomainExplorer = $props();

	const s = createDomainPageState({
		tree,
		storyModules,
		initialDomain,
		initialCluster,
		initialJoint,
		initialPreviewMode
	});

	$effect(() => {
		onSelectionChange?.({
			domain: s.activeDomain,
			cluster: s.activeCluster,
			joint: s.activeJoint,
			family: s.activeFamily,
			entityPath: s.activeEntityPath,
			files: s.activeEntity?.files ?? []
		});
	});

	$effect(() => {
		deviceViewportVisible = s.previewMode === 'story' && !!s.storyPreviewComponent;
	});
</script>

<main class="c-domain-explorer {className}" class:fullscreen>
	<div class="explorer-rail" inert={fullscreen}>
		<DomainSidebar
			activeDomain={s.activeDomain}
			activeCluster={s.activeCluster}
			activeJoint={s.activeJoint}
			availableDomains={s.availableDomainNames}
			availableJoints={s.availableJointNames}
			entities={s.entities}
			activeEntityPath={s.activeEntityPath}
			onDomainSelect={s.handleDomainSelect}
			onClusterSelect={s.handleClusterSelect}
			onJointSelect={s.handleJointSelect}
			onEntitySelect={s.handleEntitySelect}
		/>
	</div>
	<section class="content-panel" aria-label="Content viewer">
		<div class="viewer">
			<div class="viewer-chrome" inert={fullscreen}>
				<div class="taxonomy-row">
					<TaxonomyBreadcrumbs
						domain={s.activeDomain}
						cluster={s.activeCluster}
						joint={s.activeJoint}
						family={s.activeFamilyName}
						file={s.breadcrumbFile}
					/>
					<DomainSearch
						entries={s.searchEntries}
						currentPath={[
							s.activeDomain,
							s.activeCluster,
							s.activeJoint,
							s.activeFamilyName,
							s.breadcrumbFile
						]
							.filter(Boolean)
							.join('\\')}
						onSelect={s.selectSearchEntry}
					/>
				</div>

				{#if s.activeEntity}
					<JointTabButtons
						files={s.activeEntity.files}
						markdownFile={s.markdownFile}
						storyFile={s.storyFile}
						selectedEntityName={s.activeFamily}
						activeFilePath={s.activeFilePath}
						previewMode={s.previewMode}
						previewKind={s.previewKind}
						activeJoint={s.activeJoint}
						hasDependencyPreview={s.hasDependencyPreview}
						onFileSelect={s.handleFileSelect}
						onMarkdownSelect={s.handleMarkdownSelect}
						onStorySelect={s.handleStorySelect}
						onJsonTreeSelect={s.handleJsonTreeSelect}
						onDependencySelect={() => s.handleDependencySelect()}
					/>
				{/if}
			</div>
			<DomainFilePreview
				{storyWidth}
				{fullscreen}
				storyPath={s.storyFile?.path}
				previewMode={s.previewMode}
				fileContent={s.fileContent}
				fileLoading={s.fileLoading}
				fileError={s.fileError}
				storyPreviewComponent={s.storyPreviewComponent}
				storyPreviewLoading={s.storyPreviewLoading}
				storyPreviewError={s.storyPreviewError}
				dependencyItems={s.dependencyItems}
				dependencyTreeNodes={s.dependencyTreeNodes}
				selectedDependencyKey={s.selectedDependencyKey}
				selectedDependencyFiles={s.selectedDependencyFiles}
				dependencyLoading={s.dependencyLoading}
				dependencyError={s.dependencyError}
				onDependencySelect={s.handleDependencySelect}
				previewKind={s.previewKind}
				bind:storyDevice
			/>
		</div>
	</section>
</main>

<style>
	.c-domain-explorer {
		display: grid;
		grid-template-columns: 281px minmax(0, 1fr);
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
		width: 281px;
		box-sizing: border-box;
		height: 100%;
		min-height: 0;
		border-right: 0;
	}
	.viewer-chrome {
		min-width: 0;
		overflow: hidden;
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

	.taxonomy-row {
		display: inline-grid;
		grid-template-columns: minmax(0, 500px) auto;
		align-items: center;
		gap: 15px;
		min-width: 0;
		justify-self: start;
		max-width: 100%;
	}

	.taxonomy-row :global(.c-taxonomy-breadcrumbs) {
		width: 500px;
		max-width: 100%;
		min-width: 0;
	}

	.taxonomy-row :global(.c-domain-search) {
		flex-shrink: 0;
		--domain-search-overlay-width: 510px;
	}

	@media (max-width: 840px) {
		.fullscreen .explorer-rail {
			display: none;
		}
		.explorer-rail :global(.c-domain-sidebar) {
			width: 100%;
		}
		.c-domain-explorer {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(0, 35%) minmax(0, 1fr);
		}
		.c-domain-explorer.fullscreen {
			grid-template-rows: minmax(0, 1fr);
		}
	}
</style>
