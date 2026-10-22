import DomainDiagnostics from '$stylist/domain/component/organism/domain-diagnostics/index.svelte';
import type { RecipeDomainDiagnostics } from '$stylist/domain/interface/recipe/domain-diagnostics';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Story runner that imports and mounts every story module of the workspace. */
export default {
	component: DomainDiagnostics,
	title: 'DomainDiagnostics',
	description: 'Runs story diagnostics by importing and mounting story modules in the workspace.',
	args: { compact: true },
	controls: { compact: { type: 'boolean' } },
	presets: { Full: { compact: false } }
} satisfies ContractStory<RecipeDomainDiagnostics>;
