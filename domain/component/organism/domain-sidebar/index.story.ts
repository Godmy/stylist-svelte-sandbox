import DomainSidebar from './index.svelte';
import type { RecipeDomainSidebar } from '$stylist/domain/interface/recipe/domain-sidebar';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Module-aware taxonomy rail of the sandbox explorer. */
export default {
	component: DomainSidebar,
	title: 'DomainSidebar',
	description:
		'Module-aware taxonomy rail: design-system and interaction filter the domain column, followed by clusters, joints and entities.',
	args: {
		availableDomains: ['layout', 'theme', 'button'],
		availableJoints: ['atom', 'molecule', 'organism'],
		draggableEntities: false
	},
	controls: { draggableEntities: { type: 'boolean' } }
} satisfies ContractStory<RecipeDomainSidebar>;
