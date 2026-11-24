<script lang="ts">
	import type { RecipeSamoLocalDev } from '$stylist/domain/interface/recipe/samo-local-dev';
	import createSamoLocalDevComponentState from '$stylist/domain/component/molecule/samo-local-dev/state.svelte';

	let {
		eyebrow = 'Chapter 04',
		title = 'Local development: connecting your packages',
		description = 'Sites consume Stylist from source, not from a built dist. A Yarn portal links the package, and the same moduleAliases() that powers the sandbox maps every $stylist/<domain> import to its owning module — so an edit in any module hot-reloads straight into the site.',
		scenarios = [
			{
				id: 'library',
				title: 'Work on the library',
				summary:
					'A standalone clone: initialise the module repositories, validate them, install and start the sandbox.',
				snippets: [
					{
						file: 'terminal',
						code: 'git clone https://github.com/Godmy/stylist-svelte.git\ncd stylist-svelte\n\n# module repositories are submodules — fetch them recursively\ngit submodule update --init --recursive \\\n  modules/design-system modules/interaction modules/information \\\n  modules/business modules/architecture modules/sandbox\n\n# validate the physical domains (no links, no copies)\nnode scripts/prepare-module-sources.mjs --public\n\nyarn install --immutable\nyarn dev        # sandbox on http://localhost:5174'
					}
				],
				notes: [
					'Node.js 24 and the Yarn version pinned in package.json.',
					'Private modules need access to their repositories; without it, prepare with --public.',
					'The sandbox port is fixed: 5174 with strictPort.'
				]
			},
			{
				id: 'site',
				title: 'Use it in your site',
				summary:
					'Keep the site next to the library as a sibling folder and link it with a Yarn portal. The site then compiles Stylist from source.',
				snippets: [
					{
						file: 'package.json',
						code: '{\n  "dependencies": {\n    "stylist-svelte": "portal:../stylist-svelte"\n  }\n}'
					},
					{
						file: 'vite.config.ts',
						code: "import { moduleAliases } from '../stylist-svelte/scripts/prepare-module-sources.mjs';\n\nconst stylist = fileURLToPath(new URL('../stylist-svelte', import.meta.url));\n\nexport default defineConfig({\n  plugins: [sveltekit()],\n  resolve: {\n    preserveSymlinks: true,\n    alias: {\n      ...moduleAliases(stylist),            // $stylist/<domain> → modules/<module>/<domain>\n      'stylist-svelte': `${stylist}/src/lib`\n    },\n    dedupe: ['svelte']                      // one Svelte runtime for both projects\n  },\n  optimizeDeps: { exclude: ['stylist-svelte'] },  // no stale pre-bundle\n  ssr: { noExternal: ['stylist-svelte'] },       // compile it, do not require it\n  server: {\n    port: 5173,\n    strictPort: true,\n    fs: { allow: ['.', '../stylist-svelte'] },\n    watch: { ignored: [/[\\\\/]stylist-svelte[\\\\/](?:dist|\\.svelte-kit)(?:[\\\\/]|$)/] }\n  }\n});"
					},
					{
						file: 'svelte.config.js',
						code: "kit: {\n  alias: {\n    ...moduleAliases(path.resolve(__dirname, '../stylist-svelte')),\n    'stylist-svelte/*': path.resolve(__dirname, '../stylist-svelte/src/lib'),\n    // the library's own internal $stylist imports must resolve here too\n    $stylist: path.resolve(__dirname, '../stylist-svelte/src/lib')\n  }\n}"
					}
				],
				notes: [
					'Install from the site root; every site stays its own Yarn project with its own lockfile.',
					'Import by subpath: stylist-svelte/<domain>/<cluster>/<joint>/<family>/index.svelte.',
					'Never build or package the library while a site hot-reloads from it — regenerating dist desynchronises the dev server.'
				]
			},
			{
				id: 'private',
				title: 'Connect a private package',
				summary:
					'Private modules such as travel are separate Yarn packages inside the module tree. Link them with their own portal and alias; the path comes from modules.json.',
				snippets: [
					{
						file: 'package.json',
						code: '{\n  "dependencies": {\n    "stylist-svelte": "portal:../stylist-svelte",\n    "stylist-svelte-travel": "portal:../<private-package-path>"\n  }\n}'
					},
					{
						file: 'vite.config.ts',
						code: "import { moduleAliases, readModules } from '../stylist-svelte/scripts/prepare-module-sources.mjs';\n\n// physical location of the private package comes from modules.json\nconst travel = path.resolve(stylist, readModules(stylist).travel.path);\n\nalias: {\n  ...moduleAliases(stylist),\n  'stylist-svelte': `${stylist}/src/lib`,\n  'stylist-svelte-travel': travel\n},\noptimizeDeps: { exclude: ['stylist-svelte', 'stylist-svelte-travel'] },\nssr: { noExternal: ['stylist-svelte', 'stylist-svelte-travel'] }"
					},
					{
						file: 'inside the private package',
						code: "// common entities — by public package subpath\nimport Story from 'stylist-svelte/theme/component/molecule/story/index.svelte';\n\n// its own code — relative imports\nimport { EXPERIENCE_CATEGORIES } from '../../../const/array/experience-category/index.js';"
					}
				],
				notes: [
					'Replace <private-package-path> with stylist-svelte/ followed by the travel.path value from modules.json. The Vite example resolves the same registry value automatically.',
					'The dependency is one-way: the private package may import stylist-svelte, the public library must never import the private package.',
					'Moved a module? Refresh the site’s Yarn installation so the portal points to the new path.'
				]
			},
			{
				id: 'selection',
				title: 'Pick the modules',
				summary:
					'Not every checkout needs every module. One selection rule is shared by the aliases, the preparation script and the Python indexer.',
				snippets: [
					{
						file: 'terminal',
						code: '# all registered modules (default)\nnode scripts/prepare-module-sources.mjs\n\n# only public modules\nnode scripts/prepare-module-sources.mjs --public\n\n# an explicit list, or everything except some\nnode scripts/prepare-module-sources.mjs --modules=design-system,interaction\nnode scripts/prepare-module-sources.mjs --exclude-modules=business\n\n# the same selection through the environment\nSTYLIST_MODULES=public\nSTYLIST_EXCLUDE_MODULES=management'
					}
				],
				notes: [
					'Values: all, public, or a comma-separated list of registry keys such as travel or geo.',
					'An unknown key fails fast; a domain registered twice fails the registry check.',
					'Indexer equivalents: cli.py --modules / --exclude-modules.'
				]
			}
		],
		checklist = [
			{
				title: 'dedupe: [svelte]',
				description: 'Two Svelte runtimes break context, stores and hydration.',
				allowed: true
			},
			{
				title: 'optimizeDeps.exclude',
				description: 'Keeps the linked package out of pre-bundling, so edits are picked up live.',
				allowed: true
			},
			{
				title: 'ssr.noExternal',
				description:
					'Svelte sources must be compiled by the site, not required as plain Node modules.',
				allowed: true
			},
			{
				title: 'fs.allow ../stylist-svelte',
				description: 'Vite refuses to serve files outside the site root without it.',
				allowed: true
			},
			{
				title: 'Watching dist and .svelte-kit',
				description: 'Generated output must not trigger rescans and TypeScript reloads.',
				allowed: false
			},
			{
				title: 'Symlinks or copies of domains',
				description: 'Aliases already point to the owners; duplicates drift out of sync.',
				allowed: false
			}
		],
		class: className = ''
	}: RecipeSamoLocalDev = $props();

	const state = createSamoLocalDevComponentState(() => ({ scenarios: scenarios }));
