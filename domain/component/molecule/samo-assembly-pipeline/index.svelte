<script lang="ts">
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeSamoAssemblyPipeline } from '$stylist/domain/interface/recipe/samo-assembly-pipeline';

	let {
		eyebrow = 'Architecture',
		title = 'One direction of assembly',
		description = 'Seven clusters cover every construct of TypeScript and Svelte. Dependencies always flow from simpler to more complex: a level may import only from the levels to its left. Cycles and reverse imports are impossible by construction.',
		clusters = [
			{
				name: 'data',
				icon: 'data',
				accent: '#64748b',
				rule: 'Supporting assets only — no executable code.',
				joints: ['json', 'jsonl', 'md', 'icon', 'flag', 'png', 'shader', 'yaml'],
				example: 'svg/data/icon/heart/index.svg\ndomain/data/md/readme.md'
			},
			{
				name: 'const',
				icon: 'const',
				accent: '#d97706',
				rule: 'Only `export const`. Values that never change at runtime.',
				joints: ['value', 'map', 'record', 'preset', 'array', 'object'],
				example:
					"export const DOMAIN_SCREEN = {\n\tLANDING: 'landing',\n\tDOMAIN: 'domain',\n\tHOW_IT_WORKS: 'how-it-works'\n} as const;"
			},
			{
				name: 'type',
				icon: 'type',
				accent: '#0284c7',
				rule: 'Only `export type`. Aliases, structures and type-level computations.',
				joints: ['alias', 'record', 'struct', 'preset', 'object', 'compute'],
				example:
					'export type ComputeIntersectAll<T extends readonly unknown[]> =\n\tT extends readonly [infer H, ...infer R]\n\t\t? H & ComputeIntersectAll<R>\n\t\t: {};'
			},
			{
				name: 'interface',
				icon: 'interface',
				accent: '#7c3aed',
				rule: 'Only `export interface`. Contracts assembled by the DSIAP pattern.',
				joints: ['behavior', 'slot', 'recipe', 'contract'],
				example:
					'export interface BehaviorThemeMode {\n\tonThemeModeChange?: (theme: TokenThemeMode) => void;\n}'
			},
			{
				name: 'class',
				icon: 'class',
				accent: '#db2777',
				rule: 'Only `export class`. Stateful managers and factories.',
				joints: ['manager'],
				example: 'theme/class/manager/theme-resolver\ntheme/class/manager/theme-mode-toggle'
			},
			{
				name: 'function',
				icon: 'function',
				accent: '#059669',
				rule: 'Only `export function`. The role of the function is its joint.',
				joints: [
					'script',
					'state',
					'hook',
					'transform',
					'resolve',
					'count',
					'check',
					'create',
					'merge',
					'serialize',
					'async',
					'test'
				],
				example:
					'export function countDomainStories(tree: TypeDomainTreeInput): number {\n\t/* … */\n}'
			},
			{
				name: 'component',
				icon: 'component',
				accent: '#ea580c',
				rule: 'Svelte components plus their stories. Atomic Design lives here.',
				joints: ['atom', 'molecule', 'organism', 'template', 'page'],
				example: 'component/molecule/cta-buttons/\n\tindex.svelte\n\tindex.story.svelte\n\tindex.ts'
			}
		],
		note = 'The cluster tells you the language form of a file before you open it. If a component needs a new number, it goes to const — never inlined as a magic value inside the component.',
		class: className = ''
	}: RecipeSamoAssemblyPipeline = $props();

	let activeIndex = $state(3);

	const activeCluster = $derived(clusters[activeIndex] ?? clusters[0]);
	const allowedSources = $derived(clusters.slice(0, activeIndex).map((cluster) => cluster.name));
</script>

