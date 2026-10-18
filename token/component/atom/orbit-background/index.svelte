<script lang="ts">
	import type { RecipeOrbitBackground } from '$stylist/token/interface/recipe/orbit-background';

	let { opened = false, children }: RecipeOrbitBackground = $props();
</script>

<div class="orbit-bg" class:opened>
	<div class="ring-a ring" aria-hidden="true"></div>
	<div class="ring-b ring" aria-hidden="true"></div>
	<div class="ring-c ring" aria-hidden="true"></div>
	<div class="orbit-bg__content">
		{@render children?.()}
	</div>
</div>

<style>
	.orbit-bg {
		position: relative;
		width: 320px;
		height: 320px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		background: radial-gradient(
			circle at 34% 24%,
			rgba(255, 255, 255, 0.96) 0%,
			rgba(230, 242, 255, 0.94) 58%,
			rgba(209, 228, 255, 0.92) 100%
		);
		border: 1px solid #c9ddff;
		box-shadow:
			inset 0 1px 0 #fff,
			0 20px 34px rgba(29, 78, 216, 0.2);
		transform: scale(0.2);
		opacity: 0;
		transition:
			transform 430ms cubic-bezier(0.2, 1.1, 0.34, 1),
			opacity 320ms ease;
		pointer-events: none;
	}

	.orbit-bg__content {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
	}

	.orbit-bg__content :global(.token-orbit) {
		grid-area: 1 / 1;
	}

	.orbit-bg.opened {
		transform: scale(1);
		opacity: 1;
		pointer-events: auto;
	}

	.ring {
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 999px;
		border: 1px dashed transparent;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.78);
		transition:
			transform 360ms ease,
			opacity 360ms ease,
			border-color 360ms ease;
	}

	.ring-a {
		width: 136px;
		height: 136px;
		border-color: rgba(37, 99, 235, 0.5);
		transition-delay: 70ms;
	}

	.ring-b {
		width: 204px;
		height: 204px;
		border-color: rgba(14, 116, 144, 0.45);
		transition-delay: 130ms;
	}

	.ring-c {
		width: 272px;
		height: 272px;
		border-color: rgba(147, 51, 234, 0.4);
		transition-delay: 190ms;
	}

	.orbit-bg.opened .ring {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
</style>
