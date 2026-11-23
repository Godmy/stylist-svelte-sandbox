<script lang="ts">
	import type { RecipeSamoGuideHero } from '$stylist/domain/interface/recipe/samo-guide-hero';

	let {
		eyebrow = 'Under the hood',
		title = 'How Stylist',
		titleAccent = 'actually works',
		description = 'The landing explains what SAMO is. This page shows how it lives day to day: how a change travels from a task to a release, how a component grows without breaking, how the umbrella repository and its modules fit together, how to connect the library to your own site, what the platform is made of, which risks exist — and how a team adopts it.',
		terminalLines = [
			'$ task "buttons need a notification counter"',
			'→ domain    layout',
			'→ cluster   interface',
			'→ joint     slot',
			'→ family    badge',
			'+ modules/design-system/layout/interface/slot/badge/index.ts',
			'~ button/interface/recipe/button  (+ SlotBadge)',
			'✓ indexation · errors · manifest'
		],
		chapters = [
			{
				id: 'how-flow',
				label: 'The life of a change',
				description: 'From a task to a release, step by step.'
			},
			{
				id: 'how-extension',
				label: 'Extending without breaking',
				description: 'Open/Closed on a real button.'
			},
			{
				id: 'how-umbrella',
				label: 'Umbrella and modules',
				description: 'Who owns which code, and where to commit.'
			},
			{
				id: 'how-local-dev',
				label: 'Local development',
				description: 'Connect the library and private packages.'
			},
			{
				id: 'how-platform',
				label: 'The platform',
				description: 'Svelte 5, themes, modules, package.'
			},
			{
				id: 'how-risks',
				label: 'Risks and answers',
				description: 'What can go wrong and why it does not.'
			},
			{
				id: 'how-adoption',
				label: 'Adoption',
				description: 'Audit, core, integration, support.'
			}
		],
		class: className = ''
	}: RecipeSamoGuideHero = $props();

	// Scrolls instead of using hash links, so the sandbox's own routing state stays untouched.
	function openChapter(id: string) {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
	}
</script>

