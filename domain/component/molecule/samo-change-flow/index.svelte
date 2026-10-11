<script lang="ts">
	import type { RecipeSamoChangeFlow } from '$stylist/domain/interface/recipe/samo-change-flow';

	let {
		eyebrow = 'Chapter 01',
		title = 'The life of a change',
		description = 'Every change — written by a person or by an agent — travels the same route. The route is short, every step has an owner, and nothing reaches the package without passing the generators and the checks.',
		steps = [
			{
				title: 'Formulate the task',
				actor: 'Human',
				description:
					'The change is described in business words. No file names yet — just what the product needs.',
				command: '# "Buttons need a notification counter"',
				result: 'A task that an agent can address without guessing.'
			},
			{
				title: 'Find the address',
				actor: 'Agent',
				description:
					'The agent answers four questions: domain, cluster, joint, family. modules.json then tells which module owns the domain — that is where the file goes.',
				command:
					'domain=layout  cluster=interface  joint=slot  family=badge\nowner (modules.json) = design-system',
				result: 'One predictable path: modules/design-system/layout/interface/slot/badge/'
			},
			{
				title: 'Check for conflicts',
				actor: 'Agent',
				description:
					'If the task does not fit domain/cluster/joint/family, the agent reports the conflict and proposes a solution before writing code.',
				command: '# fits the model → continue\n# does not fit → report, then propose',
				result: 'No silent exceptions to the architecture.'
			},
			{
				title: 'Write one entity',
				actor: 'Agent',
				description:
					'One file, one export, no hidden top-level helpers. The dependency must respect the assembly direction.',
				command:
					'+ modules/design-system/layout/interface/slot/badge/index.ts\n\nexport interface SlotBadge {\n\tbadge?: string | number;\n\tcount?: number;\n\tdot?: boolean;\n\tshowBadge?: boolean;\n}',
				result: 'A file small enough to be read in a single pass.'
			},
			{
				title: 'Regenerate barrels',
				actor: 'CLI',
				description:
					'The indexation CLI rebuilds every generated index.ts from the tree. Barrels are never edited by hand.',
				command: 'python -u ".../stylist/indexation/cli.py"',
				result: 'Exports always match the file tree.'
			},
			{
				title: 'Run the checks',
				actor: 'CLI',
				description:
					'One errors CLI runs the TypeScript and Svelte analyzers in sequence and writes a single aggregated report.',
				command: 'node ".../stylist-svelte-tools/scripts/errors.mjs"',
				result: 'errors/output/<timestamp>/README.md — one list of files with errors.'
			},
			{
				title: 'Refresh the sandbox',
				actor: 'CLI',
				description:
					'The auditor regenerates the sandbox manifest so new components and stories appear in the workspace.',
				command: 'python -u ".../stylist/auditor/cli.py" --manifest-only',
				result: 'The story sits next to its source, ready for review.'
			},
			{
				title: 'Commit in the owner',
				actor: 'Human',
				description:
					'Git runs where the code lives: first in the nested repository, then in the module that records it, then in the umbrella.',
				command: 'layout → design-system → stylist-svelte',
				result: 'Every repository keeps its own history; the umbrella pins exact revisions.'
			},
			{
				title: 'Review and release',
				actor: 'Human',
				description:
					'Review starts from the story, with the source, markdown and JSON structure next to it. The package ships runtime and types only.',
				command: 'yarn build',
				result: 'A public package without demo, story or test noise.'
			}
		],
		note = 'Why do people, not agents, run the CLIs? They scan and rewrite the whole tree. Several agents running them in parallel would race each other’s edits — so agents finish the code and hand over.',
		class: className = ''
	}: RecipeSamoChangeFlow = $props();

	let activeIndex = $state(0);
	let playing = $state(false);

	const activeStep = $derived(steps[activeIndex] ?? steps[0]);

	$effect(() => {
		if (!playing) return;
		const timer = setInterval(() => {
			if (activeIndex >= steps.length - 1) {
				playing = false;
				return;
			}
			activeIndex += 1;
		}, 1800);
		return () => clearInterval(timer);
	});

	function togglePlay() {
		if (!playing && activeIndex >= steps.length - 1) activeIndex = 0;
		playing = !playing;
	}

	function selectStep(index: number) {
		playing = false;
		activeIndex = index;
	}
