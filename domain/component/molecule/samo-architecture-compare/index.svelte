<script lang="ts">
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeSamoArchitectureCompare } from '$stylist/domain/interface/recipe/samo-architecture-compare';

	let {
		eyebrow = 'Architecture & governance',
		title = 'Architecture as a control mechanism',
		description = 'AI agents are limited by their context window. Large files are the bottleneck: every extra read costs tokens and release time, and every unclear boundary invites the agent to improvise. SAMO keeps files microscopic and puts a governance loop around them.',
		tokenLoads = [
			{ label: 'One small file, read once', lines: '≤ 100 lines', load: 10 },
			{ label: 'A medium file, read in parts', lines: '~ 300 lines', load: 38 },
			{ label: 'A monolith, re-read again and again', lines: '> 1000 lines', load: 100 }
		],
		before = [
			'Files of 500–1000 lines that an agent cannot hold in memory at once.',
			'Logic, styles, types and API mixed in one place.',
			'Refactoring is scary: nobody knows what an edit will touch.',
			'Tangled dependencies and occasional cycles.',
			'Quality depends on what the team remembers.'
		],
		after = [
			'One file, one export — an agent reads it instantly.',
			'Components are assembled from recipes like LEGO.',
			'A clean one-way pipeline: data → … → component.',
			'Every path answers “what is it for?” and “what does it do?”.',
			'Rules live in AGENTS.md and are checked by CLIs.'
		],
		rules = [
			{
				title: 'Generated barrels',
				description:
					'index.ts barrels are produced by the indexation CLI from the tree. They are the source of truth for exports.',
				allowed: true
			},
			{
				title: 'No manual barrel edits',
				description: 'Hand-editing a barrel breaks the generator and creates duplicates.',
				allowed: false
			},
			{
				title: 'No re-exports',
				description:
					'Relay files and extra redirection layers blur domain boundaries. One import, one entry point.',
				allowed: false
			},
			{
				title: 'No multi-export files',
				description:
					'Two exported entities in one file is an SRP violation. Non-exported top-level declarations are forbidden too.',
				allowed: false
			},
			{
				title: 'One errors CLI',
				description:
					'A single command runs the TypeScript, Svelte and package-level analyzers and writes one aggregated report.',
				allowed: true
			},
			{
				title: 'Conflict report first',
				description:
					'If a task needs a structure outside domain/cluster/joint/family, the agent reports the conflict before writing code.',
				allowed: true
			},
			{
				title: 'New cluster only via ADR',
				description:
					'Clusters change through an architecture decision record; a new joint needs an architectural session.',
				allowed: true
			},
			{
				title: 'Edit in the owning module',
				description:
					'Code lives in modules/<module>/<domain>; Git runs in the repository that owns it. src/lib keeps generated entrypoints only.',
				allowed: true
			},
			{
				title: 'Reverse dependencies',
				description:
					'Importing against the assembly direction requires explicit approval from the owner.',
				allowed: false
			}
		],
		class: className = ''
	}: RecipeSamoArchitectureCompare = $props();
</script>

