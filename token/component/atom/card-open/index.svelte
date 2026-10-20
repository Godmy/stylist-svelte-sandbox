<script lang="ts">
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeCardOpen } from '$stylist/token/interface/recipe/card-open';

	let {
		orbitOpen = false,
		dragging = false,
		style = '',
		onPointerDown,
		onClick
	}: RecipeCardOpen = $props();
</script>

<button
	type="button"
	class={`card-open ${orbitOpen ? 'card-open--active' : ''} ${dragging ? 'card-open--dragging' : ''}`.trim()}
	{style}
	onpointerdown={onPointerDown}
	onclick={onClick}
	aria-label="Toggle L6 controls"
>
	<span class="card-open__face card-open__face--icon" aria-hidden={orbitOpen}>
		<Icon name="settings" size={16} container="none" />
	</span>
	<span class="card-open__face card-open__face--close" aria-hidden={!orbitOpen}>
		<Icon name="x" size={16} container="none" />
	</span>
</button>

<style>
	.card-open {
		position: absolute;
		width: 48px;
		height: 48px;
		border-radius: 999px;
		border: 1px solid #2563eb;
		background: linear-gradient(145deg, #1e293b 0%, #2563eb 100%);
		color: #fff;
		display: grid;
		place-items: center;
		cursor: pointer;
		z-index: 400;
		box-shadow: 0 12px 22px rgba(15, 23, 42, 0.32);
		touch-action: none;
	}

	.card-open__face {
		position: absolute;
		display: grid;
		place-items: center;
		transition:
			opacity 180ms ease,
			transform 220ms ease;
	}

	.card-open__face--icon {
		opacity: 1;
		transform: scale(1) rotate(0deg);
	}

	.card-open__face--close {
		opacity: 0;
		transform: scale(0.6) rotate(-40deg);
	}

	.card-open--active .card-open__face--icon {
		opacity: 0;
		transform: scale(0.6) rotate(40deg);
	}

	.card-open--active .card-open__face--close {
		opacity: 1;
		transform: scale(1) rotate(0deg);
	}

	.card-open:hover,
	.card-open--dragging {
		border-color: #93c5fd;
		box-shadow:
			0 0 0 3px rgba(147, 197, 253, 0.32),
			0 10px 20px rgba(15, 23, 42, 0.3);
	}

	.card-open--dragging {
		cursor: grabbing;
	}
</style>
