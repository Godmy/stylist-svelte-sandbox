import DomainClusterBalance from '$stylist/domain/component/organism/domain-cluster-balance/index.svelte';
import type { RecipeDomainClusterBalance } from '$stylist/domain/interface/recipe/domain-cluster-balance';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import domainFilesManifest from '$stylist/domain/data/json/domain-files/index.json';

/** Heat table for domain cluster balance. */
export default {
	component: DomainClusterBalance,
	title: 'DomainClusterBalance',
	description: 'Heat table for domain cluster balance.',
	args: { domains: domainFilesManifest.domains }
} satisfies ContractStory<RecipeDomainClusterBalance>;
