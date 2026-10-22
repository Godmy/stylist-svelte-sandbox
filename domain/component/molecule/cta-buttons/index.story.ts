import CtaButtons from '$stylist/domain/component/molecule/cta-buttons/index.svelte';
import type { RecipeCtaButtons } from '$stylist/domain/interface/recipe/cta-buttons';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Landing call-to-action cards; the hrefs are anchors so the preview does not navigate away. */
export default {
	component: CtaButtons,
	title: 'CtaButtons',
	description:
		'Pair of call-to-action cards that lead to the component library and the playground.',
	args: {
		componentsHref: '#components',
		playgroundHref: '#playground',
		componentsTitle: 'Explore Components',
		componentsDescription:
			'Discover reusable UI components, organized examples, documentation, and source code.',
		componentsActionLabel: 'Browse Library',
		playgroundTitle: 'Interactive Playground',
		playgroundDescription:
			'Experiment with components, explore their behavior, and learn from working examples.',
		playgroundActionLabel: 'Start Exploring'
	},
	controls: {
		componentsTitle: { type: 'text' },
		componentsDescription: { type: 'text' },
		componentsActionLabel: { type: 'text' },
		playgroundTitle: { type: 'text' },
		playgroundDescription: { type: 'text' },
		playgroundActionLabel: { type: 'text' }
	}
} satisfies ContractStory<RecipeCtaButtons>;
