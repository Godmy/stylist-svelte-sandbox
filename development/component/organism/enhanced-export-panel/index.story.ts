import EnhancedExportPanel from '$stylist/development/component/organism/enhanced-export-panel/index.svelte';
import type { RecipeEnhancedExportPanel } from '$stylist/development/interface/recipe/enhanced-export-panel';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Export panel for generated component code, props, and package options. */
export default {
	component: EnhancedExportPanel,
	title: 'Enhanced Export Panel',
	description:
		'Development-domain export panel for generated component code, props, and package options.',
	args: {
		componentName: 'Button',
		svelteCode: "<button class='btn'>Click me</button>",
		props: { variant: 'primary' }
	},
	controls: {
		componentName: { type: 'text' },
		svelteCode: { type: 'text' }
	}
} satisfies ContractStory<RecipeEnhancedExportPanel>;
