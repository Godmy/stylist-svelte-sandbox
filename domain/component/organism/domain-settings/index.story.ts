import DomainSettings from './index.svelte';
import type { RecipeDomainSettings } from '$stylist/domain/interface/recipe/domain-settings';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Floating theme settings panel of the sandbox. */
export default {
	component: DomainSettings,
	title: 'DomainSettings',
	description: 'Floating theme settings panel opened from the settings button in DomainMenu.',
	args: { open: true },
	controls: { open: { type: 'boolean' } }
} satisfies ContractStory<RecipeDomainSettings>;
