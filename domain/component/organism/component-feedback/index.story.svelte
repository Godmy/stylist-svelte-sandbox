<script lang="ts">
	import ComponentFeedback from '$stylist/domain/component/organism/component-feedback/index.svelte';
	import createComponentFeedbackStoryState from '$stylist/domain/component/organism/component-feedback/state.svelte';
	import type { RecipeComponentFeedback } from '$stylist/domain/interface/recipe/component-feedback';
	let { args = {} }: { args?: Partial<RecipeComponentFeedback> } = $props();
	const feedback = createComponentFeedbackStoryState();
</script>

<div style="position: relative; min-height: 24rem; padding: 1rem;">
	<p>Select H1, or switch to the panel preset to edit the local feedback.</p>
	<ComponentFeedback
		mode={args.mode ?? 'card'}
		storyId="html/component/atom/h1"
		componentName="H1"
		{feedback}
	/>
</div>
