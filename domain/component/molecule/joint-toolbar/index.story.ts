import JointToolbar from './index.svelte';
import type { RecipeJointToolbar } from '$stylist/domain/interface/recipe/joint-toolbar';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';
import { JOINT_TOOLBAR_ITEMS } from '$stylist/domain/const/value/joint-toolbar-items';

const availableJoints = ['atom', 'molecule', 'organism'];

/** Joint selector; index.story.svelte keeps the active joint onSelect reports. */
export default {
	component: JointToolbar,
	title: 'JointToolbar',
	description: 'Joint-level selector filtered by the currently active cluster.',
	args: { availableJoints, active: 'atom', orientation: TOKEN_ORIENTATION[0], showLabel: true },
	controls: {
		active: { type: 'select', options: JOINT_TOOLBAR_ITEMS.map((item) => item.name) },
		orientation: { type: 'select', options: TOKEN_ORIENTATION },
		showLabel: { type: 'boolean' }
	},
	presets: {
		'Interface cluster': {
			availableJoints: ['behavior', 'slot', 'recipe', 'contract'],
			active: 'recipe'
		},
		'No joints': { availableJoints: [], active: undefined }
	}
} satisfies ContractStory<RecipeJointToolbar>;
