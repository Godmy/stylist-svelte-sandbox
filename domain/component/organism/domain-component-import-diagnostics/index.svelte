<script lang="ts">
	import type { RecipeDomainComponentImportDiagnostics } from '$stylist/domain/interface/recipe/domain-component-import-diagnostics';

	let { rows, summary, class: className = '' }: RecipeDomainComponentImportDiagnostics = $props();

	function formatDomainName(value: string): string {
		return value
			.split('-')
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}
</script>

<article class="c-domain-component-import-diagnostics {className}">
	<header>
		<div>
			<p class="eyebrow">Import Anomalies</p>
			<h3>Component recipe boundary</h3>
		</div>
		<div class="import-summary" aria-label="Component import anomaly totals">
			<div>
				<strong>{summary.total}</strong>
				<span>flagged</span>
			</div>
			<div>
				<strong>{summary.none}</strong>
				<span>no imports</span>
			</div>
			<div>
				<strong>{summary.missingRecipe}</strong>
				<span>missing recipe</span>
			</div>
		</div>
	</header>

	<div class="table-shell">
		<table>
			<thead>
				<tr>
					<th>Component</th>
					<th>Status</th>
					<th>Expected recipe</th>
					<th>Recipe imports</th>
					<th>Other imports</th>
					<th>Imports</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row (row.path)}
					<tr>
						<th scope="row">
							<span>{formatDomainName(row.domain)} / {row.joint} / {row.family}</span>
							<code>{row.path}</code>
						</th>
						<td>
							<span class={`status-badge status-badge--${row.status}`}>
								{row.status === 'none' ? 'No imports' : 'Missing recipe'}
							</span>
						</td>
						<td><code>{row.expectedRecipe}</code></td>
						<td>
							{#if row.recipeImports.length > 0}
								<div class="import-list">
									{#each row.recipeImports as entry, entryIndex (entryIndex)}
										<code>{entry}</code>
									{/each}
								</div>
							{:else}
								<span class="muted-copy">-</span>
							{/if}
						</td>
						<td>
							{#if row.otherImports.length > 0}
								<div class="import-list">
									{#each row.otherImports as entry, entryIndex2 (entryIndex2)}
										<code>{entry}</code>
									{/each}
								</div>
							{:else}
								<span class="muted-copy">-</span>
							{/if}
						</td>
						<td>{row.importCount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</article>

<style>
	.c-domain-component-import-diagnostics {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--color-border-primary, #cbd5e1);
		border-radius: 8px;
		background: var(--color-background-primary, #ffffff);
	}

	header {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
	}

	.import-summary {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.import-summary div {
		display: grid;
		gap: 0.2rem;
		min-width: 5.75rem;
	}

	.import-summary strong {
		font-size: 1.25rem;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.import-summary span,
	.eyebrow {
		color: var(--color-text-secondary, #64748b);
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.eyebrow,
	h3 {
		margin: 0;
	}

	h3 {
		font-size: 1rem;
		line-height: 1.2;
	}

	.table-shell {
		overflow: auto;
		border: 1px solid color-mix(in srgb, var(--color-border-primary, #cbd5e1) 72%, transparent);
		border-radius: 8px;
	}

	table {
		width: 100%;
		min-width: 980px;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.65rem;
		border-bottom: 1px solid
			color-mix(in srgb, var(--color-border-primary, #cbd5e1) 58%, transparent);
		text-align: left;
		vertical-align: top;
	}

	thead th {
		position: sticky;
		top: 0;
		z-index: 1;
		background: var(--color-background-secondary, #f8fafc);
		color: var(--color-text-secondary, #64748b);
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	tbody th {
		min-width: 18rem;
	}

	tbody th span,
	tbody th code {
		display: block;
	}

	tbody th span {
		font-size: 0.85rem;
	}

	tbody th code,
	code {
		color: var(--color-text-secondary, #64748b);
		font-size: 0.72rem;
		font-weight: 500;
		white-space: normal;
		overflow-wrap: anywhere;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		min-height: 1.6rem;
		padding: 0 0.55rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.status-badge--none {
		background: color-mix(in srgb, #64748b 14%, transparent);
		color: #334155;
	}

	.status-badge--missing-recipe {
		background: color-mix(in srgb, #f97316 16%, transparent);
		color: #9a3412;
	}

	.import-list {
		display: grid;
		gap: 0.35rem;
		max-width: 24rem;
	}

	.muted-copy {
		color: var(--color-text-tertiary, #94a3b8);
	}

	@media (max-width: 720px) {
		header {
			flex-direction: column;
		}

		.import-summary {
			justify-content: start;
		}
	}
</style>
