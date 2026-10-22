<script lang="ts">
	// Render of index.story.ts: the previewed story holds a component, so it is passed here rather than as an arg.
	import StoryCanvas from '$stylist/domain/component/molecule/story-canvas/index.svelte';
	import ButtonStory from '$stylist/html/component/atom/button/index.story';
	import type { RecipeStoryCanvas } from '$stylist/domain/interface/recipe/story-canvas';

	let args: Partial<RecipeStoryCanvas> = $props();
</script>

<StoryCanvas {...args} story={ButtonStory} />
