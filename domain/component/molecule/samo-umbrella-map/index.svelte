<script lang="ts">
	import type { RecipeSamoUmbrellaMap } from '$stylist/domain/interface/recipe/samo-umbrella-map';

	let {
		eyebrow = 'Chapter 03',
		title = 'An umbrella over modules',
		description = 'stylist-svelte is an umbrella repository. The code itself lives in modules — separate Git repositories, each owning a group of domains and keeping its own history. modules.json is the registry that maps every domain to exactly one owner.',
		modules = [
			{
				name: 'design-system',
				path: 'modules/design-system',
				visibility: 'public',
				domains: ['theme', 'typography', 'layout', 'localization', 'svg'],
				nested: ['theme', 'svg', 'typography', 'layout'],
				note: 'The foundation. Four of its domains are repositories of their own.'
			},
			{
				name: 'interaction',
				path: 'modules/interaction',
				visibility: 'public',
				domains: [
					'animation',
					'button',
					'control',
					'input',
					'form',
					'calendar',
					'file',
					'search',
					'menu',
					'navigation',
					'dialog'
				],
				nested: [],
				note: 'Everything a user acts on.'
			},
			{
				name: 'information',
				path: 'modules/information',
				visibility: 'public',
				domains: ['list', 'tree', 'table', 'chart', 'image', 'audio', 'video', 'notification'],
				nested: [],
				note: 'Everything a user reads, watches or listens to.'
			},
			{
				name: 'architecture',
				path: 'modules/architecture',
				visibility: 'public',
				domains: ['graph', 'erd', 'idef-zero', 'workspace', 'canvas', 'webgl'],
				nested: [],
				note: 'Diagrams, canvases and modelling surfaces.'
			},
			{
				name: 'sandbox',
				path: 'modules/sandbox',
				visibility: 'public',
				domains: ['domain', 'token', 'development', 'server'],
				nested: ['server'],
				note: 'This workspace. The server domain is a nested repository and is never published.'
			},
			{
				name: 'customer',
				path: 'modules/customer',
				visibility: 'private',
				domains: ['auth', 'chat', 'ai', 'user', 'social', 'landing'],
				nested: [],
				note: 'Customer-facing product domains, kept out of the npm package.'
			},
			{
				name: 'global',
				path: 'modules/global',
				visibility: 'private',
				domains: ['commerce', 'product', 'geo'],
				nested: ['geo'],
				note: 'Commerce and product domains; geo is an independent nested repository.'
			},
			{
				name: 'management',
				path: 'modules/management',
				visibility: 'private',
				domains: ['management', 'marketing', 'portfolio', 'science'],
				nested: [],
				note: 'Internal management domains.'
			},
			{
				name: 'business',
				path: 'modules/business',
				visibility: 'private',
				domains: [],
				nested: ['travel', 'wbd', 'spanish', 'sakartvelo', 'farm'],
				note: 'A container with no domains of its own. travel and sakartvelo are separate private Yarn packages.'
			},
			{
				name: 'prototype',
				path: 'modules/prototype',
				visibility: 'private',
				domains: [],
				nested: ['presentation', 'scratch'],
				note: 'A container with no domains of its own: Prezi-style presentation and Scratch-style blocks.'
			}
		],
		resolution = [
			{
				file: 'You write a logical import',
				code: "import Button from '$stylist/button/component/atom/button/index.svelte';"
			},
			{
				file: 'moduleAliases() reads modules.json',
				code: "'$stylist/button'      → modules/interaction/button\n'stylist-svelte/button' → modules/interaction/button"
			},
			{
				file: 'Vite resolves the physical file',
				code: 'modules/interaction/button/component/atom/button/index.svelte'
			}
		],
		commitSteps = [
			{
				title: 'Commit where the code lives',
				description: 'Inside the nested repository that owns the file — here, layout.'
			},
			{
				title: 'The owner records the revision',
				description: 'design-system commits the new layout pointer.'
			},
			{
				title: 'The umbrella records the owner',
				description: 'stylist-svelte commits the new design-system pointer.'
			}
		],
		commitScript = '# 1 · nested repository\ncd modules/design-system/layout\ngit add interface/slot/badge\ngit commit -m "Add SlotBadge"\n\n# 2 · owner module\ncd ..\ngit add layout\ngit commit -m "Update layout"\n\n# 3 · umbrella\ncd ../..\ngit add modules/design-system\ngit commit -m "Update design-system"',
		rules = [
			{
				title: 'Edit in the owning repository',
				description:
					'Find the owner in modules.json, check its .gitmodules for nested repositories, and run Git there.',
				allowed: true
			},
			{
				title: 'No copies or links in src/lib',
				description:
					'Umbrella src/lib holds generated entrypoints only. Domains are never recreated, linked or copied there.',
				allowed: false
			},
			{
				title: 'The module is not a coordinate',
				description:
					'Grouping by module is ownership. Inside every module the address is still domain/cluster/joint/family.',
				allowed: true
			},
			{
				title: 'Public code never imports private code',
				description:
					'Private modules are excluded from npm; a public domain depending on travel or geo would break the package.',
				allowed: false
			}
		],
		class: className = ''
	}: RecipeSamoUmbrellaMap = $props();

	let activeIndex = $state(0);

	const activeModule = $derived(modules[activeIndex] ?? modules[0]);
	const publicCount = $derived(modules.filter((module) => module.visibility === 'public').length);
