<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DOMAIN_SCREEN } from '$stylist/domain/const/object/domain-screen';
	import DomainMenu from '$stylist/domain/component/molecule/domain-menu/index.svelte';
	import DeviceViewport from '$stylist/domain/component/molecule/device-viewport/index.svelte';
	import WorkspaceHints from '$stylist/domain/component/molecule/workspace-hints/index.svelte';

	import DomainLanding from '$stylist/domain/component/page/domain-landing/index.svelte';

	import type { RecipeDomainPlayground } from '$stylist/domain/interface/recipe/domain-playground';

	import createDomainPlaygroundState from '$stylist/domain/component/page/domain-playground/state.svelte';

	let {
		tree = {},
		initialScreen = DOMAIN_SCREEN.LANDING,
		route,
		onNavigate,
		reports,
		initialDomain,
		initialCluster,
		initialJoint,
		initialPreviewMode,
		class: className = ''
	}: RecipeDomainPlayground = $props();

	const state = createDomainPlaygroundState(() => ({
		tree: tree,
		initialScreen: initialScreen,
		route: route,
		onNavigate: onNavigate,
		reports: reports
	}));
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.target instanceof Element && event.target.closest('[role="dialog"], dialog')) return;
		if (event.key === 'Escape') state.screenState.fullscreen = false;
	}}
/>

