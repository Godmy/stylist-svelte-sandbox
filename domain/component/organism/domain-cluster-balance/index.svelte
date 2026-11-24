<script lang="ts">
	import type { RecipeDomainClusterBalance } from '$stylist/domain/interface/recipe/domain-cluster-balance';
	import createDomainClusterBalanceComponentState from '$stylist/domain/component/organism/domain-cluster-balance/state.svelte';
	type AnomalyMetricKey = 'components' | 'const' | 'type' | 'interface' | 'class' | 'function';
	let { domains, class: className = '' }: RecipeDomainClusterBalance = $props();

	const state = createDomainClusterBalanceComponentState(() => ({ domains: domains }));
</script>

<article class="c-domain-cluster-balance {className}">
	<header>
		<div>
			<p class="eyebrow">Anomaly Scan</p>
			<h3>Domain cluster balance</h3>
		</div>
	</header>

	<div class="table-shell">
		<table>
			<thead>
				<tr>
					<th>Domain</th>
					{#each state.anomalyMetricKeys as key, keyIndex (keyIndex)}
						<th>{state.anomalyMetricLabels[key]}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each state.anomalyRows as row (row.domain)}
					<tr>
						<th scope="row">
							<span>{state.formatDomainName(row.domain)}</span>
							<code>{row.domain}</code>
						</th>
						{#each state.anomalyMetricKeys as key, keyIndex2 (keyIndex2)}
							<td>
								<div
									class="heat-cell"
									style={`--heat: ${state.getPercentage(row[key], state.anomalyMaxByMetric[key])}%;`}
									title={`${state.anomalyMetricLabels[key]}: ${row[key]}`}
								>
									<strong>{row[key]}</strong>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</article>

<style>
	.c-domain-cluster-balance {
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

	.eyebrow {
		margin: 0;
		color: var(--color-text-secondary, #64748b);
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	h3 {
		margin: 0;
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
		min-width: 780px;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.55rem;
		border-bottom: 1px solid
			color-mix(in srgb, var(--color-border-primary, #cbd5e1) 58%, transparent);
		text-align: left;
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
		position: sticky;
		left: 0;
		z-index: 1;
		min-width: 11rem;
		background: var(--color-background-primary, #ffffff);
	}

	tbody th span,
	tbody th code {
		display: block;
	}

	tbody th span {
		font-size: 0.85rem;
	}

	tbody th code {
		margin-top: 0.15rem;
		color: var(--color-text-secondary, #64748b);
		font-size: 0.72rem;
		font-weight: 500;
	}

	.heat-cell {
		min-width: 5.75rem;
		padding: 0.48rem 0.6rem;
		border-radius: 6px;
		background:
			linear-gradient(
				90deg,
				color-mix(in srgb, #2563eb 22%, transparent) var(--heat),
				transparent var(--heat)
			),
			var(--color-background-secondary, #f8fafc);
		font-variant-numeric: tabular-nums;
	}

	.heat-cell strong {
		font-size: 0.9rem;
	}
</style>
