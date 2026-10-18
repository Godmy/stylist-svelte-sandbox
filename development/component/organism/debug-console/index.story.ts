import DebugConsole from './index.svelte';
import type { RecipeDebugConsole } from '$stylist/development/interface/recipe/debug-console';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Interactive debug console; index.story.svelte supplies the shared log state. */
export default {
	component: DebugConsole,
	title: 'DebugConsole',
	description: 'Interactive debug console with customizable options.',
	args: {
		title: 'Debug Console',
		showTimestamps: true,
		showLogLevel: true,
		allowFilter: true,
		allowClear: true,
		maxHeight: '300px'
	},
	controls: {
		title: { type: 'text' },
		showTimestamps: { type: 'boolean' },
		showLogLevel: { type: 'boolean' },
		allowFilter: { type: 'boolean' },
		allowClear: { type: 'boolean' },
		maxHeight: { type: 'text' }
	}
} satisfies ContractStory<RecipeDebugConsole>;
