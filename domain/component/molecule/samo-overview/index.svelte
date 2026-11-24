<script lang="ts">
	import type { RecipeSamoOverview } from '$stylist/domain/interface/recipe/samo-overview';
	import createSamoOverviewComponentState from '$stylist/domain/component/molecule/samo-overview/state.svelte';

	let {
		eyebrow = 'The methodology behind the library',
		title = 'SAMO: the file tree is the interface between people and AI',
		description = 'SOLID · Atomic · Morphological · Orchestration. Every entity in Stylist gets a strict four-part address, so a human reviewer and an AI agent can both tell what a file is, what it does and where its dependencies may flow — just by reading its path.',
		pillars = [
			{
				letter: 'S',
				title: 'SOLID',
				description:
					'Every file has one reason to change. The library grows by adding new files, not by mutating old ones.',
				example: 'one file = one export'
			},
			{
				letter: 'A',
				title: 'Atomic Design',
				description:
					'Atoms, molecules, organisms, templates and pages are folders in the file system, not just boxes in a design tool.',
				example: 'component/molecule/cta-buttons'
			},
			{
				letter: 'M',
				title: 'Morphological box',
				description:
					'Fritz Zwicky’s method: an entity is a combination of independent axes — domain, cluster, joint and family.',
				example: '4 coordinates per entity'
			},
			{
				letter: 'O',
				title: 'Orchestration',
				description:
					'AGENTS.md, the indexation CLI and the errors CLI keep humans and agents inside the same rules.',
				example: 'agent proposes, CLI validates'
			}
		],
		coordinates = [
			{
				name: 'domain',
				defines: 'The subject area',
				question: 'What is this entity about?',
				example: 'theme · button · domain · commerce',
				mistake: 'Creating a new domain instead of reusing an existing one.'
			},
			{
				name: 'cluster',
				defines: 'The language form',
				question: 'Is it a const, type, interface, class, function or component?',
				example: 'const · type · interface · class · function · component',
				mistake: 'Mixing entities of different language levels in one folder.'
			},
			{
				name: 'joint',
				defines: 'The logical role inside the cluster',
				question: 'What architectural job does it perform?',
				example: 'behavior · recipe · manager · count · molecule',
				mistake: 'Using a business name as a joint — business names belong to the family.'
			},
			{
				name: 'family',
				defines: 'The concrete entity family',
				question: 'Which exact family is it, and how is it refined?',
				example: 'theme → theme-mode → theme-mode-toggle',
				mistake: 'Making the family so generic that it explains nothing.'
			}
		],
		addresses = [
			{
				module: 'sandbox',
				domain: 'domain',
				cluster: 'component',
				joint: 'molecule',
				family: 'cta-buttons',
				caption: 'The two cards right under the hero on this page.'
			},
			{
				module: 'interaction',
				domain: 'button',
				cluster: 'interface',
				joint: 'recipe',
				family: 'button-composed',
				caption: 'The props contract of a button, assembled from behaviors and slots.'
			},
			{
				module: 'design-system',
				domain: 'theme',
				cluster: 'class',
				joint: 'manager',
				family: 'theme-mode-toggle',
				caption: 'A stateful manager that switches light and dark mode.'
			},
			{
				module: 'sandbox',
				domain: 'domain',
				cluster: 'function',
				joint: 'count',
				family: 'stories',
				caption: 'Counts the story modules shown in the hero statistics.'
			},
			{
				module: 'design-system',
				domain: 'theme',
				cluster: 'type',
				joint: 'compute',
				family: 'intersect-all',
				caption: 'The type-level LEGO connector that merges recipes together.'
			}
		],
		class: className = ''
	}: RecipeSamoOverview = $props();

	const state = createSamoOverviewComponentState(() => ({
		coordinates: coordinates,
		addresses: addresses
	}));
</script>

