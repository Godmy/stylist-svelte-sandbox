<script lang="ts">
	import type { RecipeSamoPractice } from '$stylist/domain/interface/recipe/samo-practice';

	let {
		eyebrow = 'In practice',
		title = 'Four questions before every new file',
		description = 'SAMO does not start with components. It starts with four answers — and once the coordinates are right, half of the architectural decisions are already made.',
		steps = [
			{
				title: 'Choose the domain',
				description:
					'Which subject area does the entity belong to? Create a new domain only if none of the existing ones fit.'
			},
			{
				title: 'Choose the cluster',
				description:
					'What language form is it: a constant, a type, an interface, a class, a function or a component?'
			},
			{
				title: 'Choose the joint',
				description:
					'Name the architectural role. If the name sounds like a business object, it is probably a family, not a joint.'
			},
			{
				title: 'Choose the family',
				description:
					'Refine the family with traits, create one entity in one file and check that it respects the assembly direction.'
			}
		],
		cases = [
			{
				title: 'A business name used as a joint',
				bad: 'marketing/function/hero-cta/',
				good: 'marketing/function/script/hero-cta/',
				reason:
					'“hero-cta” answers “which subject entity?” — so it is a family. The joint must name the role: script.'
			},
			{
				title: 'Two entities in one file',
				bad: 'theme/type/theme-and-utils.ts',
				good: 'theme/type/struct/theme/index.ts\ntheme/function/script/resolve-theme/index.ts',
				reason:
					'A type and a function are different language levels and different roles. One file = one entity.'
			},
			{
				title: 'A magic value inside a component',
				bad: '<div style="height: 48px">',
				good: 'layout/const/value/control-height/index.ts\n→ imported by the component',
				reason:
					'Values flow left to right through the pipeline: const is assembled before component, never inlined into it.'
			},
			{
				title: 'A monolithic props interface',
				bad: 'interface ButtonProps { /* 40 props */ }',
				good: 'RecipeButton = BehaviorClickable\n  + SlotText + SlotIcon + …',
				reason:
					'DSIAP: reuse atomic behaviors and slots from their own domains instead of redeclaring them per component.'
			}
		],
		closing = 'If you can explain an entity’s subject area, language form, logical role and place in the dependency pipeline just from its address, it was designed the SAMO way.',
		class: className = ''
	}: RecipeSamoPractice = $props();
</script>

<section class={`c-samo-practice ${className}`}>
	<header class="sp-header">
		<p class="sp-eyebrow">{eyebrow}</p>
		<h2 class="sp-title">{title}</h2>
		<p class="sp-description">{description}</p>
	</header>

	<ol class="sp-steps">
		{#each steps as step, index (index)}
			<li class="sp-step">
				<span class="sp-step-index">{index + 1}</span>
				<p class="sp-step-title">{step.title}</p>
				<p class="sp-step-desc">{step.description}</p>
			</li>
		{/each}
	</ol>

	<div class="sp-cases">
		{#each cases as practiceCase, practiceCaseIndex (practiceCaseIndex)}
			<article class="sp-case">
				<h3 class="sp-case-title">{practiceCase.title}</h3>
				<div class="sp-case-pair">
					<div class="sp-case-side sp-case-side--bad">
						<span class="sp-case-label">Bad</span>
						<pre><code>{practiceCase.bad}</code></pre>
					</div>
					<div class="sp-case-side sp-case-side--good">
						<span class="sp-case-label">Good</span>
						<pre><code>{practiceCase.good}</code></pre>
					</div>
				</div>
				<p class="sp-case-reason">{practiceCase.reason}</p>
			</article>
		{/each}
	</div>

	{#if closing}
		<p class="sp-closing">{closing}</p>
	{/if}
</section>

<style>
	.c-samo-practice {
		display: grid;
		gap: 2rem;
	}

	.sp-header {
		max-width: 56rem;
	}

	.sp-eyebrow {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.sp-title {
		margin-top: 0.75rem;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		line-height: 1.15;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
	}

	.sp-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sp-steps {
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	}

	.sp-step {
		position: relative;
		border-radius: 24px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 92%, white 8%);
		padding: 1.5rem;
	}

	.sp-step-index {
		display: block;
		font-size: 2.5rem;
		font-weight: 900;
		line-height: 1;
		background: linear-gradient(135deg, #f59e0b, #dc2626);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.sp-step-title {
		margin-top: 0.75rem;
		font-size: 1.125rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sp-step-desc {
		margin-top: 0.375rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.sp-cases {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 900px) {
		.sp-cases {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.sp-case {
		display: grid;
		gap: 0.875rem;
		border-radius: 24px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: 1.5rem;
	}

	.sp-case-title {
		font-size: 1.125rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sp-case-pair {
		display: grid;
		gap: 0.625rem;
	}

	.sp-case-side {
		--side: #dc2626;
		border-radius: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--side) 30%, transparent);
		background-color: color-mix(in srgb, var(--side) 6%, transparent);
		padding: 0.625rem 0.875rem;
	}

	.sp-case-side--good {
		--side: #059669;
	}

	.sp-case-label {
		font-size: 0.6875rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--side);
	}

	.sp-case-side pre {
		margin: 0.25rem 0 0;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.sp-case-side code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-text-primary);
	}

	.sp-case-reason {
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.sp-closing {
		border-radius: 24px;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--color-warning-500) 14%, transparent),
			color-mix(in srgb, var(--color-error-500, #ef4444) 10%, transparent)
		);
		padding: 1.5rem 1.75rem;
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.6;
		color: var(--color-text-primary);
	}
</style>
