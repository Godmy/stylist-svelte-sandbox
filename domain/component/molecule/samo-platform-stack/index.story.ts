import SamoPlatformStack from '$stylist/domain/component/molecule/samo-platform-stack/index.svelte';
import type { RecipeSamoPlatformStack } from '$stylist/domain/interface/recipe/samo-platform-stack';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Platform layers, public modules and the npm package boundary. */
export default {
	component: SamoPlatformStack,
	title: 'SamoPlatformStack',
	description: 'Platform layers, public modules and the npm package boundary.',
	args: {
		eyebrow: 'Chapter 05',
		title: 'The platform',
		description:
			'Stylist is not a folder of widgets. It is four layers that each answer one question — what runs, how it looks, who owns which code, and what keeps all of it honest.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoPlatformStack>;