<section class={`c-samo-architecture-compare ${className}`}>
	<header class="sac-header">
		<p class="sac-eyebrow">{eyebrow}</p>
		<h2 class="sac-title">{title}</h2>
		<p class="sac-description">{description}</p>
	</header>

	<div class="sac-avalanche">
		<div class="sac-avalanche-copy">
			<h3 class="sac-subtitle">The token avalanche</h3>
			<p class="sac-text">
				Context cost grows faster than file size: a monolith is read, forgotten and read again.
				Small single-purpose files are read once.
			</p>
		</div>
		<ul class="sac-bars">
			{#each tokenLoads as tokenLoad, tokenLoadIndex (tokenLoadIndex)}
				<li class="sac-bar-row">
					<div class="sac-bar-meta">
						<span class="sac-bar-label">{tokenLoad.label}</span>
						<span class="sac-bar-lines">{tokenLoad.lines}</span>
					</div>
					<div class="sac-bar-track">
						<span
							class="sac-bar-fill"
							style={`width:${Math.max(4, Math.min(100, tokenLoad.load))}%`}
						></span>
					</div>
				</li>
			{/each}
		</ul>
	</div>

	<div class="sac-compare">
		<article class="sac-column sac-column--before">
			<h3 class="sac-column-title">Traditional approach</h3>
			<ul class="sac-list">
				{#each before as item, itemIndex (itemIndex)}
					<li>
						<BaseIcon name="x" size={16} class="sac-list-icon" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</article>
		<article class="sac-column sac-column--after">
			<h3 class="sac-column-title">SAMO architecture</h3>
			<ul class="sac-list">
				{#each after as item, itemIndex2 (itemIndex2)}
					<li>
						<BaseIcon name="check" size={16} class="sac-list-icon" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</article>
	</div>

	<div class="sac-governance">
		<h3 class="sac-subtitle">AGENTS.md — a constitution for agents</h3>
		<p class="sac-text">
			Rules are written for AI first. The agent proposes a change; the structure, the indexation CLI
			and the errors CLI validate it. AI stops being a source of entropy and becomes an accelerator
			of controlled delivery.
		</p>
		<ul class="sac-rules">
			{#each rules as rule, ruleIndex (ruleIndex)}
				<li class="sac-rule" class:is-denied={!rule.allowed}>
					<span class="sac-rule-mark" aria-hidden="true">{rule.allowed ? '✓' : '✕'}</span>
					<div>
						<p class="sac-rule-title">{rule.title}</p>
						<p class="sac-rule-desc">{rule.description}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.c-samo-architecture-compare {
		display: grid;
		gap: 2rem;
	}

	.sac-header {
		max-width: 56rem;
	}

	.sac-eyebrow {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.sac-title {
		margin-top: 0.75rem;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		line-height: 1.15;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
	}

	.sac-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sac-subtitle {
		font-size: 1.375rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sac-text {
		margin-top: 0.5rem;
		line-height: 1.65;
		color: var(--color-text-secondary);
	}

	.sac-avalanche,
	.sac-governance {
		display: grid;
		gap: 1.25rem;
		border-radius: 28px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	@media (min-width: 900px) {
		.sac-avalanche {
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
			align-items: center;
		}
	}

	.sac-bars {
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sac-bar-meta {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.sac-bar-label {
		color: var(--color-text-primary);
	}

	.sac-bar-lines {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.sac-bar-track {
		margin-top: 0.375rem;
		height: 0.75rem;
		overflow: hidden;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--color-text-primary) 8%, transparent);
	}

	.sac-bar-fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #f59e0b, #ea580c, #dc2626);
	}

	.sac-compare {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.sac-compare {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.sac-column {
		--sac-accent: #dc2626;
		border-radius: 24px;
		border: 1px solid color-mix(in srgb, var(--sac-accent) 30%, var(--color-border-primary));
		background-color: color-mix(in srgb, var(--sac-accent) 5%, var(--color-background-primary));
		padding: 1.5rem;
	}

	.sac-column--after {
		--sac-accent: #059669;
	}

	.sac-column-title {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--sac-accent);
	}

	.sac-list {
		display: grid;
		gap: 0.75rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sac-list li {
		display: flex;
		align-items: flex-start;
		gap: 0.625rem;
		line-height: 1.55;
		color: var(--color-text-primary);
	}

	.sac-list :global(.sac-list-icon) {
		flex: none;
		margin-top: 0.2rem;
		color: var(--sac-accent);
	}

	.sac-rules {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	}

	.sac-rule {
		--rule: #059669;
		display: flex;
		gap: 0.75rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--rule) 28%, var(--color-border-primary));
		padding: 1rem;
	}

	.sac-rule.is-denied {
		--rule: #dc2626;
	}

	.sac-rule-mark {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 0.5rem;
		background-color: color-mix(in srgb, var(--rule) 15%, transparent);
		font-weight: 900;
		color: var(--rule);
	}

	.sac-rule-title {
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sac-rule-desc {
		margin-top: 0.25rem;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--color-text-secondary);
	}
</style>
