<script lang="ts">
	import type { RecipeSamoNestedMethods } from '$stylist/domain/interface/recipe/samo-nested-methods';

	let {
		eyebrow = 'Nested methodologies',
		title = 'A methodology made of methodologies',
		description = 'SAMO does not replace proven ideas — it gives each of them a precise place in the address. Module ownership groups domains into repositories, Domain-Driven Design works at the domain level, Atomic Design lives inside component/, DSIAP inside interface/, and trait refinement shapes the family name. Pick a layer to see how each one works.',
		layers = ['modules/<module>', '<domain>', '<cluster>', '<joint>', '<family>'],
		methods = [
			{
				id: 'module-ownership',
				title: 'Module ownership',
				depth: 0,
				host: 'modules/<module>/',
				tagline: 'Who owns, versions and publishes the code?',
				summary:
					'Above the domains sits the repository layer. Stylist is an umbrella repository: every module is its own Git repository with its own history, declared in modules.json. Module grouping is ownership, not another level of the address — imports stay $stylist/<domain>/…',
				levels: [
					{
						name: 'umbrella',
						description:
							'stylist-svelte records module revisions, generated entrypoints, scripts and the sandbox app.',
						examples: ['modules.json', '.gitmodules', 'src/lib/index.ts']
					},
					{
						name: 'module',
						description: 'A Git submodule that owns a group of domains — public or private.',
						examples: ['design-system', 'interaction', 'information', 'architecture', 'sandbox']
					},
					{
						name: 'nested repository',
						description:
							'A domain that is itself a repository, registered in the owner’s .gitmodules.',
						examples: ['theme · svg · typography · layout', 'travel · wbd', 'geo']
					},
					{
						name: 'domain',
						description: 'Where the SAMO address begins. A domain belongs to exactly one module.',
						examples: ['button', 'theme', 'chart']
					}
				],
				code: `stylist-svelte/                 ← umbrella repository
  modules.json                  ← domain → owner registry
  modules/
    design-system/              ← module (git submodule)
      theme/  layout/  svg/     ← nested repositories
    interaction/
      button/                   ← domain: the address starts here
    business/
      travel/                   ← private package of its own
  src/lib/index.ts              ← generated entrypoint only`,
				note: 'A domain is listed once, under one owner. Duplicates fail the module registry check, and private modules never reach the npm package.'
			},
			{
				id: 'domain-clustering',
				title: 'Domain clustering (DDD)',
				depth: 1,
				host: 'modules/<module>/<domain>/',
				tagline: 'What does the entity belong to?',
				summary:
					'A simplified adaptation of strategic Domain-Driven Design. Components and logic are isolated into clusters that mirror the structure of the business, so the code speaks the same language as the product.',
				levels: [
					{
						name: 'Bounded context',
						description:
							'A model is valid only inside its cluster. Order in Checkout is not the same as Order in OrderHistory.',
						examples: ['checkout', 'order-history']
					},
					{
						name: 'Ubiquitous language',
						description:
							'Clusters, components, props and events use business words, not generic ones.',
						examples: ['ShoppingCartSummary', 'not GenericForm']
					},
					{
						name: 'High cohesion, low coupling',
						description:
							'Everything inside a cluster serves one goal. Importing the internals of another cluster is forbidden.',
						examples: ['commerce', 'analytics', 'auth']
					},
					{
						name: 'Autonomy',
						description:
							'A cluster carries its own styling, state and specific logic, so it can evolve independently.',
						examples: ['Summary', 'ShippingAddressForm', 'PaymentMethodSelector']
					}
				],
				code: 'analytics/  SalesAnalyticsChart   → currency formatting\nhealthcare/ PatientVitalsChart    → vital-sign thresholds\n\n// Both are charts, but the domain logic stays\n// inside its own cluster and never leaks into\n// the shared chart primitives.',
				note: 'A new domain is introduced only when an entity clearly belongs to none of the existing ones.'
			},
			{
				id: 'functional-taxonomy',
				title: 'Functional taxonomy',
				depth: 1,
				host: 'the second axis of the glass box',
				tagline: 'What does the entity do?',
				summary:
					'Nine open categories classify a component by its primary function. Together with domain clustering it forms a cybernetic “glass box”: every path answers both “what is it for?” and “what does it do?”.',
				levels: [
					{
						name: 'input',
						description: 'Entering, uploading and editing data.',
						examples: ['Input', 'Textarea', 'EmailInput']
					},
					{
						name: 'controls',
						description: 'Triggering an action or changing system state.',
						examples: ['Button', 'Checkbox', 'Switch', 'Select']
					},
					{
						name: 'feedback',
						description: 'Informing about a state, process or event for a limited time.',
						examples: ['Loader', 'ProgressBar', 'Skeleton']
					},
					{
						name: 'layout',
						description: 'Composing and positioning other components.',
						examples: ['Divider', 'Spacer', 'Separator']
					},
					{
						name: 'navigation',
						description: 'Moving inside or between compositions.',
						examples: ['Breadcrumbs', 'Pagination']
					},
					{
						name: 'media',
						description: 'Images, icons, flags and identifiers.',
						examples: ['Image', 'Avatar', 'Icon', 'CountryFlag']
					},
					{
						name: 'typography',
						description: 'Formatting and animating text and numbers.',
						examples: ['Heading', 'Link', 'AnimatedDigit']
					},
					{
						name: 'output',
						description: 'Visualising data, statuses and meta information.',
						examples: ['NpmBadge', 'DataTable']
					},
					{
						name: 'content',
						description: 'Structured, valuable information of a subject area.',
						examples: ['Form', 'Wizard']
					}
				],
				note: '100% of atoms are classified by function, about 40% of molecules are function-oriented, and about 90% of organisms live inside domain clusters. When a component fits several categories, its primary purpose wins.'
			},
			{
				id: 'atomic-design',
				title: 'Atomic Design',
				depth: 3,
				host: '<domain>/component/<joint>/',
				tagline: 'How complex is the component?',
				summary:
					'Brad Frost’s hierarchy is not just a design vocabulary here — it is the joint of the component cluster. Complexity grows bottom-up, and every level is built only from the levels below it.',
				levels: [
					{
						name: 'atom',
						description: 'Basic building blocks that cannot be split further.',
						examples: ['svg/…/atom/icon', 'AnimatedDigit']
					},
					{
						name: 'molecule',
						description: 'Combinations of atoms with one clear purpose.',
						examples: ['cta-buttons', 'feature-grid', 'stylist-hero']
					},
					{
						name: 'organism',
						description: 'Large sections assembled from molecules.',
						examples: ['stylist-hero', 'samo-methodology', 'domain-explorer']
					},
					{
						name: 'template',
						description: 'Layout skeletons without real content.',
						examples: ['page shells']
					},
					{
						name: 'page',
						description: 'Templates filled with real data and handlers.',
						examples: ['domain-landing', 'domain-playground']
					}
				],
				code: 'domain/component/\n  page/domain-landing           ← this page\n  page/stylist-landing         ← the landing flow\n  organism/samo-methodology     ← this whole section\n  molecule/samo-nested-methods  ← you are here\n  molecule/stylist-hero   ← the hero above\nsvg/component/atom/icon         ← every icon on the page',
				note: 'A self-analysis pass estimates component complexity, looks for duplicates and recommends moving a component up or down a level.'
			},
			{
				id: 'dsiap',
				title: 'DSIAP',
				depth: 3,
				host: '<domain>/interface/<joint>/',
				tagline: 'How is the contract assembled?',
				summary:
					'Domain-Specific Interface Assembly Pattern. Props contracts are never written as one monolith: atomic behaviors and slots from different domains are merged into a recipe, LEGO-style, through a type-level intersection.',
				levels: [
					{
						name: 'behavior',
						description: 'One atomic capability.',
						examples: ['BehaviorClickable', 'BehaviorFocusable', 'BehaviorSized']
					},
					{
						name: 'slot',
						description: 'One atomic content or data surface.',
						examples: ['SlotText', 'SlotIcon', 'SlotBadge']
					},
					{
						name: 'contract',
						description: 'An optional boundary agreement between systems.',
						examples: ['API boundary', 'only when needed']
					},
					{
						name: 'recipe',
						description: 'The final composition of behaviors, slots and contracts.',
						examples: ['RecipeButton', 'RecipeButtonComposed']
					}
				],
				code: '// button/interface/recipe/button-composed/index.ts\nexport interface RecipeButtonComposed\n\textends ComputeIntersectAll<[\n\t\tSlotText,          // typography/interface/slot\n\t\tSlotIcon,          // svg/interface/slot\n\t\tSlotBadge,         // layout/interface/slot\n\t\tBehaviorClickable, // layout/interface/behavior\n\t\tBehaviorFocusable,\n\t\tBehaviorSized,\n\t\tBehaviorShapeable,\n\t\tRecipeContainer,   // layout/interface/recipe\n\t\tRecipeBackground,\n\t\tRecipeBorder\n\t]> {\n\tloadingLabel?: string;\n}',
				note: 'The direction is one-way: behavior / slot / contract → recipe. Change the click behavior once, and every recipe that includes it follows.'
			},
			{
				id: 'family-refinement',
				title: 'Trait refinement',
				depth: 4,
				host: '<joint>/<family>-<trait>-<trait>/',
				tagline: 'Which exact entity is it?',
				summary:
					'The family names the main entity; every trait suffix narrows it. Related entities sort next to each other, and the name alone tells how specific a file is.',
				levels: [
					{
						name: 'family',
						description: 'The main entity family.',
						examples: ['theme', 'canvas', 'button']
					},
					{
						name: 'family-trait',
						description: 'A refinement of the family.',
						examples: ['theme-mode', 'canvas-axis', 'button-composed']
					},
					{
						name: 'family-trait-trait',
						description: 'A more detailed refinement.',
						examples: ['theme-mode-toggle', 'canvas-axis-x']
					}
				],
				code: 'theme/class/manager/\n  theme               ← family\n  theme-palette       ← family-trait\n  theme-settings      ← family-trait\n  theme-mode-toggle   ← family-trait-trait\n  theme-resolver      ← family-trait',
				note: 'The key test: if a name answers “what subject entity is this?”, it is a family. If it answers “what role does it play?”, it is a joint.'
			}
		],
		class: className = ''
	}: RecipeSamoNestedMethods = $props();

	let activeId = $state('');

	const activeMethod = $derived(methods.find((method) => method.id === activeId) ?? methods[0]);
