<script lang="ts">
	// Render of index.story.ts: the category, the remembered widths and fullscreen are kept in local state.
	import DeviceViewport from '$stylist/domain/component/molecule/device-viewport/index.svelte';
	import type { RecipeDeviceViewport } from '$stylist/domain/interface/recipe/device-viewport';
	import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';

	let args: RecipeDeviceViewport = $props();
	// These follow the args and are overwritten by the component callbacks.
	let value = $derived<DeviceFrameViewport>(args.value ?? 'desktop');
	let widths = $derived<Partial<Record<DeviceFrameViewport, number | null>>>(args.widths ?? {});
	let fullscreen = $derived(args.fullscreen ?? false);
</script>

<div class="_c1">
	<DeviceViewport
		{...args}
		{value}
		width={widths[value] ?? null}
		{widths}
		onWidthChange={(width) => (widths = { ...widths, [value]: width })}
		{fullscreen}
		onChange={(next) => (value = next)}
		onFullscreenChange={(next) => (fullscreen = next)}
	/>
	<p class="_c2">Selected: {value} · Fullscreen: {fullscreen}</p>
</div>

<style>
	._c1 {
		display: grid;
		gap: 0.75rem;
		justify-items: start;
	}
	._c2 {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
</style>
