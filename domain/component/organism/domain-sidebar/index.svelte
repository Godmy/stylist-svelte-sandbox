<script lang="ts">
	import DomainToolbar from '$stylist/domain/component/molecule/domain-toolbar/index.svelte';
	import ClusterToolbar from '$stylist/domain/component/molecule/cluster-toolbar/index.svelte';
	import JointToolbar from '$stylist/domain/component/molecule/joint-toolbar/index.svelte';
	import DomainList from '$stylist/domain/component/molecule/domain-list/index.svelte';
	import type { RecipeDomainSidebar } from '$stylist/domain/interface/recipe/domain-sidebar';
	import { resolveModuleGroup } from '$stylist/domain/function/resolve/module-group';
	const registries = import.meta.glob('/modules.json', {
		eager: true,
		import: 'default'
	}) as Record<string, Record<string, { path?: string; domains: string[] }>>;
	const moduleIcons = import.meta.glob('../../../data/icon/module/*.svg', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;

	let {
		activeDomain,
		activeCluster,
		activeJoint,
		availableDomains = [],
		availableJoints,
		entities = [],
		activeEntityPath,
		draggableEntities = false,
		onDomainSelect,
		onClusterSelect,
		onJointSelect,
		onEntitySelect,
		onEntityAdd,
		onEntityDragStart,
		class: className = ''
	}: RecipeDomainSidebar = $props();
	const modules = $derived(resolveModuleGroup(registries['/modules.json'] ?? {}, availableDomains));
	const activeModule = $derived(
		modules.find((entry) => entry.domains.includes(activeDomain ?? ''))?.name
	);
	const visibleDomains = $derived(
		modules.find((entry) => entry.name === activeModule)?.domains ?? availableDomains
	);
</script>

<aside class="c-domain-sidebar {className}" aria-label="Taxonomy">
	<div class="sidebar-grid">
		<nav class="module-toolbar" aria-label="Modules">
			{#each modules as module (module.name)}
				<button
					type="button"
					title={module.name}
					aria-label={module.name}
					aria-current={activeModule === module.name ? 'page' : undefined}
					class:active={activeModule === module.name}
					onclick={() => {
						if (activeModule !== module.name) onDomainSelect?.(module.domains[0]);
					}}
				>
					{@html moduleIcons[`../../../data/icon/module/${module.name}.svg`] ??
						moduleIcons['../../../data/icon/module/default.svg'] ??
						''}
				</button>
			{/each}
		</nav>
		<DomainToolbar
			active={activeDomain}
			domains={visibleDomains}
			orientation="vertical"
			showLabel={false}
			onSelect={onDomainSelect}
		/>

		<ClusterToolbar active={activeCluster} showLabel={false} onSelect={onClusterSelect} />

		<JointToolbar
			active={activeJoint}
			{availableJoints}
			showLabel={false}
			onSelect={onJointSelect}
		/>

		<DomainList
			{entities}
			activePath={activeEntityPath}
			draggable={draggableEntities}
			onSelect={onEntitySelect}
			onAdd={onEntityAdd}
			onDragStart={onEntityDragStart}
		/>
	</div>
</aside>

<style>
	.c-domain-sidebar {
		display: grid;
		grid-template-rows: minmax(0, 1fr);
		border-right: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
	}

	.sidebar-grid {
		display: grid;
		grid-template-columns:
			calc(var(--domain-module-icon-size, 16px) + 16px)
			calc(var(--domain-domain-icon-size, 16px) + 16px) minmax(216px, max-content);
		grid-template-rows: auto auto minmax(0, 1fr);
		min-height: 0;
		align-content: start;
	}

	.sidebar-grid :global(.c-domain-toolbar) {
		--taxonomy-icon-size: var(--domain-domain-icon-size, 16px);
		grid-column: 2;
		grid-row: 1 / span 3;
		box-sizing: border-box;
		width: calc(var(--taxonomy-icon-size) + 16px);
		height: auto;
		align-self: stretch;
		border-right: 1px solid var(--color-border-primary);
	}

	.sidebar-grid :global(.c-cluster-toolbar) {
		--taxonomy-icon-size: var(--domain-cluster-icon-size, 16px);
		grid-column: 3;
		grid-row: 1;
		min-width: 0;
	}

	.sidebar-grid :global(.c-joint-toolbar) {
		--taxonomy-icon-size: var(--domain-joint-icon-size, 16px);
		grid-column: 3;
		grid-row: 2;
		min-width: 0;
	}

	.sidebar-grid :global(.c-domain-list) {
		grid-column: 3;
		grid-row: 3;
		min-height: 0;
		min-width: 0;
		contain: inline-size;
	}
	.sidebar-grid :global(.c-icon-toolbar .toolbar-btn) {
		width: calc(var(--taxonomy-icon-size, 16px) + 12px);
		height: calc(var(--taxonomy-icon-size, 16px) + 12px);
		flex-shrink: 0;
	}
	.sidebar-grid :global(.c-icon-toolbar .icon),
	.sidebar-grid :global(.c-icon-toolbar .icon svg) {
		width: var(--taxonomy-icon-size, 16px);
		height: var(--taxonomy-icon-size, 16px);
	}
	.module-toolbar {
		grid-column: 1;
		grid-row: 1 / span 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		padding: 2px;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		border-right: 1px solid var(--color-border-primary);
	}
	.module-toolbar button {
		display: grid;
		place-items: center;
		width: calc(var(--domain-module-icon-size, 16px) + 12px);
		height: calc(var(--domain-module-icon-size, 16px) + 12px);
		flex-shrink: 0;
		padding: 0;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
	}
	.module-toolbar button:hover {
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
	}
	.module-toolbar button.active {
		background: color-mix(in srgb, var(--color-primary-500) 15%, transparent);
		color: var(--color-primary-600);
		box-shadow: inset 2px 0 var(--color-primary-500);
	}
	.module-toolbar button:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: -2px;
	}
	.module-toolbar :global(svg) {
		width: var(--domain-module-icon-size, 16px);
		height: var(--domain-module-icon-size, 16px);
	}

	@media (max-width: 840px) {
		.sidebar-grid {
			grid-template-columns:
				calc(var(--domain-module-icon-size, 16px) + 16px)
				calc(var(--domain-domain-icon-size, 16px) + 16px) minmax(0, 1fr);
		}

		.sidebar-grid :global(.c-cluster-toolbar),
		.sidebar-grid :global(.c-joint-toolbar) {
			flex-wrap: wrap;
		}
	}
</style>
