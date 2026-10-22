<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { DOMAIN_SCREEN } from '$stylist/domain/const/object/domain-screen';
	import DomainMenu from '$stylist/domain/component/molecule/domain-menu/index.svelte';
	import DeviceViewport from '$stylist/domain/component/molecule/device-viewport/index.svelte';
	import WorkspaceHints from '$stylist/domain/component/molecule/workspace-hints/index.svelte';
	import createDomainPlaygroundState from '$stylist/domain/component/page/domain-playground/state.svelte';
	import DomainLanding from '$stylist/domain/component/page/domain-landing/index.svelte';
	import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';
	import type { RecipeDomainPlayground } from '$stylist/domain/interface/recipe/domain-playground';
	import type { RecipeDomainSettings } from '$stylist/domain/interface/recipe/domain-settings';
	import { countDomainStories } from '$stylist/domain/function/count/stories';

	let {
		tree = {},
		initialScreen = DOMAIN_SCREEN.LANDING,
		initialDomain,
		initialCluster,
		initialJoint,
		initialPreviewMode,
		class: className = ''
	}: RecipeDomainPlayground = $props();

	const screenState = createDomainPlaygroundState(untrack(() => initialScreen));
	let iconSizes = $state<NonNullable<RecipeDomainSettings['iconSizes']>>({
		module: 16,
		domain: 16,
		cluster: 16,
		joint: 16,
		search: 16
	});
	let iconSizesLoaded = $state(false);
	onMount(() => {
		try {
			const saved = JSON.parse(localStorage.getItem('stylist-domain-icon-sizes') ?? 'null');
			for (const key of ['module', 'domain', 'cluster', 'joint', 'search'] as const) {
				const size = saved?.[key];
				if (typeof size === 'number' && Number.isInteger(size) && size >= 12 && size <= 32) {
					iconSizes[key] = size;
				}
			}
		} catch {
			// Storage can be unavailable or contain an outdated value.
		}
		iconSizesLoaded = true;
	});
	$effect(() => {
		if (!iconSizesLoaded) return;
		const saved = JSON.stringify(iconSizes);
		try {
			localStorage.setItem('stylist-domain-icon-sizes', saved);
		} catch {
			// Resizing still works when browser storage is unavailable.
		}
	});
	let storyDevice = $state<DeviceFrameViewport>('desktop');
	let storyWidths = $state<Record<DeviceFrameViewport, number | null>>({
		mobile: 375,
		tablet: 768,
		desktop: 1440,
		fullscreen: null
	});
	let fullscreen = $state(false);
	let deviceViewportVisible = $state(false);
	const storyModuleCount = $derived(countDomainStories(tree));

	const loadDomainExplorer = () =>
		import('$stylist/domain/component/organism/domain-explorer/index.svelte');
	const loadDomainDiagnostics = () =>
		import('$stylist/domain/component/organism/domain-diagnostics/index.svelte');
	const loadDomainHowItWorks = () =>
		import('$stylist/domain/component/page/domain-how-it-works/index.svelte');
	const loadDomainSettings = () =>
		import('$stylist/domain/component/organism/domain-settings/index.svelte');
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') fullscreen = false;
	}}
/>

<div
	class="c-domain-playground {className}"
	class:c-domain-playground--domain={screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
	class:fullscreen={fullscreen && screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
	style:--domain-module-icon-size="{iconSizes.module}px"
	style:--domain-domain-icon-size="{iconSizes.domain}px"
	style:--domain-cluster-icon-size="{iconSizes.cluster}px"
	style:--domain-joint-icon-size="{iconSizes.joint}px"
	style:--domain-search-icon-size="{iconSizes.search}px"
>
	{#if screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
		{#await loadDomainExplorer() then module}
			{@const DomainExplorer = module.default}
			<DomainExplorer
				{tree}
				{initialDomain}
				{initialCluster}
				{initialJoint}
				{initialPreviewMode}
				storyWidth={storyWidths[storyDevice]}
				bind:storyDevice
				bind:fullscreen
				bind:deviceViewportVisible
			/>
		{/await}
	{:else if screenState.currentScreen === DOMAIN_SCREEN.DIAGNOSTICS}
		{#await loadDomainDiagnostics() then module}
			{@const DomainDiagnostics = module.default}
			<DomainDiagnostics />
		{/await}
	{:else if screenState.currentScreen === DOMAIN_SCREEN.HOW_IT_WORKS}
		{#await loadDomainHowItWorks() then module}
			{@const DomainHowItWorks = module.default}
			<DomainHowItWorks
				onOpenLanding={screenState.handleLandingToggle}
				onBrowseComponents={screenState.handleDomainToggle}
			/>
		{/await}
	{:else}
		<DomainLanding
			rootDomainCount={Array.isArray(tree) ? tree.length : Object.keys(tree).length}
			{storyModuleCount}
			onBrowseComponents={screenState.handleDomainToggle}
			onOpenPlayground={screenState.handleDomainToggle}
			onOpenWorkspace={screenState.handleDomainToggle}
			onOpenGuide={screenState.handleHowItWorksToggle}
		/>
	{/if}

	<div class="menu-shell">
		{#if screenState.currentScreen === DOMAIN_SCREEN.DOMAIN && deviceViewportVisible}
			<DeviceViewport
				value={storyDevice}
				width={storyWidths[storyDevice]}
				widths={storyWidths}
				onWidthChange={(width) => (storyWidths[storyDevice] = width)}
				{fullscreen}
				onChange={(next) => (storyDevice = next)}
				onFullscreenChange={(next) => (fullscreen = next)}
			/>
		{/if}

		<DomainMenu
			landingVisible={screenState.currentScreen === DOMAIN_SCREEN.LANDING}
			domainVisible={screenState.currentScreen === DOMAIN_SCREEN.DOMAIN}
			diagnosticsOpen={screenState.currentScreen === DOMAIN_SCREEN.DIAGNOSTICS}
			howItWorksOpen={screenState.currentScreen === DOMAIN_SCREEN.HOW_IT_WORKS}
			settingsOpen={screenState.isSettingsOpen}
			onLandingToggle={screenState.handleLandingToggle}
			onDomainToggle={screenState.handleDomainToggle}
			onDiagnosticsToggle={screenState.handleDiagnosticsToggle}
			onHowItWorksToggle={screenState.handleHowItWorksToggle}
			onSettingsToggle={screenState.handleSettingsToggle}
			onManifestReload={screenState.handleManifestReload}
		/>
	</div>
</div>

<WorkspaceHints />

{#if screenState.isSettingsOpen}
	{#await loadDomainSettings() then module}
		{@const DomainSettings = module.default}
		<DomainSettings
			open={screenState.isSettingsOpen}
			bind:iconSizes
			onClose={screenState.closeSettings}
		/>
	{/await}
{/if}

<style>
	.c-domain-playground {
		position: relative;
		min-height: 100vh;
	}

	:global(html:has(.c-domain-playground--domain)),
	:global(body:has(.c-domain-playground--domain)) {
		overflow: hidden;
		scrollbar-gutter: auto;
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
		.c-domain-playground {
			padding-top: calc(env(safe-area-inset-top, 0px) + 6rem);
		}

		.menu-shell {
			inset: calc(env(safe-area-inset-top, 0px) + 0.75rem) 0.75rem auto 0.75rem;
			width: auto;
			flex-wrap: wrap;
			justify-content: flex-end;
		}
	}
</style>
