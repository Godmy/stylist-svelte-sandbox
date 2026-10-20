import ClusterToolbar from './index.svelte';
import type { RecipeClusterToolbar } from '$stylist/domain/interface/recipe/cluster-toolbar';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { DOMAIN_CLUSTER } from '$stylist/domain/const/array/domain-cluster';
import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';

/** Cluster switcher; index.story.svelte keeps the active cluster onSelect reports. */
export default {
	component: ClusterToolbar,
	title: 'ClusterToolbar',
	description: 'Cluster switcher backed by the shared icon toolbar.',
	args: { active: 'component', orientation: TOKEN_ORIENTATION[0], showLabel: true },
	controls: {
		active: { type: 'select', options: DOMAIN_CLUSTER },
		orientation: { type: 'select', options: TOKEN_ORIENTATION },
		showLabel: { type: 'boolean' }
	},
	presets: { Vertical: { orientation: TOKEN_ORIENTATION[1] } }
} satisfies ContractStory<RecipeClusterToolbar>;
