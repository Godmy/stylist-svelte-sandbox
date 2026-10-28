<script lang="ts">
	import AnimatedBackground from '$stylist/animation/component/atom/animated-background/index.svelte';
	import AnimatedDigit from '$stylist/animation/component/atom/animated-digit/index.svelte';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeStylistHero } from '$stylist/domain/interface/recipe/stylist-hero';
	import heartIconUrl from '$stylist/svg/data/icon/heart/index.svg?url';

	const StylistMark = 'stylist';
	const ArrowRight = 'arrow-right';

	let {
		title = 'Stylist Svelte',
		subtitle = 'Build beautiful Svelte interfaces.',
		subtitleAccent = 'Faster!',
		description = 'A Svelte component ecosystem built through orchestrated AI development. Explore UI components, interactive stories, documentation, and development tools — created and continuously evolved by AI agents working under the SAMO methodology.',
		badgeLabel = 'Built with SAMO · Powered by multi-agent development',
		badgeHref = 'https://www.npmjs.com/package/stylist-svelte',
		poweredByLabel = 'Developed with multiple AI perspectives',
		creditNote = 'Human-directed development',
		rootDomainCount = 0,
		storyModuleCount = 0,
		aiModels = [
			{
				name: 'Claude',
				url: 'https://claude.ai',
				logo: '/logos/claude.png',
				bgColor: 'sh-logo-orange',
				description: 'Anthropic'
			},
			{
				name: 'Codex',
				url: 'https://openai.com',
				logo: '/logos/openai.png',
				bgColor: 'sh-logo-sky',
				description: 'OpenAI'
			},
			{
				name: 'Gemini',
				url: 'https://gemini.google.com',
				logo: '/logos/gemini.png',
				bgColor: 'sh-logo-violet',
				description: 'Google'
			},
			{
				name: 'Qwen',
				url: 'https://github.com/QwenLM',
				logo: '/logos/qwen.png',
				bgColor: 'sh-logo-emerald',
				description: 'Alibaba'
			}
		],
		class: className = ''
	}: RecipeStylistHero = $props();

	// Counts up from 0 on every page load.
	const formatCount = (value: number) => Math.round(value).toString();

	const particleIndexes = Array.from({ length: 18 }, (_, index) => index);
</script>

