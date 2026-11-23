<script lang="ts">
	import type { DomainFileMetric } from '$stylist/domain/type/object/domain-file-metric';
	import type { DomainFileComponentMetric } from '$stylist/domain/type/object/domain-file-component-metric';
	import type { RecipeDomainClusterBalance } from '$stylist/domain/interface/recipe/domain-cluster-balance';

	type AnomalyMetricKey = 'components' | 'const' | 'type' | 'interface' | 'class' | 'function';

	let { domains, class: className = '' }: RecipeDomainClusterBalance = $props();

	const anomalyMetricLabels: Record<AnomalyMetricKey, string> = {
		components: 'Components',
		const: 'Const files',
		type: 'Type files',
		interface: 'Interface files',
		class: 'Class files',
		function: 'Function files'
	};
	const anomalyMetricKeys = Object.keys(anomalyMetricLabels) as AnomalyMetricKey[];
	const componentKeys: (keyof DomainFileComponentMetric)[] = [
		'atoms',
		'molecules',
		'organisms',
		'templates',
		'pages'
	];

	function formatDomainName(value: string): string {
		return value
			.split('-')
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}

	function getPercentage(value: number, max: number): number {
		return max <= 0 ? 0 : Math.round((value / max) * 100);
	}

	function getClusterFileCount(domain: DomainFileMetric, clusterName: string): number {
		return domain.clusters.find((cluster) => cluster.name === clusterName)?.fileCount ?? 0;
	}

	function getComponentTotal(domain: DomainFileMetric): number {
		return componentKeys.reduce((total, key) => total + domain.components[key], 0);
	}

	const anomalyRows = $derived(
		domains.map((domain) => ({
			domain: domain.name,
			components: getComponentTotal(domain),
			const: getClusterFileCount(domain, 'const'),
			type: getClusterFileCount(domain, 'type'),
			interface: getClusterFileCount(domain, 'interface'),
			class: getClusterFileCount(domain, 'class'),
			function: getClusterFileCount(domain, 'function')
		}))
	);
	const anomalyMaxByMetric = $derived({
		components: Math.max(1, ...anomalyRows.map((row) => row.components)),
		const: Math.max(1, ...anomalyRows.map((row) => row.const)),
		type: Math.max(1, ...anomalyRows.map((row) => row.type)),
		interface: Math.max(1, ...anomalyRows.map((row) => row.interface)),
		class: Math.max(1, ...anomalyRows.map((row) => row.class)),
		function: Math.max(1, ...anomalyRows.map((row) => row.function))
	});
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
					{#each anomalyMetricKeys as key, keyIndex (keyIndex)}
						<th>{anomalyMetricLabels[key]}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each anomalyRows as row (row.domain)}
					<tr>
						<th scope="row">
							<span>{formatDomainName(row.domain)}</span>
							<code>{row.domain}</code>
						</th>
						{#each anomalyMetricKeys as key, keyIndex2 (keyIndex2)}
							<td>
								<div
									class="heat-cell"
									style={`--heat: ${getPercentage(row[key], anomalyMaxByMetric[key])}%;`}
									title={`${anomalyMetricLabels[key]}: ${row[key]}`}
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