{#snippet domainMenu(
	variant: 'full' | 'settings' | 'pages' = state.screenState.mobile ? 'settings' : 'full'
)}
	<DomainMenu
		{variant}
		landingVisible={state.screenState.currentScreen === DOMAIN_SCREEN.LANDING}
		componentsVisible={state.screenState.currentScreen === DOMAIN_SCREEN.COMPONENTS}
		domainVisible={state.screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
		howItWorksOpen={state.screenState.currentScreen === DOMAIN_SCREEN.HOW_IT_WORKS}
		settingsOpen={state.screenState.isSettingsOpen}
		reportsVisible={state.screenState.currentScreen === DOMAIN_SCREEN.REPORTS}
		onReportsToggle={reports ? state.screenState.handleReportsToggle : undefined}
		onLandingToggle={state.screenState.handleLandingToggle}
		onComponentsToggle={state.screenState.handleComponentsToggle}
		onDomainToggle={state.screenState.handleDomainToggle}
		onHowItWorksToggle={state.screenState.handleHowItWorksToggle}
		onSettingsToggle={state.screenState.handleSettingsToggle}
		onManifestReload={state.screenState.handleManifestReload}
	/>
{/snippet}

<div
	inert={state.screenState.mobile && state.screenState.isSettingsOpen}
	class="c-domain-playground {className}"
	class:c-domain-playground--components={state.screenState.currentScreen ===
		DOMAIN_SCREEN.COMPONENTS}
	class:c-domain-playground--domain={state.screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
	class:fullscreen={state.screenState.fullscreen &&
		state.screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
	style:--domain-module-icon-size="{state.iconSizes.module}px"
	style:--domain-domain-icon-size="{state.iconSizes.domain}px"
	style:--domain-cluster-icon-size="{state.iconSizes.cluster}px"
	style:--domain-joint-icon-size="{state.iconSizes.joint}px"
	style:--domain-search-icon-size="{state.iconSizes.search}px"
>
	{#if state.screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
		{#await state.loadDomainExplorer() then module}
			{@const DomainExplorer = module.default}
			{#key state.screenState.selectedStoryPath}
				<DomainExplorer
					{tree}
					initialDomain={state.selectedStory[0] || initialDomain}
					initialCluster={state.selectedStory[1] || initialCluster}
					initialJoint={state.selectedStory[2] || initialJoint}
					initialEntityPath={state.screenState.selectedStoryPath || undefined}
					initialPreviewMode={state.screenState.selectedStoryPath ? 'story' : initialPreviewMode}
					storyWidth={state.storyWidths[state.screenState.storyDevice]}
					bind:storyDevice={state.screenState.storyDevice}
					bind:fullscreen={state.screenState.fullscreen}
					menu={domainMenu as Snippet}
					bind:deviceViewportVisible={state.deviceViewportVisible}
				/>
			{/key}
		{/await}
	{:else if state.screenState.currentScreen === DOMAIN_SCREEN.REPORTS && reports}
		{@render reports()}
	{:else if state.screenState.currentScreen === DOMAIN_SCREEN.HOW_IT_WORKS}
		{#await state.loadDomainHowItWorks() then module}
			{@const DomainHowItWorks = module.default}
			<DomainHowItWorks
				onOpenLanding={state.screenState.handleLandingToggle}
				onBrowseComponents={state.screenState.handleComponentsToggle}
			/>
		{/await}
	{:else if state.screenState.currentScreen === DOMAIN_SCREEN.LANDING}
		<DomainLanding
			rootDomainCount={Array.isArray(tree) ? tree.length : Object.keys(tree).length}
			storyModuleCount={state.storyModuleCount}
			onBrowseComponents={state.screenState.handleComponentsToggle}
			onOpenPlayground={state.screenState.handleDomainToggle}
			onOpenWorkspace={state.screenState.handleDomainToggle}
			onOpenGuide={state.screenState.handleHowItWorksToggle}
		/>
	{/if}

	{#if state.screenState.catalogVisited}
		<div
			class="components-screen"
			hidden={state.screenState.currentScreen !== DOMAIN_SCREEN.COMPONENTS}
		>
			{#await state.loadStylistPreview() then module}
				{@const StylistPreview = module.default}
				<StylistPreview {...state.catalog} onOpenStory={state.screenState.openStory}>
					{#snippet menu()}{@render domainMenu()}{/snippet}
				</StylistPreview>
			{/await}
		</div>
	{/if}

	{#if state.screenState.currentScreen !== DOMAIN_SCREEN.COMPONENTS}
		<div class="menu-shell">
			{#if !state.screenState.mobile && state.deviceViewportVisible}
				{@render displaySettings()}
			{/if}
			{@render domainMenu()}
		</div>
	{/if}
</div>

<WorkspaceHints />

{#snippet displaySettings()}
	<DeviceViewport
		value={state.screenState.storyDevice}
		width={state.storyWidths[state.screenState.storyDevice]}
		widths={state.storyWidths}
		onWidthChange={(width) => (state.storyWidths[state.screenState.storyDevice] = width)}
		fullscreen={state.screenState.fullscreen}
		onChange={(next) => (state.screenState.storyDevice = next)}
		onFullscreenChange={(next) => (state.screenState.fullscreen = next)}
	/>
{/snippet}

{#snippet pageNavigation()}{@render domainMenu('pages')}{/snippet}

{#if state.screenState.isSettingsOpen}
	{#await state.loadDomainSettings() then module}
		{@const DomainSettings = module.default}
		<DomainSettings
			open={state.screenState.isSettingsOpen}
			modal={state.screenState.mobile}
			navigation={(state.screenState.mobile ? pageNavigation : undefined) as Snippet | undefined}
			displaySettings={(state.screenState.mobile ? displaySettings : undefined) as
				Snippet | undefined}
			bind:iconSizes={state.iconSizes}
			onClose={state.screenState.closeSettings}
		/>
	{/await}
{/if}

<style>
	.c-domain-playground {
		position: relative;
		min-height: 100vh;
	}

	:global(html:has(.c-domain-playground)) {
		scrollbar-gutter: stable;
	}

	:global(body:has(.c-domain-playground)) {
		scrollbar-gutter: auto;
	}

	:global(html:has(.c-domain-playground--domain)),
	:global(body:has(.c-domain-playground--domain)) {
		overflow: hidden;
	}

	.c-domain-playground--domain {
		box-sizing: border-box;
		height: 100dvh;
		min-height: 0;
		overflow: hidden;
	}

	.c-domain-playground.fullscreen {
		padding-top: 0;
	}

	.components-screen {
		min-height: 100dvh;
		box-sizing: border-box;
		padding-top: 0;
	}

	.menu-shell {
		position: fixed;
		inset: 0.75rem 0.75rem auto auto;
		z-index: 1000;
		display: flex;
		align-items: stretch;
		justify-content: flex-end;
		gap: 0.55rem;
		width: max-content;
		max-width: calc(100vw - 1.5rem);
	}

	@media (max-width: 840px) {
		:global(html:has(.c-domain-playground--domain)) {
			scrollbar-gutter: auto;
		}
		.c-domain-playground {
			padding-top: calc(env(safe-area-inset-top, 0px) + 6rem);
		}

		.c-domain-playground--components,
		.c-domain-playground--domain {
			padding-top: 0;
		}
		.c-domain-playground--domain .menu-shell {
			display: none;
		}
		.components-screen {
			padding-top: 0;
		}

		.menu-shell {
			inset: calc(env(safe-area-inset-top, 0px) + 0.5rem) 0.5rem auto auto;
			width: auto;
			flex-wrap: wrap;
			justify-content: flex-end;
		}
	}
</style>
