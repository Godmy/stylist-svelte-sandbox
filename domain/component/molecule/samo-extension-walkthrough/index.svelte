<script lang="ts">
	import type { RecipeSamoExtensionWalkthrough } from '$stylist/domain/interface/recipe/samo-extension-walkthrough';
	import createSamoExtensionWalkthroughComponentState from '$stylist/domain/component/molecule/samo-extension-walkthrough/state.svelte';

	let {
		eyebrow = 'Chapter 02',
		title = 'Extending without breaking',
		description = 'Open/Closed is easy to state and hard to keep. In SAMO a new capability arrives as a new file and a one-line composition — the core of every existing component stays closed. Walk through a real extension from this repository.',
		task = 'Give buttons a notification counter',
		steps = [
			{
				title: 'Add one atomic slot',
				description:
					'The counter is a content surface, so it becomes a slot — in the layout domain, where every badge-like surface lives.',
				path: 'layout/interface/slot/badge/index.ts',
				status: 'added',
				code: '+ /** Badge slot for count, dot, or short status marker content. */\n+ export interface SlotBadge {\n+ \tbadge?: string | number;\n+ \tcount?: number;\n+ \tdot?: boolean;\n+ \tshowBadge?: boolean;\n+ }'
			},
			{
				title: 'Compose it into the recipe',
				description:
					'The button recipe gains one line. Existing props are not edited, renamed or re-declared — the contract only grows.',
				path: 'button/interface/recipe/button-composed/index.ts',
				status: 'changed',
				code: '  export interface RecipeButtonComposed\n  \textends ComputeIntersectAll<[\n  \t\tSlotText,\n  \t\tSlotIcon,\n+ \t\tSlotBadge,\n  \t\tBehaviorClickable,\n  \t\tBehaviorFocusable,\n  \t\t…\n  \t]> {}'
			},
			{
				title: 'Render the surface',
				description:
					'The component adds a conditional block for the new surface. Click, focus, size and theme logic are not touched.',
				path: 'button/component/atom/button-composed/index.svelte',
				status: 'changed',
				code: '  {#if props.iconLeft} … {/if}\n+ {#if state.badgeText}\n+ \t<span class="c-button-composed__badge">{state.badgeText}</span>\n+ {/if}'
			},
			{
				title: 'Everything else stays closed',
				description:
					'Behaviors and slots from other domains are reused as they are. Nothing in theme, typography or the click behavior changes.',
				path: 'layout/interface/behavior/clickable · typography/interface/slot/text · theme/…',
				status: 'untouched',
				code: '= BehaviorClickable   unchanged\n= BehaviorFocusable   unchanged\n= SlotText            unchanged\n= SlotTheme           unchanged'
			},
			{
				title: 'Reuse pays off',
				description:
					'The same slot is now composed into 18 recipes across five modules. None of them re-declares badge props, and a change to SlotBadge reaches all of them at once.',
				path: '18 recipes · interaction · information · global · customer · sandbox',
				status: 'untouched',
				code: 'button · button-composed · follow-button · slider\nbase-card · product-card · comparison-card · wishlist-button\nalert-card · article-card · card-with-image · metric-card\ndata-display-card · expandable-card · post-card\navatar · avatar-group · atomic-principles'
			}
		],
		class: className = ''
	}: RecipeSamoExtensionWalkthrough = $props();

	const state = createSamoExtensionWalkthroughComponentState(() => ({ steps: steps }));
</script>