</script>

<section class={`c-samo-umbrella-map ${className}`}>
	<header class="sum-header">
		<p class="sum-eyebrow">{eyebrow}</p>
		<h2 class="sum-title">{title}</h2>
		<p class="sum-description">{description}</p>
	</header>

	<div class="sum-explorer">
		<div class="sum-tree" role="tablist" aria-label="Modules of the umbrella repository">
			<div class="sum-tree-root">
				<span class="sum-tree-root-name">stylist-svelte/</span>
				<span class="sum-tree-root-meta">
					{publicCount} public · {modules.length - publicCount} private
				</span>
			</div>
			<ul class="sum-tree-list">
				{#each modules as module, index}
					<li>
						<button
							type="button"
							role="tab"
							aria-selected={index === activeIndex}
							class={`sum-node sum-node--${module.visibility}`}
							class:is-active={index === activeIndex}
							onclick={() => (activeIndex = index)}
						>
							<span class="sum-node-branch" aria-hidden="true">├─</span>
							<span class="sum-node-name">{module.name}/</span>
							<span class="sum-node-badge">
								{module.visibility === 'public' ? 'public' : '🔒 private'}
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		{#if activeModule}
			<article class={`sum-detail sum-node--${activeModule.visibility}`}>
				<code class="sum-detail-path">{activeModule.path}/</code>
				<h3 class="sum-detail-name">{activeModule.name}</h3>
				<p class="sum-detail-note">{activeModule.note}</p>

				<p class="sum-detail-label">Domains it owns</p>
				{#if activeModule.domains.length > 0}
					<ul class="sum-chips">
						{#each activeModule.domains as domain}
							<li class:is-nested={activeModule.nested.includes(domain)}>{domain}</li>
						{/each}
					</ul>
				{:else}
					<p class="sum-empty">None directly — only nested repositories.</p>
				{/if}

				{#if activeModule.nested.length > 0}
					<p class="sum-detail-label">Nested repositories (own .gitmodules)</p>
					<ul class="sum-chips sum-chips--nested">
						{#each activeModule.nested as nested}
							<li>{nested}</li>
						{/each}
					</ul>
				{/if}
			</article>
		{/if}
	</div>

	<div class="sum-block">
		<h3 class="sum-subtitle">From a logical import to a physical file</h3>
		<ol class="sum-resolution">
			{#each resolution as snippet, index}
				<li class="sum-resolution-step">
					<span class="sum-resolution-label">
						<span class="sum-resolution-index">{index + 1}</span>
						{snippet.file}
					</span>
					<pre><code>{snippet.code}</code></pre>
				</li>
			{/each}
		</ol>
		<p class="sum-text">
			No symlinks and no copies: the aliases are computed from modules.json at startup, for the
			sandbox and for every site that consumes the library from source.
		</p>
	</div>

	<div class="sum-block sum-block--split">
		<div>
			<h3 class="sum-subtitle">Commits travel up the nesting</h3>
			<ol class="sum-commit-steps">
				{#each commitSteps as step, index}
					<li>
						<span class="sum-commit-index">{index + 1}</span>
						<div>
							<p class="sum-commit-title">{step.title}</p>
							<p class="sum-commit-desc">{step.description}</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
		<pre class="sum-terminal"><code>{commitScript}</code></pre>
	</div>

	<ul class="sum-rules">
		{#each rules as rule}
			<li class="sum-rule" class:is-denied={!rule.allowed}>
				<span class="sum-rule-mark" aria-hidden="true">{rule.allowed ? '✓' : '✕'}</span>
				<div>
					<p class="sum-rule-title">{rule.title}</p>
					<p class="sum-rule-desc">{rule.description}</p>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.c-samo-umbrella-map {
		display: grid;
		gap: 2rem;
	}

	.sum-node--public {
		--sum-tone: #059669;
	}
	.sum-node--private {
		--sum-tone: #64748b;
	}

	.sum-header {
		max-width: 52rem;
	}

	.sum-eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.sum-title {
		margin-top: 0.5rem;
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.05;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--color-text-primary);
	}

	.sum-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sum-subtitle {
		font-size: 1.375rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sum-text {
		line-height: 1.65;
		color: var(--color-text-secondary);
	}

	.sum-explorer {
		display: grid;
		gap: 1.5rem;
	}

	@media (min-width: 960px) {
		.sum-explorer {
			grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
			align-items: start;
		}
	}

	.sum-tree {
		border-radius: 24px;
		background-color: #0b1020;
		padding: 1.25rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	.sum-tree-root {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0 0.5rem 0.75rem;
		border-bottom: 1px solid rgba(148, 163, 184, 0.16);
	}

	.sum-tree-root-name {
		font-weight: 800;
		color: #fdba74;
	}

	.sum-tree-root-meta {
		font-size: 0.75rem;
		color: #64748b;
	}

	.sum-tree-list {
		display: grid;
		gap: 0.125rem;
		margin: 0.75rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sum-node {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		border: 1px solid transparent;
		border-radius: 0.75rem;
		background: transparent;
		padding: 0.4rem 0.5rem;
		font: inherit;
		font-size: 0.875rem;
		text-align: left;
		color: #cbd5e1;
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.sum-node:hover {
		background-color: rgba(148, 163, 184, 0.08);
	}

	.sum-node.is-active {
		border-color: color-mix(in srgb, var(--sum-tone) 60%, transparent);
		background-color: color-mix(in srgb, var(--sum-tone) 18%, transparent);
		color: #f8fafc;
	}

	.sum-node-branch {
		color: #475569;
	}

	.sum-node-name {
		font-weight: 700;
	}

	.sum-node-badge {
		margin-left: auto;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--sum-tone) 25%, transparent);
		padding: 0.0625rem 0.5rem;
		font-size: 0.6875rem;
		color: #e2e8f0;
		white-space: nowrap;
	}

	.sum-detail {
		border-radius: 28px;
		border: 1px solid color-mix(in srgb, var(--sum-tone) 30%, var(--color-border-primary));
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--sum-tone) 12%, transparent),
				transparent 45%
			),
			color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.sum-detail-path {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
	}

	.sum-detail-name {
		margin-top: 0.375rem;
		font-size: 2rem;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--sum-tone);
	}

	.sum-detail-note {
		margin-top: 0.5rem;
		line-height: 1.6;
		color: var(--color-text-primary);
	}

	.sum-detail-label {
		margin-top: 1.25rem;
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.sum-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sum-chips li {
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--sum-tone) 12%, transparent);
		padding: 0.25rem 0.625rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-primary);
	}

	.sum-chips li.is-nested,
	.sum-chips--nested li {
		outline: 1.5px dashed color-mix(in srgb, var(--color-warning-500) 70%, transparent);
		outline-offset: -1.5px;
	}

	.sum-empty {
		margin-top: 0.5rem;
		font-style: italic;
		color: var(--color-text-secondary);
	}

	.sum-block {
		display: grid;
		gap: 1.25rem;
		border-radius: 28px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	@media (min-width: 960px) {
		.sum-block--split {
			grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
			align-items: center;
		}
	}

	.sum-resolution {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 1100px) {
		.sum-resolution {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.sum-resolution-step + .sum-resolution-step::before {
			content: '→';
			position: absolute;
			left: -0.65rem;
			top: 50%;
			transform: translate(-50%, -50%);
			font-weight: 900;
			color: var(--color-warning-500);
		}
	}

	.sum-resolution-step {
		position: relative;
		display: grid;
		align-content: start;
		gap: 0.5rem;
	}

	.sum-resolution-label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.sum-resolution-index {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #f59e0b, #dc2626);
		font-size: 0.75rem;
		font-weight: 900;
		color: #fff;
	}

	.sum-resolution-step pre {
		margin: 0;
		height: 100%;
		overflow-x: auto;
		border-radius: 1rem;
		background-color: #0b1020;
		padding: 0.875rem 1rem;
	}

	.sum-resolution-step code,
	.sum-terminal code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		line-height: 1.7;
		color: #e2e8f0;
	}

	.sum-commit-steps {
		display: grid;
		gap: 0.875rem;
		margin: 1rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sum-commit-steps li {
		display: flex;
		gap: 0.75rem;
	}

	.sum-commit-index {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 1.85rem;
		height: 1.85rem;
		border-radius: 0.625rem;
		background-color: color-mix(in srgb, var(--color-warning-500) 16%, transparent);
		font-weight: 900;
		color: var(--color-warning-500);
	}

	.sum-commit-title {
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sum-commit-desc {
		margin-top: 0.125rem;
		line-height: 1.55;
		color: var(--color-text-secondary);
	}

	.sum-terminal {
		margin: 0;
		overflow-x: auto;
		border-radius: 1.25rem;
		background-color: #0b1020;
		padding: 1.25rem;
		box-shadow: 0 24px 48px -30px rgba(234, 88, 12, 0.6);
	}

	.sum-rules {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	}

	.sum-rule {
		--rule: #059669;
		display: flex;
		gap: 0.75rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--rule) 28%, var(--color-border-primary));
		padding: 1rem;
	}

	.sum-rule.is-denied {
		--rule: #dc2626;
	}

	.sum-rule-mark {
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

	.sum-rule-title {
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sum-rule-desc {
		margin-top: 0.25rem;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--color-text-secondary);
	}
</style>
