import DomainComponentImportDiagnostics from '$stylist/domain/component/organism/domain-component-import-diagnostics/index.svelte';
import type { RecipeDomainComponentImportDiagnostics } from '$stylist/domain/interface/recipe/domain-component-import-diagnostics';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import componentImportDiagnosticsManifest from '$stylist/domain/data/json/domain-component-import-diagnostics/index.json';

/** Component import boundary diagnostics generated at build time. */
export default {
	component: DomainComponentImportDiagnostics,
	title: 'DomainComponentImportDiagnostics',
	description: 'Component import boundary diagnostics generated at build time.',
	args: {
		rows: componentImportDiagnosticsManifest.rows,
		summary: componentImportDiagnosticsManifest.summary
	}
} satisfies ContractStory<RecipeDomainComponentImportDiagnostics>;
