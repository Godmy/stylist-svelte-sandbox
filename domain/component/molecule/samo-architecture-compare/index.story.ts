import SamoArchitectureCompare from './index.svelte';
import type { RecipeSamoArchitectureCompare } from '$stylist/domain/interface/recipe/samo-architecture-compare';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Token avalanche, before/after comparison and AGENTS.md governance rules. */
export default {
	component: SamoArchitectureCompare,
	title: 'SamoArchitectureCompare',
	description: 'Token avalanche, before/after comparison and AGENTS.md governance rules.',
	args: {
		eyebrow: 'Architecture & governance',
		title: 'Architecture as a control mechanism',
		description:
			'AI agents are limited by their context window. Large files are the bottleneck: every extra read costs tokens and release time, and every unclear boundary invites the agent to improvise. SAMO keeps files microscopic and puts a governance loop around them.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoArchitectureCompare>;
