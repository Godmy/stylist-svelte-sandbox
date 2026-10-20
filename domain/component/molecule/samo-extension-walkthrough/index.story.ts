import SamoExtensionWalkthrough from './index.svelte';
import type { RecipeSamoExtensionWalkthrough } from '$stylist/domain/interface/recipe/samo-extension-walkthrough';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Open/Closed walkthrough: adding a notification counter to a real button recipe. */
export default {
	component: SamoExtensionWalkthrough,
	title: 'SamoExtensionWalkthrough',
	description: 'Open/Closed walkthrough: adding a notification counter to a real button recipe.',
	args: {
		eyebrow: 'Chapter 02',
		title: 'Extending without breaking',
		description:
			'Open/Closed is easy to state and hard to keep. In SAMO a new capability arrives as a new file and a one-line composition — the core of every existing component stays closed. Walk through a real extension from this repository.',
		task: 'Give buttons a notification counter'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		task: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoExtensionWalkthrough>;
