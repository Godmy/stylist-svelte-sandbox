import DomainFileDomainGrid from '$stylist/domain/component/organism/domain-file-domain-grid/index.svelte';
import type { RecipeDomainFileDomainGrid } from '$stylist/domain/interface/recipe/domain-file-domain-grid';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import domainFilesManifest from '$stylist/domain/data/json/domain-files/index.json';

/** Per-domain file and component inventory cards. */
export default {
	component: DomainFileDomainGrid,
	title: 'DomainFileDomainGrid',
	description: 'Per-domain file and component inventory cards.',
	args: { domains: domainFilesManifest.domains }
} satisfies ContractStory<RecipeDomainFileDomainGrid>;