</script>

<section class={`c-samo-change-flow ${className}`}>
	<header class="scf-header">
		<div>
			<p class="scf-eyebrow">{eyebrow}</p>
			<h2 class="scf-title">{title}</h2>
			<p class="scf-description">{description}</p>
		</div>
		<button type="button" class="scf-play" class:is-playing={playing} onclick={togglePlay}>
			<span class="scf-play-icon" aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
			{playing ? 'Pause' : 'Play the route'}
		</button>
	</header>

	<div class="scf-body">
		<ol class="scf-timeline">
			{#each steps as step, index}
				<li class="scf-item">
					<button
						type="button"
						class="scf-step"
						class:is-active={index === activeIndex}
						class:is-done={index < activeIndex}
						aria-current={index === activeIndex ? 'step' : undefined}
						data-actor={step.actor.toLowerCase()}
						onclick={() => selectStep(index)}
					>
						<span class="scf-dot">{index + 1}</span>
						<span class="scf-step-title">{step.title}</span>
						<span class="scf-actor">{step.actor}</span>
					</button>
				</li>
			{/each}
		</ol>

		{#if activeStep}
			<article class="scf-panel" data-actor={activeStep.actor.toLowerCase()}>
				<div class="scf-panel-head">
					<span class="scf-panel-actor">{activeStep.actor}</span>
					<span class="scf-panel-count">{activeIndex + 1} / {steps.length}</span>
				</div>
				<h3 class="scf-panel-title">{activeStep.title}</h3>
				<p class="scf-panel-desc">{activeStep.description}</p>
				<pre class="scf-command"><code>{activeStep.command}</code></pre>
				<p class="scf-result">
					<span class="scf-result-arrow" aria-hidden="true">→</span>
					{activeStep.result}
				</p>
				<div class="scf-progress" aria-hidden="true">
					<span style={`width:${((activeIndex + 1) / Math.max(1, steps.length)) * 100}%`}></span>
				</div>
			</article>
		{/if}
	</div>

	{#if note}
		<p class="scf-note">{note}</p>
	{/if}
</section>

<style>
	.c-samo-change-flow {
		--scf-human: #0284c7;
		--scf-agent: #7c3aed;
		--scf-cli: #059669;
		display: grid;
		gap: 2rem;
	}

	[data-actor='human'] {
		--scf-actor: var(--scf-human);
	}
	[data-actor='agent'] {
		--scf-actor: var(--scf-agent);
	}
	[data-actor='cli'] {
		--scf-actor: var(--scf-cli);
	}

	.scf-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.scf-header > div {
		max-width: 52rem;
	}

	.scf-eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.scf-title {
		margin-top: 0.5rem;
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.05;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--color-text-primary);
	}

	.scf-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.scf-play {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		border: none;
		border-radius: 9999px;
		background: linear-gradient(135deg, #ea580c, #dc2626);
		padding: 0.875rem 1.375rem;
		font: inherit;
		font-weight: 800;
		color: #fff;
		cursor: pointer;
		box-shadow: 0 16px 32px -16px rgba(234, 88, 12, 0.8);
		transition: transform 0.2s;
	}

	.scf-play:hover {
		transform: translateY(-2px);
	}

	.scf-play-icon {
		font-size: 0.75rem;
	}

	.scf-body {
		display: grid;
		gap: 1.5rem;
	}

	@media (min-width: 960px) {
		.scf-body {
			grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
			align-items: start;
		}
	}

	.scf-timeline {
		position: relative;
		display: grid;
		gap: 0.375rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The rail behind the numbered dots. */
	.scf-timeline::before {
		content: '';
		position: absolute;
		top: 1.25rem;
		bottom: 1.25rem;
		left: 1.4rem;
		width: 2px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-warning-500) 60%, transparent),
			color-mix(in srgb, var(--color-border-primary) 80%, transparent)
		);
	}

	.scf-step {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.875rem;
		width: 100%;
		border: 1px solid transparent;
		border-radius: 1rem;
		background: transparent;
		padding: 0.5rem 0.75rem 0.5rem 0.5rem;
		font: inherit;
		text-align: left;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s;
	}

	.scf-step:hover {
		background-color: color-mix(in srgb, var(--scf-actor) 6%, transparent);
	}

	.scf-step.is-active {
		border-color: color-mix(in srgb, var(--scf-actor) 40%, var(--color-border-primary));
		background-color: color-mix(in srgb, var(--scf-actor) 10%, var(--color-background-primary));
		color: var(--color-text-primary);
	}

	.scf-dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.85rem;
		height: 1.85rem;
		border-radius: 9999px;
		border: 2px solid color-mix(in srgb, var(--scf-actor) 55%, var(--color-border-primary));
		background-color: var(--color-background-primary);
		font-size: 0.8125rem;
		font-weight: 800;
		color: var(--scf-actor);
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.scf-step.is-done .scf-dot,
	.scf-step.is-active .scf-dot {
		background-color: var(--scf-actor);
		color: #fff;
	}

	.scf-step-title {
		font-weight: 700;
	}

	.scf-actor {
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--scf-actor) 12%, transparent);
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--scf-actor);
	}

	.scf-panel {
		position: relative;
		overflow: hidden;
		display: grid;
		gap: 1rem;
		border-radius: 28px;
		background-color: #0b1020;
		padding: clamp(1.25rem, 3vw, 2rem);
		color: #e2e8f0;
		box-shadow: 0 30px 60px -36px color-mix(in srgb, var(--scf-actor) 80%, transparent);
	}

	@media (min-width: 960px) {
		.scf-panel {
			position: sticky;
			top: 1.5rem;
		}
	}

	.scf-panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.scf-panel-actor {
		border-radius: 9999px;
		background-color: var(--scf-actor);
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #fff;
	}

	.scf-panel-count {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: #64748b;
	}

	.scf-panel-title {
		font-size: 1.75rem;
		font-weight: 900;
		letter-spacing: -0.02em;
		color: #f8fafc;
	}

	.scf-panel-desc {
		line-height: 1.7;
		color: #cbd5e1;
	}

	.scf-command {
		margin: 0;
		overflow-x: auto;
		border-radius: 1rem;
		border: 1px solid rgba(148, 163, 184, 0.18);
		background-color: rgba(2, 6, 23, 0.7);
		padding: 1rem 1.125rem;
		tab-size: 2;
	}

	.scf-command code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.875rem;
		line-height: 1.7;
		color: #fde68a;
	}

	.scf-result {
		display: flex;
		gap: 0.625rem;
		line-height: 1.6;
		color: #f8fafc;
	}

	.scf-result-arrow {
		color: #fb923c;
		font-weight: 900;
	}

	.scf-progress {
		height: 4px;
		overflow: hidden;
		border-radius: 9999px;
		background-color: rgba(148, 163, 184, 0.18);
	}

	.scf-progress span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #f59e0b, #ea580c, #dc2626);
		transition: width 0.4s ease;
	}

	.scf-note {
		border-radius: 1.25rem;
		border: 1px dashed color-mix(in srgb, var(--color-warning-500) 50%, var(--color-border-primary));
		padding: 1rem 1.25rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	@media (prefers-reduced-motion: reduce) {
		.scf-play:hover {
			transform: none;
		}

		.scf-progress span {
			transition: none;
		}
	}
</style>
