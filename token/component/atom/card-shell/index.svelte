<script lang="ts">
	import type { RecipeCardShell } from '$stylist/token/interface/recipe/card-shell';

	let {
		expanded = false,
		title = 'Graph Node Controls',
		children,
		close
	}: RecipeCardShell = $props();
</script>

<section class="menu-card" class:expanded aria-hidden={!expanded}>
	<div class="content">
		<h3 class="title">{title}</h3>
		<div class="items">{@render children?.()}</div>
	</div>
	{@render close?.()}
</section>

<style>
	.menu-card {
		position: absolute;
		width: 86px;
		height: 86px;
		border-radius: 28px;
		background: #fff;
		border: 1px solid #dbe7ff;
		box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
		overflow: visible;
		transition:
			width 700ms cubic-bezier(0.22, 1, 0.36, 1),
			height 700ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 240ms ease;
		transform: translate(0, 0);
		opacity: 0;
		pointer-events: none;
		z-index: 200;
	}

	.menu-card.expanded {
		width: 390px;
		height: 170px;
		opacity: 1;
		pointer-events: auto;
	}

	.content {
		height: 100%;
		display: grid;
		grid-template-rows: auto 1fr;
		padding: 0.5rem 3.5rem 0.55rem 2.2rem;
		border-radius: inherit;
		overflow: hidden;
		background: #fff;
	}

	.title {
		margin: 0;
		min-height: 2.1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 0.88rem;
		letter-spacing: 0.02em;
		color: #0f172a;
	}

	.items {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 0.05rem;
	}
</style>