<section class={`c-samo-assembly-pipeline ${className}`}>
	<header class="sap-header">
		<p class="sap-eyebrow">{eyebrow}</p>
		<h2 class="sap-title">{title}</h2>
		<p class="sap-description">{description}</p>
	</header>

	<ol class="sap-track" aria-label="Assembly direction">
		{#each clusters as cluster, index}
			<li class="sap-step" style={`--sap-accent:${cluster.accent}`}>
				<button
					type="button"
					class="sap-node"
					class:is-active={index === activeIndex}
					class:is-source={index < activeIndex}
					class:is-blocked={index > activeIndex}
					aria-pressed={index === activeIndex}
					onclick={() => (activeIndex = index)}
				>
					<span class="sap-node-icon" aria-hidden="true">
						<BaseIcon name={cluster.icon} size={22} />
					</span>
					<span class="sap-node-name">{cluster.name}</span>
				</button>
				{#if index < clusters.length - 1}
					<span class="sap-arrow" aria-hidden="true">→</span>
				{/if}
			</li>
		{/each}
	</ol>

	{#if activeCluster}
		<div class="sap-detail" style={`--sap-accent:${activeCluster.accent}`}>
			<div class="sap-detail-copy">
				<h3 class="sap-detail-title">
					<code>{activeCluster.name}/</code>
				</h3>
				<p class="sap-detail-rule">{activeCluster.rule}</p>

				<p class="sap-detail-label">Allowed joints</p>
				<ul class="sap-joints">
					{#each activeCluster.joints as joint}
						<li class="sap-joint">{joint}</li>
					{/each}
				</ul>

				<p class="sap-detail-label">May depend on</p>
				<p class="sap-sources">
					{#if allowedSources.length > 0}
						{allowedSources.join(' · ')}
					{:else}
						nothing — the foundation of the pipeline
					{/if}
				</p>
			</div>

			<pre class="sap-code"><code>{activeCluster.example}</code></pre>
		</div>
	{/if}

	{#if note}
		<p class="sap-note">{note}</p>
	{/if}
</section>

<style>
	.c-samo-assembly-pipeline {
		display: grid;
		gap: 2rem;
	}

	.sap-header {
		max-width: 56rem;
	}

	.sap-eyebrow {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.sap-title {
		margin-top: 0.75rem;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		line-height: 1.15;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
	}

	.sap-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sap-track {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sap-step {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.sap-node {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--sap-accent) 35%, var(--color-border-primary));
		background-color: color-mix(in srgb, var(--sap-accent) 8%, var(--color-background-primary));
		padding: 0.625rem 0.875rem;
		font: inherit;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			transform 0.2s,
			opacity 0.2s,
			background-color 0.2s,
			box-shadow 0.2s;
	}

	.sap-node:hover {
		transform: translateY(-2px);
	}

	.sap-node.is-active {
		border-color: var(--sap-accent);
		background-color: var(--sap-accent);
		color: #fff;
		box-shadow: 0 12px 28px -14px var(--sap-accent);
	}

	.sap-node.is-source {
		border-color: var(--sap-accent);
	}

	.sap-node.is-blocked {
		opacity: 0.45;
	}

	.sap-node-icon {
		display: inline-flex;
		color: var(--sap-accent);
	}

	.sap-node.is-active .sap-node-icon {
		color: #fff;
	}

	.sap-node-name {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 700;
	}

	.sap-arrow {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-secondary);
	}

	.sap-detail {
		display: grid;
		gap: 1.5rem;
		border-radius: 28px;
		border: 1px solid color-mix(in srgb, var(--sap-accent) 30%, var(--color-border-primary));
		background:
			radial-gradient(
				circle at top left,
				color-mix(in srgb, var(--sap-accent) 12%, transparent),
				transparent 50%
			),
			color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	@media (min-width: 900px) {
		.sap-detail {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
			align-items: start;
		}
	}

	.sap-detail-title code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--sap-accent);
	}

	.sap-detail-rule {
		margin-top: 0.5rem;
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--color-text-primary);
	}

	.sap-detail-label {
		margin-top: 1.25rem;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.sap-joints {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sap-joint {
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--sap-accent) 14%, transparent);
		padding: 0.25rem 0.625rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-primary);
	}

	.sap-sources {
		margin-top: 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		color: var(--color-text-primary);
	}

	.sap-code {
		margin: 0;
		overflow-x: auto;
		border-radius: 1rem;
		background-color: #0f172a;
		padding: 1.25rem;
		tab-size: 2;
	}

	.sap-code code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.875rem;
		line-height: 1.7;
		color: #e2e8f0;
	}

	.sap-note {
		border-radius: 1rem;
		border: 1px dashed color-mix(in srgb, var(--color-warning-500) 50%, var(--color-border-primary));
		padding: 1rem 1.25rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	@media (prefers-reduced-motion: reduce) {
		.sap-node:hover {
			transform: none;
		}
	}
</style>