</script>

<section class={`c-samo-local-dev ${className}`}>
	<header class="sld-header">
		<p class="sld-eyebrow">{eyebrow}</p>
		<h2 class="sld-title">{title}</h2>
		<p class="sld-description">{description}</p>
	</header>

	<div class="sld-topology" aria-hidden="true">
		<div class="sld-topo-node sld-topo-node--site">
			<span class="sld-topo-label">your-site/</span>
			<span class="sld-topo-meta">vite · :5173</span>
		</div>
		<div class="sld-topo-link">
			<span>portal:</span>
			<span>moduleAliases()</span>
		</div>
		<div class="sld-topo-node sld-topo-node--lib">
			<span class="sld-topo-label">stylist-svelte/</span>
			<span class="sld-topo-meta">sandbox · :5174</span>
		</div>
		<div class="sld-topo-link">
			<span>modules.json</span>
		</div>
		<div class="sld-topo-node sld-topo-node--modules">
			<span class="sld-topo-label">modules/&lt;module&gt;/&lt;domain&gt;</span>
			<span class="sld-topo-meta">edit here · hot reload everywhere</span>
		</div>
	</div>

	<div class="sld-tabs" role="tablist" aria-label="Development scenarios">
		{#each scenarios as scenario, index (scenario.id)}
			<button
				type="button"
				role="tab"
				aria-selected={scenario.id === state.activeScenario?.id}
				class="sld-tab"
				class:is-active={scenario.id === state.activeScenario?.id}
				onclick={() => (state.activeId = scenario.id)}
			>
				<span class="sld-tab-index">{String(index + 1).padStart(2, '0')}</span>
				{scenario.title}
			</button>
		{/each}
	</div>

	{#if state.activeScenario}
		<div class="sld-panel" role="tabpanel">
			<p class="sld-summary">{state.activeScenario.summary}</p>

			<div class="sld-snippets">
				{#each state.activeScenario.snippets as snippet, snippetIndex (snippetIndex)}
					<figure class="sld-snippet">
						<figcaption class="sld-snippet-bar">
							<span class="sld-dots" aria-hidden="true"><i></i><i></i><i></i></span>
							<code>{snippet.file}</code>
						</figcaption>
						<pre><code>{snippet.code}</code></pre>
					</figure>
				{/each}
			</div>

			<ul class="sld-notes">
				{#each state.activeScenario.notes as note, noteIndex (noteIndex)}
					<li>{note}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="sld-checklist">
		<h3 class="sld-subtitle">Checklist for a consuming site</h3>
		<ul class="sld-rules">
			{#each checklist as item, itemIndex (itemIndex)}
				<li class="sld-rule" class:is-denied={!item.allowed}>
					<span class="sld-rule-mark" aria-hidden="true">{item.allowed ? '✓' : '✕'}</span>
					<div>
						<p class="sld-rule-title">{item.title}</p>
						<p class="sld-rule-desc">{item.description}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.c-samo-local-dev {
		display: grid;
		gap: 2rem;
	}

	.sld-header {
		max-width: 54rem;
	}

	.sld-eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.sld-title {
		margin-top: 0.5rem;
		font-size: clamp(1.875rem, 4vw, 3rem);
		line-height: 1.05;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--color-text-primary);
	}

	.sld-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.sld-subtitle {
		font-size: 1.375rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	/* site → library → modules, the chain every import walks through. */
	.sld-topology {
		display: grid;
		gap: 0.5rem;
		align-items: center;
		border-radius: 28px;
		background-color: #0b1020;
		background-image:
			radial-gradient(circle at 85% 50%, rgba(5, 150, 105, 0.3), transparent 40%),
			radial-gradient(circle at 10% 50%, rgba(2, 132, 199, 0.3), transparent 40%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	@media (min-width: 960px) {
		.sld-topology {
			grid-template-columns: 1fr auto 1fr auto 1.2fr;
		}
	}

	.sld-topo-node {
		--topo: #0284c7;
		display: grid;
		gap: 0.25rem;
		border-radius: 1.125rem;
		border: 1px solid color-mix(in srgb, var(--topo) 60%, transparent);
		background-color: color-mix(in srgb, var(--topo) 16%, rgba(2, 6, 23, 0.8));
		padding: 0.875rem 1rem;
		text-align: center;
	}

	.sld-topo-node--lib {
		--topo: #ea580c;
	}
	.sld-topo-node--modules {
		--topo: #059669;
	}

	.sld-topo-label {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 800;
		color: #f8fafc;
		word-break: break-word;
	}

	.sld-topo-meta {
		font-size: 0.75rem;
		color: #94a3b8;
	}

	.sld-topo-link {
		display: grid;
		justify-items: center;
		gap: 0.125rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.6875rem;
		color: #fdba74;
	}

	.sld-topo-link::after {
		content: '→';
		font-size: 1.25rem;
		font-weight: 900;
		line-height: 1;
	}

	@media (max-width: 959px) {
		.sld-topo-link::after {
			content: '↓';
		}
	}

	.sld-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.sld-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 9999px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 92%, white 8%);
		padding: 0.625rem 1.125rem;
		font: inherit;
		font-weight: 700;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s,
			color 0.2s;
	}

	.sld-tab:hover {
		border-color: var(--color-warning-500);
	}

	.sld-tab.is-active {
		border-color: transparent;
		background: linear-gradient(135deg, #ea580c, #dc2626);
		color: #fff;
	}

	.sld-tab-index {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		opacity: 0.75;
	}

	.sld-panel {
		display: grid;
		gap: 1.25rem;
		border-radius: 28px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.sld-summary {
		max-width: 52rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-primary);
	}

	.sld-snippets {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 1200px) {
		.sld-snippets {
			grid-template-columns: repeat(auto-fit, minmax(26rem, 1fr));
			align-items: start;
		}
	}

	.sld-snippet {
		margin: 0;
		overflow: hidden;
		border-radius: 1.125rem;
		background-color: #0b1020;
	}

	.sld-snippet-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-bottom: 1px solid rgba(148, 163, 184, 0.16);
		padding: 0.625rem 1rem;
	}

	.sld-snippet-bar code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: #94a3b8;
	}

	.sld-dots {
		display: inline-flex;
		gap: 0.3rem;
	}

	.sld-dots i {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 9999px;
		background-color: #ef4444;
	}

	.sld-dots i:nth-child(2) {
		background-color: #f59e0b;
	}
	.sld-dots i:nth-child(3) {
		background-color: #22c55e;
	}

	.sld-snippet pre {
		margin: 0;
		overflow-x: auto;
		padding: 1rem 1.125rem;
	}

	.sld-snippet pre code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		line-height: 1.7;
		white-space: pre;
		color: #e2e8f0;
	}

	.sld-notes {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sld-notes li {
		position: relative;
		padding-left: 1.5rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.sld-notes li::before {
		content: '→';
		position: absolute;
		left: 0;
		font-weight: 900;
		color: var(--color-warning-500);
	}

	.sld-checklist {
		display: grid;
		gap: 1rem;
	}

	.sld-rules {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	}

	.sld-rule {
		--rule: #059669;
		display: flex;
		gap: 0.75rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--rule) 28%, var(--color-border-primary));
		padding: 1rem;
	}

	.sld-rule.is-denied {
		--rule: #dc2626;
	}

	.sld-rule-mark {
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

	.sld-rule-title {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.sld-rule-desc {
		margin-top: 0.25rem;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--color-text-secondary);
	}
</style>
