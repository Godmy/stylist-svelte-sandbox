<script lang="ts">
	import type { RecipeSamoPlatformStack } from '$stylist/domain/interface/recipe/samo-platform-stack';

	let {
		eyebrow = 'Chapter 05',
		title = 'The platform',
		description = 'Stylist is not a folder of widgets. It is four layers that each answer one question — what runs, how it looks, who owns which code, and what keeps all of it honest.',
		layers = [
			{
				name: 'Governance',
				description:
					'AGENTS.md turns the architecture into operating rules. Generators and checks run over the whole tree, so the structure and the exports never drift apart.',
				examples: ['AGENTS.md', 'indexation CLI', 'errors CLI', 'auditor manifest', 'ADR']
			},
			{
				name: 'Domain modules',
				description:
					'Code is owned by modules — separate Git repositories declared in modules.json. Each module owns its domains; the domain/cluster/joint/family model applies inside every one.',
				examples: ['modules.json', 'git submodules', 'logical $stylist/* aliases']
			},
			{
				name: 'Theme layer',
				description:
					'ThemeProvider publishes the theme through Svelte context and applies CSS variables. Colour, typography, spacing and states are one system, not one-off edits.',
				examples: ['ThemeProvider', '--color-* tokens', 'light / dark mode', 'theme managers']
			},
			{
				name: 'Svelte 5 runtime',
				description:
					'Runes, snippets and typed props. Every component takes a recipe interface, and stories sit next to the source as part of the engineering discipline.',
				examples: ['$state · $derived · $props', 'snippets', 'Recipe* props', 'index.story.svelte']
			}
		],
		modules = [
			{
				name: 'design-system',
				description: 'The foundation every other module builds on.',
				examples: ['theme', 'typography', 'layout', 'localization', 'svg']
			},
			{
				name: 'interaction',
				description: 'Everything a user acts on.',
				examples: [
					'button',
					'control',
					'input',
					'form',
					'menu',
					'navigation',
					'dialog',
					'calendar',
					'file',
					'search',
					'animation'
				]
			},
			{
				name: 'information',
				description: 'Everything a user reads, watches or listens to.',
				examples: ['list', 'tree', 'table', 'chart', 'image', 'audio', 'video', 'notification']
			},
			{
				name: 'architecture',
				description: 'Diagrams, canvases and modelling surfaces.',
				examples: ['graph', 'erd', 'idef-zero', 'workspace', 'canvas', 'webgl']
			},
			{
				name: 'sandbox',
				description: 'The workspace you are looking at right now.',
				examples: ['domain', 'token', 'development']
			}
		],
		shipped = [
			'Svelte 5 runtime components',
			'TypeScript typings for every recipe',
			'ThemeProvider and design tokens',
			'Internal implementations that public components depend on'
		],
		excluded = [
			'Stories, demos and tests',
			'JSON metadata and sandbox manifests',
			'The sandbox server',
			'Private modules: travel, geo, wbd and other business code',
			'The full workspace entrypoint index.full.ts'
		],
		class: className = ''
	}: RecipeSamoPlatformStack = $props();

	let activeLayer = $state(0);
</script>

