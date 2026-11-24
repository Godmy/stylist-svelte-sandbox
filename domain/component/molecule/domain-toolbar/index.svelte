<script lang="ts">
	import IconToolbar from '$stylist/control/component/molecule/icon-toolbar/index.svelte';
	import type { RecipeDomainToolbar } from '$stylist/domain/interface/recipe/domain-toolbar';
	import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';
	import createDomainToolbarComponentState from '$stylist/domain/component/molecule/domain-toolbar/state.svelte';

	let {
		active,
		domains = [],
		orientation = TOKEN_ORIENTATION[0],
		showLabel = true,
		onSelect,
		class: className = ''
	}: RecipeDomainToolbar = $props();

	const state = createDomainToolbarComponentState(() => ({ domains: domains }));
</script>

<IconToolbar
	items={state.items}
	label="domain"
	{active}
	{orientation}
	{showLabel}
	{onSelect}
	class="c-domain-toolbar {className}"
/>

<style>
</style>
