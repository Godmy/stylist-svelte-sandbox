<script lang="ts">
	// Render of index.story.ts: the tabs only report clicks, so the story owns the active file and preview mode.
	import JointTabButtons from '$stylist/domain/component/molecule/joint-tab-buttons/index.svelte';
	import type { RecipeJointTabButtons } from '$stylist/domain/interface/recipe/joint-tab-buttons';

	let args: RecipeJointTabButtons = $props();
	// These follow the args and are overwritten by the tab callbacks.
	let activeFilePath = $derived(args.activeFilePath);
	let previewMode = $derived(args.previewMode);
</script>

<div class="_c1">
	<JointTabButtons
		{...args}
		{activeFilePath}
		{previewMode}
		onFileSelect={(path) => {
			activeFilePath = path;
			previewMode = 'file';
		}}
		onMarkdownSelect={() => (previewMode = 'markdown')}
		onStorySelect={() => (previewMode = 'story')}
		onJsonTreeSelect={() => (previewMode = 'json-tree')}
		onDependencySelect={() => (previewMode = 'di')}
	/>
	<p class="_c2">Preview: {previewMode} · File: {activeFilePath?.split('/').pop() ?? 'none'}</p>
</div>

<style>
	._c1 {
		display: grid;
		gap: 1rem;
	}
	._c2 {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
</style>
