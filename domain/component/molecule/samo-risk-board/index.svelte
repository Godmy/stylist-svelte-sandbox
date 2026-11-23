<script lang="ts">
	import type { RecipeSamoRiskBoard } from '$stylist/domain/interface/recipe/samo-risk-board';

	let {
		eyebrow = 'Chapter 06',
		title = 'Risks, and how the structure answers them',
		description = 'A methodology that only lists benefits is a brochure. These are the objections we hear most often — each with the mechanism that handles it.',
		risks = [
			{
				risk: 'The learning curve',
				symptom: 'Developers need time to get used to four-level paths and strict clusters.',
				solution:
					'The folders mirror TypeScript itself: a type goes to type, logic goes to function. The four-question algorithm replaces tribal knowledge — there are fewer “where does this go?” questions, not more.'
			},
			{
				risk: 'Too many files',
				symptom: 'Splitting everything into one-export files multiplies the file count.',
				solution:
					'Barrels are generated automatically, so for a consumer the library still looks like one module. For an agent, many small files are cheaper than a few large ones — each is read once.'
			},
			{
				risk: 'AI improvisation',
				symptom:
					'An agent invents a new folder, re-exports something or mixes roles “just this once”.',
				solution:
					'AGENTS.md forbids it explicitly, the conflict-report rule makes the agent stop and ask, and the generators and the errors CLI catch what slips through.'
			},
			{
				risk: 'Stale exports',
				symptom: 'TypeScript errors that look unrelated to the change you just made.',
				solution:
					'Exports are derived from the tree, never maintained by hand. When errors look stale, the first step is to regenerate the barrels — then fix what remains.'
			},
			{
				risk: 'Agents colliding',
				symptom: 'Several agents edit the same domain or run tree-wide tools at the same time.',
				solution:
					'A coordination log with soft domain locks: an agent announces the domain before editing. Tree-wide CLIs are run only by a person, after the agents have finished.'
			},
			{
				risk: 'Bus factor',
				symptom: 'Only one or two people really know how the library is organised.',
				solution:
					'The knowledge lives in the structure and the process, not in heads. A path explains an entity; AGENTS.md and the ADRs explain the rules.'
			}
		],
		class: className = ''
	}: RecipeSamoRiskBoard = $props();
</script>

<section class={`c-samo-risk-board ${className}`}>
	<header class="srb-header">
		<p class="srb-eyebrow">{eyebrow}</p>
		<h2 class="srb-title">{title}</h2>
		<p class="srb-description">{description}</p>
	</header>

	<div class="srb-grid">
		{#each risks as item, index (index)}
			<details class="srb-card" open={index === 0}>
				<summary class="srb-summary">
					<span class="srb-index">{String(index + 1).padStart(2, '0')}</span>
					<span class="srb-summary-copy">
						<span class="srb-risk">{item.risk}</span>
						<span class="srb-symptom">{item.symptom}</span>
					</span>
					<span class="srb-toggle" aria-hidden="true"></span>
				</summary>
				<div class="srb-answer">
					<span class="srb-answer-label">How SAMO answers</span>
					<p>{item.solution}</p>
				</div>
			</details>
		{/each}
	</div>
</section>

<style>
	.c-samo-risk-board {
		display: grid;
		gap: 2rem;
	}

	.srb-header {
		max-width: 52rem;
	}

	.srb-eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.srb-title {
		margin-top: 0.5rem;
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.05;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--color-text-primary);
	}

	.srb-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.srb-grid {
		display: grid;
		gap: 1rem;
		align-items: start;
	}

	@media (min-width: 860px) {
		.srb-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.srb-card {
		overflow: hidden;
		border-radius: 24px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 93%, white 7%);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.srb-card[open] {
		border-color: color-mix(in srgb, var(--color-warning-500) 50%, var(--color-border-primary));
		box-shadow: 0 22px 44px -32px rgba(234, 88, 12, 0.7);
	}

	.srb-summary {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: start;
		gap: 1rem;
		padding: 1.25rem 1.375rem;
		cursor: pointer;
		list-style: none;
	}

	.srb-summary::-webkit-details-marker {
		display: none;
	}

	.srb-index {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 1.5rem;
		font-weight: 900;
		line-height: 1.1;
		background: linear-gradient(135deg, #f59e0b, #dc2626);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.srb-summary-copy {
		display: grid;
		gap: 0.25rem;
	}

	.srb-risk {
		font-size: 1.1875rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.srb-symptom {
		line-height: 1.55;
		color: var(--color-text-secondary);
	}

	/* A plus that turns into a cross when the card is open. */
	.srb-toggle {
		position: relative;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--color-warning-500) 14%, transparent);
		transition: transform 0.25s;
	}

	.srb-toggle::before,
	.srb-toggle::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0.75rem;
		height: 2px;
		border-radius: 2px;
		background-color: var(--color-warning-500);
		transform: translate(-50%, -50%);
	}

	.srb-toggle::after {
		transform: translate(-50%, -50%) rotate(90deg);
	}

	.srb-card[open] .srb-toggle {
		transform: rotate(45deg);
	}

	.srb-answer {
		margin: 0 1.375rem 1.375rem;
		border-radius: 1rem;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, #059669 10%, transparent),
			color-mix(in srgb, #0284c7 6%, transparent)
		);
		padding: 1rem 1.125rem;
	}

	.srb-answer-label {
		font-size: 0.6875rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #059669;
	}

	.srb-answer p {
		margin-top: 0.375rem;
		line-height: 1.65;
		color: var(--color-text-primary);
	}

	@media (prefers-reduced-motion: reduce) {
		.srb-toggle {
			transition: none;
		}
	}
</style>
