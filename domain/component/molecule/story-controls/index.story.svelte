<script lang="ts">
	// Render of index.story.ts: the edited story and the markup function are not serializable, so they are passed here.
	import StoryControls from '$stylist/domain/component/molecule/story-controls/index.svelte';
	import ButtonStory from '$stylist/html/component/atom/button/index.story';
	import { createHtmlStoryNode } from '$stylist/html/function/create/html-story-node';
	import { serializeHtmlMarkup } from '$stylist/html/function/serialize/html-markup';
	import type { HtmlNode } from '$stylist/html/type/alias/html-node';
	import type { RecipeStoryControls } from '$stylist/domain/interface/recipe/story-controls';

	let args: Partial<RecipeStoryControls> = $props();
	let current = $state<Record<string, unknown>>({});

	function markup(values: Record<string, unknown>, content?: readonly HtmlNode[]) {
		const node = createHtmlStoryNode('button', ButtonStory, values, content);
		return node ? serializeHtmlMarkup(node) : null;
	}
</script>

<div class="_c1">
	<StoryControls {...args} story={ButtonStory} {markup} onChange={(values) => (current = values)} />
	<pre class="_c2">Args: {JSON.stringify(current)}</pre>
</div>

<style>
	._c1 {
		display: grid;
		gap: 0.75rem;
	}
	._c2 {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}
</style>
