<script lang="ts">
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeCardClose } from '$stylist/token/interface/recipe/card-close';

	let { expanded = false, onClick }: RecipeCardClose = $props();
</script>

<button
	type="button"
	class={`card-close ${expanded ? 'card-close--visible' : ''}`.trim()}
	onclick={onClick}
	aria-label="Close card"
>
	<Icon name="x" size={14} container="none" />
</button>

<style>
	.card-close {
		position: absolute;
		top: 24px;
		right: 24px;
		width: 48px;
		height: 48px;
		border-radius: 999px;
		border: 1px solid rgba(37, 99, 235, 0.78);
		background: #1e293b;
		display: grid;
		place-items: center;
		cursor: pointer;
		box-shadow: 0 10px 18px rgba(15, 23, 42, 0.24);
		transform: translate(50%, -50%) scale(0.72);
		opacity: 0;
		transition:
			transform 380ms ease,
			opacity 260ms ease;
		z-index: 400;
	}

	.card-close--visible {
		transform: translate(50%, -50%) scale(1);
		opacity: 1;
	}

	.card-close :global(svg) {
		color: rgba(255, 255, 255, 0.9);
		filter: drop-shadow(0 0 0.6px rgba(255, 255, 255, 0.35));
	}
</style>
