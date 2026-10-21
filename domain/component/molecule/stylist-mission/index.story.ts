import StylistMission from './index.svelte';
import type { RecipeStylistMission } from '$stylist/domain/interface/recipe/stylist-mission';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Landing mission block; the hrefs are anchors so the preview does not navigate away. */
export default {
	component: StylistMission,
	title: 'StylistMission',
	description: 'Landing mission statement with primary and secondary actions.',
	args: {
		badgeText: 'Our Mission',
		title: 'Make the component library readable before it becomes gigantic.',
		description:
			'The homepage should not just advertise the system. It should compress the architecture into a shape that helps people understand what the library is for and why the workspace exists.',
		primaryLabel: 'Open Domain Workspace',
		primaryHref: '#workspace',
		secondaryLabel: 'Browse Components',
		secondaryHref: '#components'
	},
	controls: {
		badgeText: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		primaryLabel: { type: 'text' },
		secondaryLabel: { type: 'text' }
	}
} satisfies ContractStory<RecipeStylistMission>;
