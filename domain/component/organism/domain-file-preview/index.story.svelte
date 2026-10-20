<script lang="ts">
	import DomainFilePreview from './index.svelte';
	import type { RecipeDomainFilePreview } from '$stylist/domain/interface/recipe/domain-file-preview';
	import ClickableStory from '$stylist/layout/component/atom/clickable/index.story.svelte';

	// Render of index.story.ts: the file content follows the preview mode/kind and the story tab embeds a story component.
	let args: RecipeDomainFilePreview = $props();

	const textContent =
		'<script lang="ts">\n\timport { Clickable } from \'$stylist/layout/component\';\n<$stylist/script>';
	const markdownContent = `# Story Coverage\n\n- clickable\n- hoverable\n- focusable`;
	const jsonContent = JSON.stringify(
		{ story: 'clickable', ready: true, events: ['click', 'dblclick'] },
		null,
		2
	);
	const svgContent =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect x="18" y="18" width="84" height="84" rx="20" fill="#e0f2fe"/><path d="M36 60h48" stroke="#0284c7" stroke-width="8" stroke-linecap="round"/><circle cx="84" cy="60" r="12" fill="#0f172a"/></svg>';

	const previewKind = $derived(args.previewMode === 'markdown' ? 'text' : args.previewKind);
	const fileContent = $derived(
		args.previewMode === 'markdown'
			? markdownContent
			: previewKind === 'json'
				? jsonContent
				: previewKind === 'svg'
					? svgContent
					: textContent
	);
</script>

<div class="_c1">
	<DomainFilePreview {...args} {previewKind} {fileContent} storyPreviewComponent={ClickableStory} />
</div>

<style>
	._c1 {
		height: 32rem;
		overflow: hidden;
		border-radius: 1rem;
		border-width: 1px;
		border-style: solid;
		border-color: #e2e8f0;
		background-color: #ffffff;
	}
</style>
