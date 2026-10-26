import { DOMAIN_CLUSTER } from '$stylist/domain/const/array/domain-cluster';

export function createClusterToolbarItems(
	clusters: readonly string[] = DOMAIN_CLUSTER
): { name: string }[] {
	return [...new Set<string>([...DOMAIN_CLUSTER, ...clusters])]
		.filter((name) => clusters.includes(name))
		.map((name) => ({ name }));
}