<AnimatedBackground class={`c-stylist-hero ${className}`}>
	<div class="sh-inner">
		<div class="sh-particles" aria-hidden="true">
			{#each particleIndexes as particleIndex}
				<div
					class="hero-particle sh-particle"
					style={`width:${24 + (particleIndex % 5) * 18}px;height:${24 + (particleIndex % 5) * 18}px;left:${5 + ((particleIndex * 11) % 90)}%;top:${8 + ((particleIndex * 7) % 78)}%;animation-delay:${(particleIndex % 6) * 0.6}s;animation-duration:${8 + (particleIndex % 5) * 2}s;`}
				></div>
			{/each}
		</div>

		<div class="sh-grid">
			<div class="sh-main">
				<a href={badgeHref} target="_blank" rel="noopener noreferrer" class="sh-badge">
					<BaseIcon name={StylistMark} class="sh-badge-sparkles" />
					<span class="sh-badge-label sh-shine">{badgeLabel}</span>
					<BaseIcon name={ArrowRight} class="sh-badge-link" />
				</a>

				<h1 class="sh-heading">
					{title}<sup class="sh-heart" aria-hidden="true">
						<span class="sh-heart-shape" style={`--sh-heart-mask: url("${heartIconUrl}")`}></span>
					</sup>
				</h1>
				<p class="sh-subtitle">
					{subtitle}
					<span class="sh-subtitle-accent sh-shine">{subtitleAccent}</span>
				</p>
				<p class="sh-description">{description}</p>

				<div class="sh-stats">
					<div class="sh-stat-card">
						<div class="sh-stat-label">Public domains</div>
						<div class="sh-stat-value">
							<AnimatedDigit to={rootDomainCount} duration="1500ms" format={formatCount} />
						</div>
					</div>
					<div class="sh-stat-card">
						<div class="sh-stat-label">Story modules</div>
						<div class="sh-stat-value">
							<AnimatedDigit to={storyModuleCount} duration="1500ms" format={formatCount} />
						</div>
					</div>
				</div>
			</div>

			<!-- A quiet credits line: the library stays the hero, the models are context. -->
			<div class="sh-credits">
				<p class="sh-credits-label">{poweredByLabel}</p>
				<ul class="sh-credits-list">
					<li class="sh-credit sh-credit--own">
						<BaseIcon name="stylist" size={16} />
						<span>Stylist</span>
					</li>
					{#each aiModels as model}
						<li class="sh-credit">
							<a
								href={model.url}
								target="_blank"
								rel="noopener noreferrer"
								class="sh-credit-link"
								title={`${model.name} · ${model.description}`}
							>
								<img src={model.logo} alt="" class="sh-credit-logo" />
								<span>{model.name}</span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="sh-credits-note">{creditNote}</p>
			</div>
		</div>
	</div>
</AnimatedBackground>

<style>
	:global(.c-stylist-hero) {
		position: relative;
		overflow: hidden;
		border-radius: 36px;
	}

	.sh-inner {
		position: relative;
		z-index: var(--z-index-docked, 10);
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
		width: 100%;
		max-width: 80rem;
		padding: 2.5rem 1.5rem;
	}

	@media (min-width: 640px) {
		.sh-inner {
			padding-left: 2rem;
			padding-right: 2rem;
		}
	}
	@media (min-width: 1024px) {
		.sh-inner {
			padding-left: 2.5rem;
			padding-right: 2.5rem;
		}
	}

	.sh-particles {
		pointer-events: none;
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.sh-particle {
		position: absolute;
		border-radius: 9999px;
		background-color: rgba(249, 115, 22, 0.2);
	}

	.sh-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 2rem;
	}

	.sh-main {
		text-align: left;
	}

	.sh-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		border-radius: 9999px;
		border: 1px solid color-mix(in srgb, var(--color-warning-500) 45%, transparent);
		background-color: color-mix(in srgb, var(--color-background-primary) 75%, transparent);
		padding: 0.75rem 1.25rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(4px);
		text-decoration: none;
		transition:
			transform 0.2s,
			border-color 0.2s;
	}

	.sh-badge:hover {
		transform: translateY(-2px);
		border-color: var(--color-warning-500);
	}

	:global(.sh-badge-sparkles) {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-warning-500);
		transition: transform 0.2s;
	}

	.sh-badge:hover :global(.sh-badge-sparkles) {
		transform: rotate(12deg);
	}

	.sh-badge-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	:global(.sh-badge-link) {
		width: 1rem;
		height: 1rem;
		color: var(--color-warning-500);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.sh-badge:hover :global(.sh-badge-link) {
		opacity: 1;
	}

	.sh-heading {
		margin-top: 1.5rem;
		max-width: 11ch;
		/* Shrinks on narrow phones so "Stylist Svelte" is never clipped. */
		font-size: clamp(2.5rem, 13vw, 3.75rem);
		line-height: 0.9;
		font-weight: 900;
		letter-spacing: -0.05em;
		color: var(--color-text-primary);
	}

	@media (min-width: 640px) {
		.sh-heading {
			font-size: 4.5rem;
		}
	}
	@media (min-width: 1024px) {
		.sh-heading {
			font-size: 6rem;
		}
	}

	.sh-subtitle {
		margin-top: 1.25rem;
		max-width: 48rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	/* "Faster!" is set apart on the subtitle line. */
	.sh-subtitle-accent {
		margin-left: 0.15em;
		font-size: 1.2em;
		font-weight: 900;
		letter-spacing: -0.02em;
	}

	/* Warm gradient with a light band sweeping across it: badge, accent word and heart
	   share one gradient and one timing, so they shine in sync. */
	.sh-shine,
	.sh-heart-shape {
		color: var(--color-warning-500);
		background: linear-gradient(
			110deg,
			var(--color-warning-500, #f59e0b) 0%,
			var(--color-error-500, #ef4444) 40%,
			#fff7ed 50%,
			var(--color-error-500, #ef4444) 60%,
			var(--color-warning-500, #f59e0b) 100%
		);
		background-size: 250% 100%;
		animation: sh-accent-shine 2.8s linear infinite;
	}

	.sh-shine {
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	@keyframes sh-accent-shine {
		from {
			background-position: 100% 0;
		}
		to {
			background-position: 0% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sh-shine,
		.sh-heart-shape {
			animation: none;
			background-position: 100% 0;
		}
	}

	.sh-description {
		margin-top: 1.25rem;
		max-width: 48rem;
		font-size: 1rem;
		line-height: 2;
		color: var(--color-text-secondary);
	}

	/* Sits top-right of the title like a ™/® mark and scales with the heading. */
	.sh-heart {
		display: inline-flex;
		width: 0.51em;
		height: 0.51em;
		/* Offset, not vertical-align, so the mark never grows the heading's line box.
		   At the 6rem desktop heading: ~30px right of the title, centre ~80px above the baseline. */
		position: relative;
		top: -0.57em;
		margin-left: 0.32em;
		vertical-align: baseline;
		line-height: 0;
		animation: sh-heart-beat 1.4s ease-in-out infinite;
	}

	/* The svg icon's shape cuts the shared shine gradient, one tone darker. */
	.sh-heart-shape {
		width: 100%;
		height: 100%;
		background-image: linear-gradient(
			110deg,
			color-mix(in srgb, var(--color-warning-500, #f59e0b) 85%, black) 0%,
			color-mix(in srgb, var(--color-error-500, #ef4444) 85%, black) 40%,
			#fff7ed 50%,
			color-mix(in srgb, var(--color-error-500, #ef4444) 85%, black) 60%,
			color-mix(in srgb, var(--color-warning-500, #f59e0b) 85%, black) 100%
		);
		-webkit-mask: var(--sh-heart-mask) center / contain no-repeat;
		mask: var(--sh-heart-mask) center / contain no-repeat;
	}

	/* Double "lub-dub" beat. */
	@keyframes sh-heart-beat {
		0%,
		30%,
		100% {
			transform: scale(1);
		}
		15% {
			transform: scale(1.25);
		}
		45% {
			transform: scale(1.15);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sh-heart {
			animation: none;
		}
	}

	.sh-stats {
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.sh-stat-card {
		border-radius: 1rem;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 80%, transparent);
		padding: 0.75rem 1rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(4px);
	}

	.sh-stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.sh-stat-value {
		margin-top: 0.25rem;
		font-size: 1.875rem;
		font-weight: 900;
		color: var(--color-text-primary);
	}

	.sh-credits {
		border-top: 1px solid color-mix(in srgb, var(--color-border-primary) 70%, transparent);
		padding-top: 1.25rem;
	}

	.sh-credits-label {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.sh-credits-list {
		margin: 0.625rem 0 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		row-gap: 0.5rem;
	}

	.sh-credit {
		display: inline-flex;
		align-items: center;
	}

	/* Middle-dot separators between the names. */
	.sh-credit + .sh-credit::before {
		content: '·';
		margin: 0 0.75rem;
		color: var(--color-text-secondary);
		opacity: 0.6;
	}

	/* On phones the row wraps; a dot would open the next line, so use plain gaps. */
	@media (max-width: 639px) {
		.sh-credits-list {
			column-gap: 1rem;
		}

		.sh-credit + .sh-credit::before {
			content: none;
		}
	}

	.sh-credit--own,
	.sh-credit-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.sh-credit--own {
		color: var(--color-warning-500);
	}

	.sh-credit-link {
		text-decoration: none;
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.sh-credit-link:hover {
		opacity: 1;
	}

	.sh-credit-logo {
		width: 1.125rem;
		height: 1.125rem;
		object-fit: contain;
	}

	.sh-credits-note {
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		font-style: italic;
		color: var(--color-text-secondary);
	}

	.hero-particle {
		animation-name: hero-float;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
	}

	@keyframes hero-float {
		0%,
		100% {
			transform: translate3d(0, 0, 0);
		}
		50% {
			transform: translate3d(0, -18px, 0);
		}
	}
</style>
