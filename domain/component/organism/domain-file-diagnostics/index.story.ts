import DomainFileDiagnostics from '$stylist/domain/component/organism/domain-file-diagnostics/index.svelte';
import type { RecipeDomainFileDiagnostics } from '$stylist/domain/interface/recipe/domain-file-diagnostics';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Domain-level file inventory generated from the domain-files manifest. */
export default {
	component: DomainFileDiagnostics,
	title: 'DomainFileDiagnostics',
	description: 'Domain-level file inventory generated from domain-files manifest.',
	args: {}
} satisfies ContractStory<RecipeDomainFileDiagnostics>;
