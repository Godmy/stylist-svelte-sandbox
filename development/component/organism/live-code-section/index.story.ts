import LiveCodeSection from './index.svelte';
import type { RecipeLiveCodeSection } from '$stylist/development/interface/recipe/live-code-section';
import type { ContractStory } from '$stylist/html/interface/contract/story';

const sampleCode =
	`<scr` +
	`ipt lang="ts">
  let count = $state(0);
</scr` +
	`ipt>

<button onclick={() => count += 1}>
  Count: {count}
</button>`;

/** Section pairing explanatory copy with a live code preview and call to action. */
export default {
	component: LiveCodeSection,
	title: 'Live Code Section',
	description:
		'Development-domain section pairing explanatory copy with a live code preview and call to action.',
	args: {
		badgeText: 'Live Preview',
		title: 'See It In Action',
		description: 'Every component comes with ready-to-use code',
		ctaText: 'Try in Playground',
		ctaHref: '/playground',
		code: sampleCode
	},
	controls: {
		badgeText: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' },
		ctaText: { type: 'text' },
		ctaHref: { type: 'text' },
		code: { type: 'text' }
	}
} satisfies ContractStory<RecipeLiveCodeSection>;
