<script lang="ts">
	// Render of index.story.ts: the toggles only report clicks, so the story owns the screen and panel state.
	import DomainMenu from '$stylist/domain/component/molecule/domain-menu/index.svelte';
	import type { RecipeDomainMenu } from '$stylist/domain/interface/recipe/domain-menu';

	let args: RecipeDomainMenu = $props();
	// These follow the args and are overwritten by the menu toggles.
	let landingVisible = $derived(args.landingVisible ?? false);
	let domainVisible = $derived(args.domainVisible ?? false);
	let diagnosticsOpen = $derived(args.diagnosticsOpen ?? false);
	let howItWorksOpen = $derived(args.howItWorksOpen ?? false);
	let settingsOpen = $derived(args.settingsOpen ?? false);

	function show(screen: 'landing' | 'domain' | 'diagnostics') {
		landingVisible = screen === 'landing';
		domainVisible = screen === 'domain';
		diagnosticsOpen = screen === 'diagnostics';
	}
</script>

<div class="_c1">
	<DomainMenu
		{...args}
		{landingVisible}
		{domainVisible}
		{diagnosticsOpen}
		{howItWorksOpen}
		{settingsOpen}
		onLandingToggle={() => show('landing')}
		onDomainToggle={() => show('domain')}
		onDiagnosticsToggle={() => show('diagnostics')}
		onHowItWorksToggle={() => (howItWorksOpen = !howItWorksOpen)}
		onSettingsToggle={() => (settingsOpen = !settingsOpen)}
	/>
	<p class="_c2">
		Screen: {landingVisible
			? 'landing'
			: diagnosticsOpen
				? 'diagnostics'
				: domainVisible
					? 'domain'
					: 'none'} · Settings: {settingsOpen ? 'open' : 'closed'}
	</p>
</div>

<style>
	._c1 {
		display: grid;
		gap: 0.75rem;
		justify-items: start;
	}
	._c2 {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
</style>
