<script lang="ts">
	import IconToolbar from '$stylist/control/component/molecule/icon-toolbar/index.svelte';
	import { JOINT_TOOLBAR_ITEMS } from '$stylist/domain/const/value/joint-toolbar-items';
	import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';
	import type { RecipeJointToolbar } from '$stylist/domain/interface/recipe/joint-toolbar';

	let {
		active,
		availableJoints,
		orientation = TOKEN_ORIENTATION[0],
		showLabel = true,
		onSelect,
		class: className = ''
	}: RecipeJointToolbar = $props();

	const items = $derived(
		availableJoints ? availableJoints.map((name) => ({ name })) : JOINT_TOOLBAR_ITEMS
	);
</script>

<IconToolbar
	{items}
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
