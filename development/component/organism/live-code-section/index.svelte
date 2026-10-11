<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeLiveCodeSection } from '$stylist/development/interface/recipe/live-code-section';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import { createLiveCodeSectionState } from './state.svelte';
	const Play = 'play';
	const ArrowRight = 'arrow-right';

	let props: RecipeLiveCodeSection & HTMLAttributes<HTMLDivElement> = $props();
	const state = createLiveCodeSectionState(() => props);
</script>

<section class={`plcs-section ${state.className}`}>
	<div class="plcs-inner">
		<div class="plcs-header">
			<div class="plcs-badge">
				<BaseIcon name={Play} style="width:1.25rem;height:1.25rem;color:#ea580c" />
				<span class="plcs-badge-text">{state.badgeText}</span>
			</div>
			<h2 class="plcs-title">{state.title}</h2>
			<p class="plcs-desc">{state.description}</p>
		</div>

		<div class="plcs-code-box">
			{#if state.children}
				{#if state.children}{@render state.children()}{/if}
			{:else}
				<pre class="plcs-pre"><code>{state.code}</code></pre>
			{/if}
		</div>

		<div class="plcs-cta">
			<a href={state.ctaHref} class="plcs-cta-link">
				<BaseIcon name={Play} style="width:1.5rem;height:1.5rem" />
				{state.ctaText}
				<BaseIcon name={ArrowRight} style="width:1.5rem;height:1.5rem" />
			</a>
		</div>
	</div>
</section>

<style>
	.plcs-section {
		background: #111827;
		padding-top: 6rem;
		padding-bottom: 6rem;
	}
	.plcs-inner {
		margin-left: auto;
		margin-right: auto;
		max-width: 80rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	@media (min-width: 640px) {
		.plcs-inner {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
	}
	@media (min-width: 1024px) {
		.plcs-inner {
			padding-left: 2rem;
			padding-right: 2rem;
		}
	}
	.plcs-header {
		margin-bottom: 4rem;
		text-align: center;
	}
	.plcs-badge {
		margin-bottom: 1rem;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 9999px;
		background: #ffedd5;
		padding: 0.5rem 1rem;
	}
	@media (prefers-color-scheme: dark) {
		.plcs-badge {
			background: rgb(154 52 18 / 0.3);
		}
	}
	.plcs-badge-text {
		font-size: 0.875rem;
		font-weight: 700;
		color: #7c2d12;
	}
	@media (prefers-color-scheme: dark) {
		.plcs-badge-text {
			color: #fdba74;
		}
	}
	.plcs-title {
		margin-bottom: 1rem;
		font-size: 3rem;
		font-weight: 900;
		color: white;
	}
	.plcs-desc {
		margin-left: auto;
		margin-right: auto;
		max-width: 42rem;
		font-size: 1.25rem;
		color: #9ca3af;
	}
	.plcs-code-box {
		margin-left: auto;
		margin-right: auto;
		max-width: 56rem;
		overflow: hidden;
		border-radius: 1rem;
		border: 1px solid #374151;
		background: #1f2937;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
	.plcs-pre {
		margin: 0;
		overflow-x: auto;
		padding: 1.5rem;
		font-size: 0.875rem;
		color: #f3f4f6;
	}
	.plcs-cta {
		margin-top: 3rem;
		text-align: center;
	}
	.plcs-cta-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		border-radius: 0.75rem;
		background: linear-gradient(to right, #ea580c, #dc2626);
		padding: 1rem 2rem;
		font-size: 1.125rem;
		font-weight: 700;
		color: white;
		text-decoration: none;
		transition: all 0.15s;
	}
	.plcs-cta-link:hover {
		transform: scale(1.05);
		box-shadow: 0 25px 50px -12px rgb(249 115 22 / 0.5);
	}
</style>
