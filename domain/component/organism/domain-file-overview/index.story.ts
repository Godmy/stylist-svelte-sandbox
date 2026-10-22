import DomainFileOverview from '$stylist/domain/component/organism/domain-file-overview/index.svelte';
import type { RecipeDomainFileOverview } from '$stylist/domain/interface/recipe/domain-file-overview';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import domainComponentIntervalsManifest from '$stylist/domain/data/json/domain-component-intervals/index.json';
import domainFilesManifest from '$stylist/domain/data/json/domain-files/index.json';

/** Domain inventory totals and component interval charts. */
export default {
	component: DomainFileOverview,
	title: 'DomainFileOverview',
	description: 'Domain inventory totals and component interval charts.',
	args: {
		manifest: domainFilesManifest,
		componentIntervalsManifest: domainComponentIntervalsManifest
	}
} satisfies ContractStory<RecipeDomainFileOverview>;