<section class={`c-samo-extension-walkthrough ${className}`}>
	<header class="sew-header">
		<p class="sew-eyebrow">{eyebrow}</p>
		<h2 class="sew-title">{title}</h2>
		<p class="sew-description">{description}</p>
	</header>

	<div class="sew-board">
		<aside class="sew-side">
			<div class="sew-task">
				<span class="sew-task-label">Task</span>
				<p class="sew-task-text">{task}</p>
			</div>

			<ol class="sew-files">
				{#each steps as step, index (index)}
					<li>
						<button
							type="button"
							class={`sew-file sew-file--${step.status}`}
							class:is-active={index === state.activeIndex}
							aria-pressed={index === state.activeIndex}
							onclick={() => (state.activeIndex = index)}
						>
							<span class="sew-file-mark" aria-hidden="true">{state.statusMark[step.status]}</span>
							<span class="sew-file-copy">
								<span class="sew-file-title">{step.title}</span>
								<span class="sew-file-path">{step.path}</span>
							</span>
						</button>
					</li>
				{/each}
			</ol>

			<ul class="sew-legend" aria-label="Legend">
				<li class="sew-file--added"><span>+</span> added</li>
				<li class="sew-file--changed"><span>~</span> extended</li>
				<li class="sew-file--untouched"><span>=</span> untouched</li>
			</ul>
		</aside>

		{#if state.activeStep}
			<article class={`sew-panel sew-file--${state.activeStep.status}`}>
				<div class="sew-panel-head">
					<span class="sew-panel-step">Step {state.activeIndex + 1} of {steps.length}</span>
					<span class="sew-panel-status">{state.activeStep.status}</span>
				</div>
				<h3 class="sew-panel-title">{state.activeStep.title}</h3>
				<p class="sew-panel-desc">{state.activeStep.description}</p>

				<div class="sew-code">
					<div class="sew-code-bar">
						<code>{state.activeStep.path}</code>
					</div>
					<pre><code
							>{#each state.activeStep.code.split('\n') as line, lineIndex (lineIndex)}<span
									class="sew-code-line"
									class:is-add={line.startsWith('+')}
									class:is-same={line.startsWith('=')}>{line}</span
								>{/each}</code
						></pre>
				</div>

				<div class="sew-nav">
					<button
						type="button"
						class="sew-nav-button"
						disabled={state.activeIndex === 0}
						onclick={() => (state.activeIndex = Math.max(0, state.activeIndex - 1))}
					>
						← Previous
					</button>
					<button
						type="button"
						class="sew-nav-button sew-nav-button--primary"
						disabled={state.activeIndex >= steps.length - 1}
						onclick={() => (state.activeIndex = Math.min(steps.length - 1, state.activeIndex + 1))}
					>
						Next →
					</button>
				</div>
			</article>
		{/if}
	</div>
</section>

<style>
	.c-samo-extension-walkthrough {
		display: grid;
		gap: 2rem;
	}

	.sew-file--added {
		--sew-tone: #16a34a;
	}
	.sew-file--changed {
		--sew-tone: #d97706;
	}
	.sew-file--untouched {
		--sew-tone: #64748b;
	}

	.sew-header {
		max-width: 52rem;
	}

	.sew-eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.sew-title {
		margin-top: 0.5rem;
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.05;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--color-text-primary);
	}

	.sew-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sew-board {
		display: grid;
		gap: 1.5rem;
	}

	@media (min-width: 960px) {
		.sew-board {
			grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
			align-items: start;
		}
	}

	.sew-side {
		display: grid;
		gap: 1rem;
	}

	.sew-task {
		border-radius: 1.25rem;
		background: linear-gradient(135deg, #ea580c, #dc2626);
		padding: 1.125rem 1.25rem;
		color: #fff;
		box-shadow: 0 18px 36px -22px rgba(220, 38, 38, 0.9);
	}

	.sew-task-label {
		font-size: 0.6875rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.85;
	}

	.sew-task-text {
		margin-top: 0.25rem;
		font-size: 1.25rem;
		font-weight: 800;
		line-height: 1.3;
	}

	.sew-files {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sew-file {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		width: 100%;
		border-radius: 1rem;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: 0.75rem 0.875rem;
		font: inherit;
		text-align: left;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background-color 0.2s,
			transform 0.2s;
	}

	.sew-file:hover {
		transform: translateX(3px);
	}

	.sew-file.is-active {
		border-color: var(--sew-tone);
		background-color: color-mix(in srgb, var(--sew-tone) 10%, var(--color-background-primary));
	}

	.sew-file-mark {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 0.5rem;
		background-color: color-mix(in srgb, var(--sew-tone) 16%, transparent);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 900;
		color: var(--sew-tone);
	}

	.sew-file-copy {
		display: grid;
		gap: 0.125rem;
		min-width: 0;
	}

	.sew-file-title {
		font-weight: 800;
	}

	.sew-file-path {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		word-break: break-word;
		color: var(--color-text-secondary);
	}

	.sew-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin: 0;
		padding: 0 0.25rem;
		list-style: none;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
	}

	.sew-legend span {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 900;
		color: var(--sew-tone);
	}

	.sew-panel {
		display: grid;
		gap: 1rem;
		border-radius: 28px;
		border: 1px solid color-mix(in srgb, var(--sew-tone) 30%, var(--color-border-primary));
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--sew-tone) 12%, transparent),
				transparent 45%
			),
			color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.sew-panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.sew-panel-step {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
	}

	.sew-panel-status {
		border-radius: 9999px;
		background-color: var(--sew-tone);
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #fff;
	}

	.sew-panel-title {
		font-size: 1.75rem;
		font-weight: 900;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
	}

	.sew-panel-desc {
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sew-code {
		overflow: hidden;
		border-radius: 1rem;
		background-color: #0b1020;
	}

	.sew-code-bar {
		border-bottom: 1px solid rgba(148, 163, 184, 0.16);
		padding: 0.625rem 1rem;
	}

	.sew-code-bar code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		word-break: break-word;
		color: #94a3b8;
	}

	.sew-code pre {
		margin: 0;
		overflow-x: auto;
		padding: 1rem 0;
		tab-size: 2;
	}

	.sew-code-line {
		display: block;
		padding: 0 1rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.875rem;
		line-height: 1.75;
		white-space: pre;
		color: #cbd5e1;
	}

	.sew-code-line.is-add {
		background-color: rgba(34, 197, 94, 0.14);
		color: #86efac;
	}

	.sew-code-line.is-same {
		color: #94a3b8;
	}

	.sew-nav {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.sew-nav-button {
		border-radius: 9999px;
		border: 1px solid var(--color-border-primary);
		background: transparent;
		padding: 0.625rem 1.125rem;
		font: inherit;
		font-weight: 700;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			opacity 0.2s,
			background-color 0.2s;
	}

	.sew-nav-button--primary {
		border-color: transparent;
		background: linear-gradient(135deg, #ea580c, #dc2626);
		color: #fff;
	}

	.sew-nav-button:disabled {
		opacity: 0.4;
		cursor: default;
	}

	@media (prefers-reduced-motion: reduce) {
		.sew-file:hover {
			transform: none;
		}
	}
</style>
