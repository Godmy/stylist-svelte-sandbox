<script lang="ts">
	import type { RecipeSamoSolidGrid } from '$stylist/domain/interface/recipe/samo-solid-grid';

	let {
		eyebrow = 'Foundation',
		title = 'SOLID, enforced by the file system',
		description = 'In SAMO the five principles are not good intentions for code review. They are encoded into where a file may live and what it may export, so AI-generated code cannot quietly degrade.',
		principles = [
			{
				letter: 'S',
				title: 'Single Responsibility',
				description:
					'One file exports exactly one entity. A small file is cheap for an agent to read and has one reason to change.',
				example: 'theme/type/struct/theme/index.ts\ntheme/function/script/resolve-theme/index.ts'
			},
			{
				letter: 'O',
				title: 'Open / Closed',
				description:
					'A new capability is a new joint or family, not an edit of the core. The old button keeps working untouched.',
				example: '+ interface/slot/badge\n+ recipe gains SlotBadge'
			},
			{
				letter: 'L',
				title: 'Liskov Substitution',
				description:
					'Specialised components keep the base contract, so they can replace the base anywhere in the UI.',
				example: 'IconButton works wherever Button works'
			},
			{
				letter: 'I',
				title: 'Interface Segregation',
				description:
					'Contracts are split into minimal behaviors and slots. A component only takes the capabilities it actually needs.',
				example: 'BehaviorClickable · BehaviorFocusable · SlotIcon'
			},
			{
				letter: 'D',
				title: 'Dependency Inversion',
				description:
					'Components depend on recipes (interfaces), not on concrete implementations. AI generates the bones, people add the meat.',
				example: 'import type { RecipeButton } …'
			}
		],
		note = 'A self-analysis script walks the whole tree and checks every file against these rules — architecture control happens on every change, not once a quarter.',
		class: className = ''
	}: RecipeSamoSolidGrid = $props();
</script>

<section class={`c-samo-solid-grid ${className}`}>
	<header class="ssg-header">
		<p class="ssg-eyebrow">{eyebrow}</p>
		<h2 class="ssg-title">{title}</h2>
		<p class="ssg-description">{description}</p>
	</header>

	<ol class="ssg-grid">
		{#each principles as principle, principleIndex (principleIndex)}
			<li class="ssg-card">
				<span class="ssg-letter" aria-hidden="true">{principle.letter}</span>
				<h3 class="ssg-card-title">{principle.title}</h3>
				<p class="ssg-card-desc">{principle.description}</p>
				<pre class="ssg-example"><code>{principle.example}</code></pre>
			</li>
		{/each}
	</ol>

	{#if note}
		<p class="ssg-note">{note}</p>
	{/if}
</section>

<style>
	.c-samo-solid-grid {
		display: grid;
		gap: 2rem;
	}

	.ssg-header {
		max-width: 56rem;
	}

	.ssg-eyebrow {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.ssg-title {
		margin-top: 0.75rem;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		line-height: 1.15;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
	}

	.ssg-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.ssg-grid {
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
	}

	.ssg-card {
		display: flex;
		flex-direction: column;
		border-radius: 24px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 92%, white 8%);
		padding: 1.5rem;
		transition:
			transform 0.2s,
			border-color 0.2s;
	}

	.ssg-card:hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--color-warning-500) 50%, var(--color-border-primary));
	}

	.ssg-letter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 0.875rem;
		background: linear-gradient(135deg, #ea580c, #dc2626);
		font-size: 1.375rem;
		font-weight: 900;
		color: #fff;
	}

	.ssg-card-title {
		margin-top: 1rem;
		font-size: 1.125rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.ssg-card-desc {
		margin-top: 0.5rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.ssg-example {
		margin: auto 0 0;
		padding-top: 1rem;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.ssg-example code {
		display: block;
		border-radius: 0.75rem;
		background-color: color-mix(in srgb, var(--color-text-primary) 6%, transparent);
		padding: 0.625rem 0.75rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-text-primary);
	}

	.ssg-note {
		border-radius: 1rem;
		border: 1px dashed color-mix(in srgb, var(--color-warning-500) 50%, var(--color-border-primary));
		padding: 1rem 1.25rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	@media (prefers-reduced-motion: reduce) {
		.ssg-card:hover {
			transform: none;
		}
	}
</style>
