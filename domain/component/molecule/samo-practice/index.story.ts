import SamoPractice from './index.svelte';
import type { RecipeSamoPractice } from '$stylist/domain/interface/recipe/samo-practice';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** The four-step algorithm for a new entity and typical SAMO mistakes. */
export default {
	component: SamoPractice,
	title: 'SamoPractice',
	description: 'The four-step algorithm for a new entity and typical SAMO mistakes.',
	args: {
		eyebrow: 'In practice',
		title: 'Four questions before every new file',
		description:
			'SAMO does not start with components. It starts with four answers — and once the coordinates are right, half of the architectural decisions are already made.',
		closing:
			'If you can explain an entity’s subject area, language form, logical role and place in the dependency pipeline just from its address, it was designed the SAMO way.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		closing: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoPractice>;
