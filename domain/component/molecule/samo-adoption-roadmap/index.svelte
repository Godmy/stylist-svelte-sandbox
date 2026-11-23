<script lang="ts">
	import type { RecipeSamoAdoptionRoadmap } from '$stylist/domain/interface/recipe/samo-adoption-roadmap';

	let {
		eyebrow = 'Chapter 07',
		title = 'Adoption without a rewrite',
		description = 'Nobody has to rewrite everything. The library is introduced as a layer that starts paying off on the very next changes — and support keeps it from turning into an archive after the first release.',
		stages = [
			{
				title: 'Audit',
				description:
					'Look at the current UI layer: repeated patterns, pain points, the domain map and release priorities.',
				deliverables: ['Domain map', 'Duplication hotspots', 'Migration candidates']
			},
			{
				title: 'Core',
				description:
					'Assemble the base families, the theme layer, the public surface and the extension rules for this team.',
				deliverables: ['Tokens & ThemeProvider', 'First families', 'AGENTS.md for the team']
			},
			{
				title: 'Integration',
				description:
					'Connect the library to live screens, so the value shows up in production — not in a demo.',
				deliverables: ['Live screens', 'Indexation & errors loop', 'Story-first review']
			},
			{
				title: 'Support',
				description:
					'Grow the surface, keep the architectural discipline and adapt the library to new product branches.',
				deliverables: ['New families', 'Release stabilisation', 'Team consulting']
			}
		],
		audiences = [
			{
				title: 'For the CTO',
				description:
					'Lower cost of change, less dependency on individual people, and a transparent interface layer.'
			},
			{
				title: 'For the head of AI',
				description:
					'An environment where AI-assisted development is reproducible and verifiable instead of spontaneous.'
			},
			{
				title: 'For the team',
				description:
					'A library you can not only use but safely grow — without piling up architectural debt.'
			}
		],
		class: className = ''
	}: RecipeSamoAdoptionRoadmap = $props();
</script>

<section class={`c-samo-adoption-roadmap ${className}`}>
	<header class="sar-header">
		<p class="sar-eyebrow">{eyebrow}</p>
		<h2 class="sar-title">{title}</h2>
		<p class="sar-description">{description}</p>
	</header>

	<ol class="sar-road">
		{#each stages as stage, index (index)}
			<li class="sar-stage" style={`--sar-delay:${index * 0.12}s`}>
				<div class="sar-marker">
					<span class="sar-marker-dot">{index + 1}</span>
				</div>
				<div class="sar-card">
					<h3 class="sar-stage-title">{stage.title}</h3>
					<p class="sar-stage-desc">{stage.description}</p>
					<ul class="sar-deliverables">
						{#each stage.deliverables as deliverable, deliverableIndex (deliverableIndex)}
							<li>{deliverable}</li>
						{/each}
					</ul>
				</div>
			</li>
		{/each}
	</ol>

	<div class="sar-audiences">
		{#each audiences as audience, audienceIndex (audienceIndex)}
			<article class="sar-audience">
				<h3 class="sar-audience-title">{audience.title}</h3>
				<p class="sar-audience-desc">{audience.description}</p>
			</article>
		{/each}
	</div>
</section>

<style>
	.c-samo-adoption-roadmap {
		display: grid;
		gap: 2rem;
	}

	.sar-header {
		max-width: 52rem;
	}

	.sar-eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.sar-title {
		margin-top: 0.5rem;
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.05;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--color-text-primary);
	}

	.sar-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sar-road {
		position: relative;
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 960px) {
		.sar-road {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		/* The road connecting the four stage markers. */
		.sar-road::before {
			content: '';
			position: absolute;
			top: 1.25rem;
			left: 1.25rem;
			right: 1.25rem;
			height: 3px;
			border-radius: 3px;
			background: linear-gradient(90deg, #f59e0b, #ea580c, #dc2626, #7c3aed);
		}
	}

	.sar-stage {
		position: relative;
		display: grid;
		gap: 0.875rem;
		animation: sar-rise 0.5s ease-out both;
		animation-delay: var(--sar-delay);
	}

	@media (max-width: 959px) {
		.sar-stage {
			grid-template-columns: auto 1fr;
		}
	}

	@keyframes sar-rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	.sar-marker-dot {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 9999px;
		border: 3px solid var(--color-background-primary);
		background: linear-gradient(135deg, #ea580c, #dc2626);
		font-weight: 900;
		color: #fff;
		box-shadow: 0 10px 22px -12px rgba(220, 38, 38, 0.9);
	}

	.sar-card {
		height: 100%;
		border-radius: 24px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 93%, white 7%);
		padding: 1.375rem;
		transition:
			transform 0.2s,
			border-color 0.2s;
	}

	.sar-card:hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--color-warning-500) 50%, var(--color-border-primary));
	}

	.sar-stage-title {
		font-size: 1.375rem;
		font-weight: 900;
		color: var(--color-text-primary);
	}

	.sar-stage-desc {
		margin-top: 0.5rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.sar-deliverables {
		display: grid;
		gap: 0.375rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sar-deliverables li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.sar-deliverables li::before {
		content: '';
		flex: none;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background-color: var(--color-warning-500);
	}

	.sar-audiences {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	}

	.sar-audience {
		border-radius: 24px;
		background-color: #0b1020;
		background-image: radial-gradient(
			circle at top right,
			rgba(234, 88, 12, 0.35),
			transparent 55%
		);
		padding: 1.5rem;
		color: #f8fafc;
	}

	.sar-audience-title {
		font-size: 1.125rem;
		font-weight: 800;
		color: #fdba74;
	}

	.sar-audience-desc {
		margin-top: 0.5rem;
		line-height: 1.65;
		color: #cbd5e1;
	}

	@media (prefers-reduced-motion: reduce) {
		.sar-stage {
			animation: none;
		}

		.sar-card:hover {
			transform: none;
		}
	}
</style>
