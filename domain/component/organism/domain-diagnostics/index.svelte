<script lang="ts">
	import DomainFileDiagnostics from '$stylist/domain/component/organism/domain-file-diagnostics/index.svelte';
	import StoryCanvas from '$stylist/domain/component/molecule/story-canvas/index.svelte';
	import type { RecipeDomainDiagnostics } from '$stylist/domain/interface/recipe/domain-diagnostics';
	import createDomainDiagnosticsState, { formatDuration, getTimingTone } from '$stylist/domain/component/organism/domain-diagnostics/state.svelte';

	let props: RecipeDomainDiagnostics = $props();
	const className = $derived(props.class ?? '');

	const state = createDomainDiagnosticsState(() => props);

	function toWords(value: string): string {
		return value
			.split('-')
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}
</script>

<div
	class="c-domain-diagnostics {state.compact ? 'c-domain-diagnostics--compact' : ''} {className}"
>
	<DomainFileDiagnostics class="file-diagnostics" />

	<header class="hero">
		<div class="hero-copy">
			<p class="eyebrow">Diagnostics</p>
			<h2>{state.compact ? 'Story Runner' : 'Library Story Runner'}</h2>
			<p class="lede">
				Run import and runtime diagnostics for every `*.story.svelte` component in the library.
				Results are rendered on the page and mirrored to the browser console.
			</p>
		</div>

		<div class="stats-grid">
			<div class="stat-card">
				<strong>{state.allStories.length}</strong>
				<span>stories</span>
			</div>
			<div class="stat-card">
				<strong>{new Set(state.allStories.map((entry) => entry.domain)).size}</strong>
				<span>domains</span>
			</div>
			<div class="stat-card">
				<strong>{state.summary.failed}</strong>
				<span>failed</span>
			</div>
			<div class="stat-card">
				<strong>{state.summary.passed}</strong>
				<span>passed</span>
			</div>
			<div class="stat-card">
				<strong>{formatDuration(state.summary.slowest)}</strong>
				<span>slowest</span>
			</div>
		</div>
	</header>

	<section class="controls">
		<label class="search-field">
			<span>Search</span>
			<input
				type="search"
				placeholder="typography, button, input..."
				value={state.searchQuery}
				oninput={(event) => (state.searchQuery = event.currentTarget.value)}
			/>
		</label>

		<label class="select-field">
			<span>Domain</span>
			<select bind:value={state.selectedDomain}>
				{#each state.domainOptions as option}
					<option value={option}>{option === 'all' ? 'All domains' : toWords(option)}</option>
				{/each}
			</select>
		</label>

		<label class="toggle-field">
			<span>Failed Only</span>
			<input type="checkbox" bind:checked={state.failedOnly} />
		</label>

		<button class="action-button" type="button" onclick={state.clearFilters}>Reset</button>
		<button
			class="action-button action-button--primary"
			type="button"
			onclick={state.runDiagnostics}
			disabled={state.diagnosticsRunning}
		>
			{state.diagnosticsRunning
				? `Running ${state.diagnosticsProgress + 1}/${state.filteredStories.length}`
				: `Run diagnostics for ${state.filteredStories.length} stories`}
		</button>
	</section>

	<section class="status-panel">
		<p class="status-copy">
			{#if state.diagnosticsRunning && state.diagnosticsActivePath}
				Checking {state.diagnosticsActivePath}
			{:else if state.diagnosticsResultsCount > 0}
				Completed {state.summary.total} checks.
			{:else}
				Ready to run diagnostics.
			{/if}
		</p>
	</section>

	{#if state.diagnosticsResultsCount > 0}
		<section class="results-table-shell">
			<table class="results-table">
				<thead>
					<tr>
						<th>Status</th>
						<th>Title</th>
						<th>Path</th>
						<th>Import</th>
						<th>Mount</th>
						<th>Total</th>
						<th>Error</th>
					</tr>
				</thead>
				<tbody>
					{#each state.visibleResults as result (result.id)}
						<tr
							class={`result-row result-row--${result.status} result-row--${getTimingTone(result.totalMs)}`}
						>
							<td>
								<span class={`status-pill status-pill--${result.status}`}>{result.status}</span>
							</td>
							<td>
								<div class="cell-title">
									<strong>{result.title}</strong>
									<span>{result.domain}</span>
								</div>
							</td>
							<td><code class="path-code">{result.path}</code></td>
							<td class="cell-timing">{formatDuration(result.importMs)}</td>
							<td class="cell-timing">{formatDuration(result.mountMs)}</td>
							<td class="cell-timing cell-timing--total">{formatDuration(result.totalMs)}</td>
							<td class="cell-error">
								{#if result.errors.length > 0}
									{#each result.errors as error, index (`${result.id}-${index}`)}
										<div><code>{error.source}</code> {error.message}</div>
									{/each}
								{:else}
									<span class="success-copy">OK</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}
</div>

<div class="diagnostics-runner" aria-hidden="true">
	{#if state.diagnosticsStory}
		<StoryCanvas story={state.diagnosticsStory.story} render={state.diagnosticsStory.render} />
	{:else if state.diagnosticsComponent}
		{@const DiagnosticsComponent = state.diagnosticsComponent}
		<DiagnosticsComponent />
	{/if}
</div>

<style>
	.c-domain-diagnostics {
		display: grid;
		gap: 1.25rem;
		padding: 1rem;
		color: var(--color-text-primary, #0f172a);
		background:
			radial-gradient(circle at top, rgba(148, 163, 184, 0.18), transparent 34%),
			linear-gradient(
				180deg,
				var(--color-background-secondary, #f8fafc) 0%,
				var(--color-background-primary, #eef2ff) 100%
			);
	}

	.c-domain-diagnostics--compact {
		gap: 0.9rem;
		padding: 0.9rem;
		min-width: min(38rem, calc(100vw - 5rem));
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
		gap: 1.25rem;
		padding: clamp(1rem, 3vw, 1.6rem);
		border-radius: 24px;
		border: 1px solid color-mix(in srgb, var(--color-border-primary, #cbd5e1) 82%, transparent);
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--color-background-primary, #ffffff) 96%, transparent),
				color-mix(in srgb, var(--color-background-secondary, #eef2ff) 94%, transparent)
			),
			var(--color-background-primary, #ffffff);
		box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
	}

	.c-domain-diagnostics--compact .hero {
		grid-template-columns: 1fr;
		border-radius: 18px;
		padding: 1rem;
		box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
	}

	.hero-copy,
	.controls,
	.status-panel,
	.results-table-shell {
		display: grid;
		gap: 0.75rem;
	}

	.eyebrow,
	.search-field span,
	.select-field span,
	.toggle-field span {
		margin: 0;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary, #64748b);
	}

	h2,
	p {
		margin: 0;
	}

	h2 {
		font-size: clamp(1.5rem, 3vw, 2.4rem);
		line-height: 0.96;
	}

	.lede,
	.status-copy {
		color: var(--color-text-secondary, #475569);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 0.75rem;
	}

	.stat-card,
	.controls,
	.status-panel,
	.results-table-shell {
		padding: 1rem;
		border-radius: 20px;
		border: 1px solid color-mix(in srgb, var(--color-border-primary, #cbd5e1) 78%, transparent);
		background: color-mix(in srgb, var(--color-background-primary, #ffffff) 94%, transparent);
	}

	.c-domain-diagnostics--compact .stat-card,
	.c-domain-diagnostics--compact .controls,
	.c-domain-diagnostics--compact .status-panel,
	.c-domain-diagnostics--compact .results-table-shell {
		border-radius: 16px;
		padding: 0.85rem;
	}

	.stat-card strong {
		font-size: 1.8rem;
		line-height: 1;
	}

	.stat-card span {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-secondary, #64748b);
	}

	.controls {
		grid-template-columns: minmax(240px, 1.4fr) minmax(200px, 0.8fr) auto auto auto;
		align-items: end;
	}

	.c-domain-diagnostics--compact .controls {
		grid-template-columns: 1fr;
		align-items: stretch;
	}

	.search-field,
	.select-field,
	.toggle-field {
		display: grid;
		gap: 0.45rem;
	}

	.toggle-field {
		justify-items: start;
	}

	.toggle-field input {
		width: 18px;
		height: 18px;
		min-height: 18px;
		padding: 0;
	}

	input,
	select,
	.action-button {
		min-height: 44px;
		padding: 0.75rem 0.9rem;
		border-radius: 14px;
		border: 1px solid color-mix(in srgb, var(--color-border-primary, #cbd5e1) 84%, transparent);
		background: var(--color-background-primary, rgba(255, 255, 255, 0.95));
		color: inherit;
		font: inherit;
	}

	.action-button {
		cursor: pointer;
		font-weight: 600;
	}

	.action-button--primary {
		background: linear-gradient(180deg, #1d4ed8, #1e40af);
		color: white;
		border-color: #1d4ed8;
	}

	.results-table-shell {
		overflow: auto;
		padding: 0;
	}

	.results-table {
		width: 100%;
		min-width: 1080px;
		border-collapse: collapse;
	}

	.results-table th,
	.results-table td {
		padding: 0.9rem 1rem;
		text-align: left;
		vertical-align: top;
		border-bottom: 1px solid
			color-mix(in srgb, var(--color-border-primary, #cbd5e1) 70%, transparent);
	}

	.results-table th {
		position: sticky;
		top: 0;
		z-index: 1;
		background: color-mix(in srgb, var(--color-background-primary, #ffffff) 98%, transparent);
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-secondary, #64748b);
	}

	.result-row--passed {
		background: color-mix(in srgb, #16a34a 8%, var(--color-background-primary, white));
	}

	.result-row--failed {
		background: color-mix(in srgb, #dc2626 10%, var(--color-background-primary, white));
	}

	.result-row--medium .cell-timing--total {
		color: #b45309;
		font-weight: 700;
	}

	.result-row--slow .cell-timing--total {
		color: #b91c1c;
		font-weight: 700;
	}

	.status-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 72px;
		padding: 0.25rem 0.55rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.status-pill--passed {
		background: rgba(22, 163, 74, 0.12);
		color: #166534;
	}

	.status-pill--failed {
		background: rgba(220, 38, 38, 0.12);
		color: #991b1b;
	}

	.cell-title {
		display: grid;
		gap: 0.2rem;
	}

	.cell-title span,
	.success-copy {
		color: var(--color-text-secondary, #64748b);
	}

	.path-code,
	.cell-timing,
	.cell-error code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.85rem;
	}

	.cell-timing {
		white-space: nowrap;
	}

	.cell-error {
		min-width: 280px;
	}

	.diagnostics-runner {
		position: fixed;
		left: -200vw;
		top: 0;
		width: 640px;
		overflow: hidden;
		pointer-events: none;
		opacity: 0;
	}

	@media (max-width: 960px) {
		.hero,
		.controls {
			grid-template-columns: 1fr;
		}

		.c-domain-diagnostics--compact {
			min-width: 0;
		}
	}
</style>