<section class={`c-samo-guide-hero ${className}`}>
	<div class="sgh-glow" aria-hidden="true"></div>

	<div class="sgh-grid">
		<div class="sgh-copy">
			<p class="sgh-eyebrow">
				<span class="sgh-eyebrow-mark" aria-hidden="true">?</span>
				{eyebrow}
			</p>
			<h1 class="sgh-title">
				{title}
				<span class="sgh-title-accent">{titleAccent}</span>
			</h1>
			<p class="sgh-description">{description}</p>
		</div>

		<div class="sgh-terminal" aria-label="A change, assembled step by step">
			<div class="sgh-terminal-bar" aria-hidden="true">
				<span></span><span></span><span></span>
				<code class="sgh-terminal-name">samo · change</code>
			</div>
			<ol class="sgh-terminal-lines">
				{#each terminalLines as line, index (index)}
					<li
						class="sgh-line"
						class:sgh-line--ok={line.startsWith('✓')}
						class:sgh-line--add={line.startsWith('+')}
						class:sgh-line--change={line.startsWith('~')}
						class:sgh-line--cmd={line.startsWith('$')}
						style={`animation-delay:${0.25 + index * 0.35}s`}
					>
						{line}
					</li>
				{/each}
			</ol>
		</div>
	</div>

	<ol class="sgh-chapters">
		{#each chapters as chapter, index (chapter.id)}
			<li>
				<button type="button" class="sgh-chapter" onclick={() => openChapter(chapter.id)}>
					<span class="sgh-chapter-index">{String(index + 1).padStart(2, '0')}</span>
					<span class="sgh-chapter-label">{chapter.label}</span>
					<span class="sgh-chapter-desc">{chapter.description}</span>
				</button>
			</li>
		{/each}
	</ol>
</section>

<style>
	.c-samo-guide-hero {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		display: grid;
		gap: clamp(2rem, 4vw, 3rem);
		border-radius: 36px;
		background-color: #0b1020;
		background-image:
			linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
			linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
		background-size: 32px 32px;
		padding: clamp(1.75rem, 5vw, 4rem) clamp(1.25rem, 4vw, 3.5rem);
		color: #f8fafc;
	}

	.sgh-glow {
		position: absolute;
		inset: -30% -10% auto auto;
		z-index: -1;
		width: 38rem;
		height: 38rem;
		border-radius: 9999px;
		background: radial-gradient(
			circle,
			rgba(234, 88, 12, 0.45),
			rgba(220, 38, 38, 0.18) 45%,
			transparent 70%
		);
		filter: blur(10px);
	}

	.sgh-grid {
		display: grid;
		gap: 2.5rem;
	}

	@media (min-width: 1024px) {
		.sgh-grid {
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
			align-items: center;
		}
	}

	.sgh-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #fdba74;
	}

	.sgh-eyebrow-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #f59e0b, #dc2626);
		font-size: 0.9375rem;
		letter-spacing: 0;
		color: #fff;
	}

	.sgh-title {
		margin-top: 1.25rem;
		font-size: clamp(2.5rem, 7vw, 5rem);
		line-height: 0.95;
		font-weight: 900;
		letter-spacing: -0.05em;
	}

	.sgh-title-accent {
		display: block;
		background: linear-gradient(110deg, #f59e0b 0%, #ef4444 45%, #fff7ed 55%, #f59e0b 100%);
		background-size: 220% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: sgh-shine 4s linear infinite;
	}

	@keyframes sgh-shine {
		from {
			background-position: 100% 0;
		}
		to {
			background-position: 0% 0;
		}
	}

	.sgh-description {
		margin-top: 1.5rem;
		max-width: 40rem;
		font-size: 1.125rem;
		line-height: 1.75;
		color: #cbd5e1;
	}

	.sgh-terminal {
		overflow: hidden;
		border-radius: 1.25rem;
		border: 1px solid rgba(148, 163, 184, 0.22);
		background-color: rgba(2, 6, 23, 0.82);
		box-shadow:
			0 30px 60px -30px rgba(234, 88, 12, 0.55),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(6px);
	}

	.sgh-terminal-bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		border-bottom: 1px solid rgba(148, 163, 184, 0.16);
		padding: 0.75rem 1rem;
	}

	.sgh-terminal-bar span {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 9999px;
		background-color: #334155;
	}

	.sgh-terminal-bar span:nth-child(1) {
		background-color: #ef4444;
	}
	.sgh-terminal-bar span:nth-child(2) {
		background-color: #f59e0b;
	}
	.sgh-terminal-bar span:nth-child(3) {
		background-color: #22c55e;
	}

	.sgh-terminal-name {
		margin-left: auto;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: #64748b;
	}

	.sgh-terminal-lines {
		display: grid;
		gap: 0.375rem;
		margin: 0;
		padding: 1.25rem 1.25rem 1.5rem;
		list-style: none;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: clamp(0.75rem, 1.6vw, 0.9375rem);
		white-space: pre-wrap;
		word-break: break-word;
		color: #94a3b8;
	}

	/* Lines appear one after another, like an agent working through the four coordinates. */
	.sgh-line {
		opacity: 0;
		transform: translateY(4px);
		animation: sgh-line-in 0.4s ease-out forwards;
	}

	.sgh-line--cmd {
		color: #f8fafc;
	}
	.sgh-line--add {
		color: #4ade80;
	}
	.sgh-line--change {
		color: #fbbf24;
	}
	.sgh-line--ok {
		color: #fdba74;
		font-weight: 700;
	}

	@keyframes sgh-line-in {
		to {
			opacity: 1;
			transform: none;
		}
	}

	.sgh-chapters {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(11.5rem, 1fr));
	}

	.sgh-chapter {
		display: grid;
		gap: 0.25rem;
		width: 100%;
		height: 100%;
		border-radius: 1.25rem;
		border: 1px solid rgba(148, 163, 184, 0.2);
		background-color: rgba(15, 23, 42, 0.6);
		padding: 1rem 1.125rem;
		font: inherit;
		text-align: left;
		color: inherit;
		cursor: pointer;
		transition:
			transform 0.2s,
			border-color 0.2s,
			background-color 0.2s;
	}

	.sgh-chapter:hover {
		transform: translateY(-3px);
		border-color: rgba(249, 115, 22, 0.7);
		background-color: rgba(249, 115, 22, 0.1);
	}

	.sgh-chapter-index {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: #fb923c;
	}

	.sgh-chapter-label {
		font-weight: 800;
		color: #f8fafc;
	}

	.sgh-chapter-desc {
		font-size: 0.875rem;
		line-height: 1.5;
		color: #94a3b8;
	}

	@media (prefers-reduced-motion: reduce) {
		.sgh-title-accent,
		.sgh-line {
			animation: none;
		}

		.sgh-line {
			opacity: 1;
			transform: none;
		}

		.sgh-chapter:hover {
			transform: none;
		}
	}
</style>