</script>

{#snippet layerBox(depth: number)}
	<div class={`snm-layer snm-layer--${depth % 5}`}>
		<span class="snm-layer-label">{layers[depth]}</span>
		<div class="snm-layer-chips">
			{#each methods.filter((method) => method.depth === depth) as method}
				<button
					type="button"
					class="snm-chip"
					class:is-active={method.id === activeMethod?.id}
					aria-pressed={method.id === activeMethod?.id}
					onclick={() => (activeId = method.id)}
				>
					{method.title}
				</button>
			{/each}
		</div>
		{#if depth < layers.length - 1}
			{@render layerBox(depth + 1)}
		{/if}
	</div>
{/snippet}

<section class={`c-samo-nested-methods ${className}`}>
	<header class="snm-header">
		<p class="snm-eyebrow">{eyebrow}</p>
		<h2 class="snm-title">{title}</h2>
		<p class="snm-description">{description}</p>
	</header>

	<div class="snm-body">
		<nav class="snm-map" aria-label="Where each methodology lives">
			{#if layers.length > 0}
				{@render layerBox(0)}
			{/if}
		</nav>

		{#if activeMethod}
			<article class="snm-panel">
				<div class="snm-panel-head">
					<code class="snm-host">{activeMethod.host}</code>
					<h3 class="snm-panel-title">{activeMethod.title}</h3>
					<p class="snm-tagline">{activeMethod.tagline}</p>
					<p class="snm-summary">{activeMethod.summary}</p>
				</div>

				<ol class="snm-levels">
					{#each activeMethod.levels as level, index}
						<li class="snm-level">
							<span class="snm-level-index">{index + 1}</span>
							<div>
								<p class="snm-level-name">{level.name}</p>
								<p class="snm-level-desc">{level.description}</p>
								<ul class="snm-level-examples">
									{#each level.examples as example}
										<li>{example}</li>
									{/each}
								</ul>
							</div>
						</li>
					{/each}
				</ol>

				{#if activeMethod.code}
					<pre class="snm-code"><code>{activeMethod.code}</code></pre>
				{/if}

				<p class="snm-note">{activeMethod.note}</p>
			</article>
		{/if}
	</div>
</section>

<style>
	.c-samo-nested-methods {
		display: grid;
		gap: 2rem;
	}

	.snm-header {
		max-width: 56rem;
	}

	.snm-eyebrow {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.snm-title {
		margin-top: 0.75rem;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		line-height: 1.15;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
	}

	.snm-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.snm-body {
		display: grid;
		gap: 1.5rem;
	}

	@media (min-width: 1100px) {
		.snm-body {
			grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
			align-items: start;
		}

		.snm-map {
			position: sticky;
			top: 1.5rem;
		}
	}

	/* Each nested box is one coordinate of the address; methodologies sit on the layer they own. */
	.snm-layer {
		--layer: #ea580c;
		display: grid;
		gap: 0.75rem;
		border-radius: 1.25rem;
		border: 1.5px dashed color-mix(in srgb, var(--layer) 55%, transparent);
		background-color: color-mix(in srgb, var(--layer) 6%, var(--color-background-primary));
		padding: 0.875rem;
	}

	.snm-layer--1 {
		--layer: #0284c7;
	}
	.snm-layer--2 {
		--layer: #7c3aed;
	}
	.snm-layer--4 {
		--layer: #d97706;
	}
	.snm-layer--3 {
		--layer: #059669;
	}

	.snm-layer-label {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--layer);
	}

	.snm-layer-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.snm-layer-chips:empty {
		display: none;
	}

	.snm-chip {
		border-radius: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--layer) 40%, var(--color-border-primary));
		background-color: var(--color-background-primary);
		padding: 0.5rem 0.75rem;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s,
			transform 0.2s;
	}

	.snm-chip:hover {
		transform: translateY(-1px);
	}

	.snm-chip.is-active {
		border-color: var(--layer);
		background-color: var(--layer);
		color: #fff;
	}

	.snm-panel {
		display: grid;
		gap: 1.5rem;
		border-radius: 28px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.snm-host {
		display: inline-block;
		border-radius: 0.5rem;
		background-color: color-mix(in srgb, var(--color-warning-500) 12%, transparent);
		padding: 0.25rem 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-primary);
	}

	.snm-panel-title {
		margin-top: 0.75rem;
		font-size: 1.75rem;
		font-weight: 900;
		letter-spacing: -0.02em;
		color: var(--color-text-primary);
	}

	.snm-tagline {
		margin-top: 0.25rem;
		font-weight: 700;
		color: var(--color-warning-500);
	}

	.snm-summary {
		margin-top: 0.75rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.snm-levels {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
	}

	.snm-level {
		display: flex;
		gap: 0.75rem;
		border-radius: 1rem;
		border: 1px solid var(--color-border-primary);
		padding: 0.875rem;
	}

	.snm-level-index {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--color-warning-500) 18%, transparent);
		font-size: 0.8125rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.snm-level-name {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.snm-level-desc {
		margin-top: 0.25rem;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	.snm-level-examples {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.snm-level-examples li {
		border-radius: 0.375rem;
		background-color: color-mix(in srgb, var(--color-text-primary) 6%, transparent);
		padding: 0.125rem 0.375rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: var(--color-text-primary);
	}

	.snm-code {
		margin: 0;
		overflow-x: auto;
		border-radius: 1rem;
		background-color: #0f172a;
		padding: 1.25rem;
		tab-size: 2;
	}

	.snm-code code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		line-height: 1.7;
		color: #e2e8f0;
	}

	.snm-note {
		border-left: 4px solid var(--color-warning-500);
		padding-left: 1rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	@media (prefers-reduced-motion: reduce) {
		.snm-chip:hover {
			transform: none;
		}
	}
</style>
