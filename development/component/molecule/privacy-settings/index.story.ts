import PrivacySettings from './index.svelte';
import type { RecipePrivacySettings } from '$stylist/development/interface/recipe/privacy-settings';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Toggleable privacy preferences with explicit save action. */
export default {
	component: PrivacySettings,
	title: 'PrivacySettings',
	description: 'Toggleable privacy preferences with explicit save action.',
	args: {
		settings: [
			{
				id: 'analytics',
				label: 'Usage analytics',
				description: 'Share anonymous usage stats',
				enabled: true
			},
			{
				id: 'ads',
				label: 'Personalized ads',
				description: 'Allow ad personalization',
				enabled: false
			},
			{
				id: 'location',
				label: 'Location access',
				description: 'Allow location-based features',
				enabled: true
			}
		]
	}
} satisfies ContractStory<RecipePrivacySettings>;
