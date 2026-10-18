<script lang="ts">
	// Render of index.story.ts: onChange is required and not serializable, so the story owns the environment.
	import PreviewSettings from './index.svelte';
	import type { RecipePreviewSettings } from '$stylist/domain/interface/recipe/preview-settings';
	import type { ContractPreviewEnvironment } from '$stylist/domain/interface/contract/preview-environment';

	let args: Partial<RecipePreviewSettings> = $props();
	// Follows the args and is overwritten by the panel.
	let value = $derived<ContractPreviewEnvironment>(args.value ?? {});
</script>

<div class="_c1">
	<PreviewSettings {value} onChange={(next) => (value = next)} />
	<pre class="_c2">{JSON.stringify(value)}</pre>
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