<section class={`c-samo-overview ${className}`}>
	<header class="so-header">
		<p class="so-eyebrow">{eyebrow}</p>
		<h2 class="so-title">{title}</h2>
		<p class="so-description">{description}</p>
	</header>

	<div class="so-pillars">
		{#each pillars as pillar, pillarIndex (pillarIndex)}
			<article class="so-pillar">
				<span class="so-pillar-letter" aria-hidden="true">{pillar.letter}</span>
				<h3 class="so-pillar-title">{pillar.title}</h3>
				<p class="so-pillar-desc">{pillar.description}</p>
				<code class="so-pillar-example">{pillar.example}</code>
			</article>
		{/each}
	</div>

	<div class="so-decoder">
		<div class="so-decoder-head">
			<h3 class="so-decoder-title">Decode a real address</h3>
			<p class="so-decoder-hint">
				Pick a file from this repository, then click any coordinate of its path. The module in front
				is the repository that owns the code — not a fifth coordinate.
			</p>
		</div>

		<div class="so-address-picker" role="tablist" aria-label="Example addresses">
			{#each addresses as address, index (index)}
				<button
					type="button"
					role="tab"
					aria-selected={index === state.activeAddressIndex}
					class="so-address-chip"
					class:is-active={index === state.activeAddressIndex}
					onclick={() => (state.activeAddressIndex = index)}
				>
					{address.family}
				</button>
			{/each}
		</div>

		<div class="so-path" aria-label="Entity address">
			<span class="so-path-root">modules/</span>
			{#if state.activeAddress}
				<span class="so-path-owner">
					<span class="so-path-value">{state.activeAddress.module}</span>
					<span class="so-path-label">owner</span>
				</span>
				<span class="so-path-slash" aria-hidden="true">/</span>
			{/if}
			{#each state.addressSegments as segment, index (index)}
				<button
					type="button"
					class={`so-path-segment so-path-segment--${index}`}
					class:is-active={index === state.activeCoordinateIndex}
					aria-pressed={index === state.activeCoordinateIndex}
					onclick={() => (state.activeCoordinateIndex = index)}
				>
					<span class="so-path-value">{segment}</span>
					<span class="so-path-label">{coordinates[index]?.name}</span>
				</button>
				<span class="so-path-slash" aria-hidden="true">/</span>
			{/each}
			<span class="so-path-file">index.ts</span>
		</div>

		<p class="so-import">
			<span class="so-import-label">imported as</span>
			<code>{state.logicalImport}</code>
			<span class="so-import-note">— the module never appears in imports</span>
		</p>

		{#if state.activeAddress}
			<p class="so-caption">{state.activeAddress.caption}</p>
		{/if}

		{#if state.activeCoordinate}
			<div class={`so-coordinate so-coordinate--${state.activeCoordinateIndex}`}>
				<div class="so-coordinate-main">
					<span class="so-coordinate-name">{state.activeCoordinate.name}</span>
					<p class="so-coordinate-defines">{state.activeCoordinate.defines}</p>
				</div>
				<dl class="so-coordinate-facts">
					<div>
						<dt>Ask yourself</dt>
						<dd>{state.activeCoordinate.question}</dd>
					</div>
					<div>
						<dt>Typical values</dt>
						<dd><code>{state.activeCoordinate.example}</code></dd>
					</div>
					<div>
						<dt>Typical mistake</dt>
						<dd>{state.activeCoordinate.mistake}</dd>
					</div>
				</dl>
			</div>
		{/if}
	</div>
</section>

<style>
	.c-samo-overview {
		--so-c0: #ea580c;
		--so-c1: #0284c7;
		--so-c2: #7c3aed;
		--so-c3: #059669;
		display: grid;
		gap: 2rem;
	}

	.so-header {
		max-width: 56rem;
	}

	.so-eyebrow {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.so-title {
		margin-top: 0.75rem;
		font-size: clamp(1.875rem, 4vw, 2.75rem);
		line-height: 1.1;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
	}

	.so-description {
		margin-top: 1rem;
		font-size: 1.125rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.so-pillars {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}

	.so-pillar {
		position: relative;
		overflow: hidden;
		border-radius: 24px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 92%, white 8%);
		padding: 1.5rem;
	}

	.so-pillar-letter {
		position: absolute;
		right: 0.75rem;
		top: -1.25rem;
		font-size: 6rem;
		font-weight: 900;
		line-height: 1;
		color: color-mix(in srgb, var(--color-warning-500) 16%, transparent);
	}

	.so-pillar-title {
		position: relative;
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.so-pillar-desc {
		position: relative;
		margin-top: 0.5rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.so-pillar-example {
		display: inline-block;
		margin-top: 1rem;
		border-radius: 0.5rem;
		background-color: color-mix(in srgb, var(--color-warning-500) 12%, transparent);
		padding: 0.25rem 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-primary);
	}

	.so-decoder {
		display: grid;
		gap: 1.25rem;
		border-radius: 28px;
		border: 1px solid var(--color-border-primary);
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--color-primary-500) 10%, transparent),
				transparent 45%
			),
			color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1.25rem, 3vw, 2rem);
	}

	.so-decoder-title {
		font-size: 1.375rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.so-decoder-hint {
		margin-top: 0.25rem;
		color: var(--color-text-secondary);
	}

	.so-address-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.so-address-chip {
		border-radius: 9999px;
		border: 1px solid var(--color-border-primary);
		background: transparent;
		padding: 0.375rem 0.875rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition:
			border-color 0.2s,
			color 0.2s,
			background-color 0.2s;
	}

	.so-address-chip:hover,
	.so-address-chip.is-active {
		border-color: var(--color-warning-500);
		color: var(--color-text-primary);
		background-color: color-mix(in srgb, var(--color-warning-500) 10%, transparent);
	}

	.so-path {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.25rem 0.375rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: clamp(0.9375rem, 2vw, 1.125rem);
	}

	.so-path-root,
	.so-path-file,
	.so-path-slash {
		padding-top: 0.5rem;
		color: var(--color-text-secondary);
	}

	.so-path-owner {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
		border-radius: 0.75rem;
		border: 1px dashed var(--color-border-primary);
		padding: 0.375rem 0.625rem;
		color: var(--color-text-secondary);
	}

	.so-path-owner .so-path-label {
		color: var(--color-text-secondary);
	}

	.so-import {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
	}

	.so-import-label {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.so-import code {
		border-radius: 0.5rem;
		background-color: color-mix(in srgb, var(--color-primary-500) 10%, transparent);
		padding: 0.25rem 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		color: var(--color-text-primary);
		word-break: break-all;
	}

	.so-import-note {
		font-size: 0.875rem;
		font-style: italic;
	}

	.so-path-segment {
		--seg: var(--so-c0);
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
		border-radius: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--seg) 35%, transparent);
		background-color: color-mix(in srgb, var(--seg) 8%, transparent);
		padding: 0.375rem 0.625rem;
		font: inherit;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			transform 0.2s,
			background-color 0.2s;
	}

	.so-path-segment--1 {
		--seg: var(--so-c1);
	}
	.so-path-segment--2 {
		--seg: var(--so-c2);
	}
	.so-path-segment--3 {
		--seg: var(--so-c3);
	}

	.so-path-segment:hover {
		transform: translateY(-2px);
	}

	.so-path-segment.is-active {
		border-color: var(--seg);
		background-color: color-mix(in srgb, var(--seg) 20%, transparent);
	}

	.so-path-value {
		font-weight: 700;
	}

	.so-path-label {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--seg);
	}

	.so-caption {
		font-style: italic;
		color: var(--color-text-secondary);
	}

	.so-coordinate {
		--seg: var(--so-c0);
		display: grid;
		gap: 1.25rem;
		border-left: 4px solid var(--seg);
		border-radius: 1rem;
		background-color: color-mix(in srgb, var(--seg) 7%, transparent);
		padding: 1.25rem 1.5rem;
	}

	.so-coordinate--1 {
		--seg: var(--so-c1);
	}
	.so-coordinate--2 {
		--seg: var(--so-c2);
	}
	.so-coordinate--3 {
		--seg: var(--so-c3);
	}

	@media (min-width: 900px) {
		.so-coordinate {
			grid-template-columns: 14rem 1fr;
			align-items: start;
		}
	}

	.so-coordinate-name {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--seg);
	}

	.so-coordinate-defines {
		margin-top: 0.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.so-coordinate-facts {
		display: grid;
		gap: 1rem;
		margin: 0;
	}

	@media (min-width: 640px) {
		.so-coordinate-facts {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.so-coordinate-facts dt {
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.so-coordinate-facts dd {
		margin: 0.375rem 0 0;
		line-height: 1.55;
		color: var(--color-text-primary);
	}

	.so-coordinate-facts code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.875rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.so-path-segment:hover {
			transform: none;
		}
	}
</style>
