import DomainAiAgent from './index.svelte';
import type { RecipeDomainAiAgent } from '$stylist/domain/interface/recipe/domain-ai-agent';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Floating panel for the AI agent workspace. */
export default {
	component: DomainAiAgent,
	title: 'DomainAiAgent',
	description:
		'Floating panel for the AI agent workspace, opened from the AI button in DomainMenu.',
	args: { open: true, endpoint: '/api/chat' },
	controls: {
		open: { type: 'boolean' },
		endpoint: { type: 'text' },
		systemMessage: { type: 'text' }
	}
} satisfies ContractStory<RecipeDomainAiAgent>;
