import type { DomainFileMetric } from '$stylist/domain/type/object/domain-file-metric';
import type { DomainFileComponentMetric } from '$stylist/domain/type/object/domain-file-component-metric';
import type { RecipeDomainClusterBalance } from '$stylist/domain/interface/recipe/domain-cluster-balance';
/** Reactive behavior of domain-cluster-balance; props are read lazily when needed. */
export function createDomainClusterBalanceComponentState(
	getProps: () => Pick<RecipeDomainClusterBalance, 'domains'>
) {
	type AnomalyMetricKey = 'components' | 'const' | 'type' | 'interface' | 'class' | 'function';

	const props = $derived(getProps());
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
		props['domains'].map((domain) => ({
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
	return {
		get anomalyMetricLabels(): typeof anomalyMetricLabels {
			return anomalyMetricLabels;
		},
		get anomalyMetricKeys(): typeof anomalyMetricKeys {
			return anomalyMetricKeys;
		},
		get formatDomainName(): typeof formatDomainName {
			return formatDomainName;
		},
		get getPercentage(): typeof getPercentage {
			return getPercentage;
		},
		get anomalyRows(): typeof anomalyRows {
			return anomalyRows;
		},
		get anomalyMaxByMetric(): typeof anomalyMaxByMetric {
			return anomalyMaxByMetric;
		}
	};
}
export default createDomainClusterBalanceComponentState;
