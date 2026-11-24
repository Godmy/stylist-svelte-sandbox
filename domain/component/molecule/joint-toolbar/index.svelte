<script lang="ts">
	import IconToolbar from '$stylist/control/component/molecule/icon-toolbar/index.svelte';

	import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';
	import type { RecipeJointToolbar } from '$stylist/domain/interface/recipe/joint-toolbar';
	import createJointToolbarComponentState from '$stylist/domain/component/molecule/joint-toolbar/state.svelte';

	let {
		active,
		availableJoints,
		orientation = TOKEN_ORIENTATION[0],
		showLabel = true,
		onSelect,
		class: className = ''
	}: RecipeJointToolbar = $props();

	const state = createJointToolbarComponentState(() => ({ availableJoints: availableJoints }));
</script>

<IconToolbar
	items={state.items}
	label="joint"
	{active}
	{orientation}
	{showLabel}
	availableItems={availableJoints}
	emptyText="no joints"
	{onSelect}
	class="c-joint-toolbar {className}"
/>

<style>
</style>