<section class={`c-samo-platform-stack ${className}`}>
	<header class="sps-header">
		<p class="sps-eyebrow">{eyebrow}</p>
		<h2 class="sps-title">{title}</h2>
		<p class="sps-description">{description}</p>
	</header>

	<div class="sps-stack-board">
		<ol class="sps-stack" aria-label="Platform layers, top to bottom">
			{#each layers as layer, index}
				<li style={`--sps-offset:${index}`}>
					<button
						type="button"
						class={`sps-slab sps-slab--${index % 4}`}
						class:is-active={index === activeLayer}
						aria-pressed={index === activeLayer}
						onclick={() => (activeLayer = index)}
						onmouseenter={() => (activeLayer = index)}
					>
						<span class="sps-slab-index">L{layers.length - index}</span>
						<span class="sps-slab-name">{layer.name}</span>
					</button>
				</li>
			{/each}
		</ol>

		{#if layers[activeLayer]}
			<article class={`sps-layer-detail sps-slab--${activeLayer % 4}`}>
				<h3 class="sps-layer-title">{layers[activeLayer].name}</h3>
				<p class="sps-layer-desc">{layers[activeLayer].description}</p>
				<ul class="sps-tags">
					{#each layers[activeLayer].examples as example}
						<li>{example}</li>
					{/each}
				</ul>
			</article>
		{/if}
	</div>

	{#if modules.length > 0}
		<div class="sps-modules">
			<h3 class="sps-subtitle">Public modules and the domains they own</h3>
			<div class="sps-module-grid">
				{#each modules as module}
					<article class="sps-module">
						<p class="sps-module-name">{module.name}</p>
						<p class="sps-module-desc">{module.description}</p>
						<ul class="sps-module-domains">
							{#each module.examples as domain}
								<li>{domain}</li>
							{/each}
						</ul>
					</article>
				{/each}
			</div>
		</div>
	{/if}

	<div class="sps-package">
		<article class="sps-package-side sps-package-side--in">
			<h3 class="sps-package-title">
				<span aria-hidden="true">📦</span> Ships to npm
			</h3>
			<ul>
				{#each shipped as item}
					<li>{item}</li>
				{/each}
			</ul>
		</article>
		<div class="sps-package-gate" aria-hidden="true">
			<span>package boundary</span>
		</div>
		<article class="sps-package-side sps-package-side--out">
			<h3 class="sps-package-title">
				<span aria-hidden="true">🔒</span> Stays in the workspace
			</h3>
			<ul>
				{#each excluded as item}
					<li>{item}</li>
				{/each}
			</ul>
		</article>
	</div>
</section>

<style>
	.c-samo-platform-stack {
		display: grid;
		gap: 2rem;
	}

	.sps-slab--0 {
		--sps-tone: #ea580c;
	}
	.sps-slab--1 {
		--sps-tone: #7c3aed;
	}
	.sps-slab--2 {
		--sps-tone: #0284c7;
	}
	.sps-slab--3 {
		--sps-tone: #059669;
	}

	.sps-header {
		max-width: 52rem;
	}

	.sps-eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.sps-title {
		margin-top: 0.5rem;
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.05;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--color-text-primary);
	}

	.sps-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sps-subtitle {
		font-size: 1.375rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sps-stack-board {
		display: grid;
		gap: 1.5rem;
	}

	@media (min-width: 960px) {
		.sps-stack-board {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: center;
		}
	}

	.sps-stack {
		display: grid;
		gap: 0.625rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Slabs widen towards the bottom: the runtime carries everything above it. */
	.sps-stack li {
		padding-inline: calc((3 - var(--sps-offset)) * 1.25rem);
	}

	.sps-slab {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		border-radius: 1.125rem;
		border: 1px solid color-mix(in srgb, var(--sps-tone) 35%, var(--color-border-primary));
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--sps-tone) 14%, var(--color-background-primary)),
			color-mix(in srgb, var(--sps-tone) 4%, var(--color-background-primary))
		);
		padding: 1.125rem 1.25rem;
		font: inherit;
		text-align: left;
		color: var(--color-text-primary);
		cursor: pointer;
		transform: perspective(900px) rotateX(10deg);
		transition:
			transform 0.25s,
			box-shadow 0.25s,
			background 0.25s;
	}

	.sps-slab.is-active {
		transform: perspective(900px) rotateX(0deg) translateY(-2px);
		background: linear-gradient(
			135deg,
			var(--sps-tone),
			color-mix(in srgb, var(--sps-tone) 70%, black)
		);
		color: #fff;
		box-shadow: 0 20px 40px -24px var(--sps-tone);
	}

	.sps-slab-index {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 800;
		opacity: 0.75;
	}

	.sps-slab-name {
		font-size: 1.125rem;
		font-weight: 800;
	}

	.sps-layer-detail {
		border-radius: 28px;
		border-left: 5px solid var(--sps-tone);
		background-color: color-mix(in srgb, var(--sps-tone) 7%, var(--color-background-primary));
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.sps-layer-title {
		font-size: 1.625rem;
		font-weight: 900;
		color: var(--sps-tone);
	}

	.sps-layer-desc {
		margin-top: 0.75rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-primary);
	}

	.sps-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sps-tags li {
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--sps-tone) 14%, transparent);
		padding: 0.25rem 0.75rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-primary);
	}

	.sps-modules {
		display: grid;
		gap: 1rem;
	}

	.sps-module-grid {
		display: grid;
		gap: 0.875rem;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}

	.sps-module {
		border-radius: 1.25rem;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 92%, white 8%);
		padding: 1.125rem;
		transition: border-color 0.2s;
	}

	.sps-module:hover {
		border-color: color-mix(in srgb, var(--color-warning-500) 55%, var(--color-border-primary));
	}

	.sps-module-name {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 1rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sps-module-desc {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	.sps-module-domains {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.75rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sps-module-domains li {
		border-radius: 0.375rem;
		background-color: color-mix(in srgb, var(--color-text-primary) 6%, transparent);
		padding: 0.125rem 0.4rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: var(--color-text-primary);
	}

	.sps-package {
		display: grid;
		gap: 1rem;
		align-items: stretch;
	}

	@media (min-width: 900px) {
		.sps-package {
			grid-template-columns: 1fr auto 1fr;
		}
	}

	.sps-package-side {
		--sps-tone: #059669;
		border-radius: 24px;
		border: 1px solid color-mix(in srgb, var(--sps-tone) 30%, var(--color-border-primary));
		background-color: color-mix(in srgb, var(--sps-tone) 6%, var(--color-background-primary));
		padding: 1.5rem;
	}

	.sps-package-side--out {
		--sps-tone: #64748b;
	}

	.sps-package-title {
		font-size: 1.125rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sps-package-side ul {
		display: grid;
		gap: 0.5rem;
		margin: 1rem 0 0;
		padding: 0 0 0 1.125rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	.sps-package-side li::marker {
		color: var(--sps-tone);
	}

	.sps-package-gate {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sps-package-gate span {
		border-radius: 9999px;
		border: 1px dashed color-mix(in srgb, var(--color-warning-500) 60%, transparent);
		padding: 0.5rem 0.875rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		white-space: nowrap;
		color: var(--color-warning-500);
	}

	@media (min-width: 900px) {
		.sps-package-gate span {
			writing-mode: vertical-rl;
			padding: 0.875rem 0.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sps-slab,
		.sps-slab.is-active {
			transform: none;
		}
	}
</style>
