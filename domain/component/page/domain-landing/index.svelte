<script lang="ts">
	import StylistLanding from '$stylist/domain/component/page/stylist-landing/index.svelte';
	import type { RecipeDomainLanding } from '$stylist/domain/interface/recipe/domain-landing';

	let {
		rootDomainCount = 0,
		storyModuleCount = 0,
		onBrowseComponents,
		onOpenPlayground,
		onOpenWorkspace,
		onOpenGuide,
		class: className = ''
	}: RecipeDomainLanding = $props();
</script>

<StylistLanding
	{rootDomainCount}
	{storyModuleCount}
	{onBrowseComponents}
	{onOpenPlayground}
	{onOpenWorkspace}
	{onOpenGuide}
	class={className}
/>
