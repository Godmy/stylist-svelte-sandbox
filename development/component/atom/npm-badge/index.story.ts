import NpmBadge from '$stylist/development/component/atom/npm-badge/index.svelte';
import type { RecipeNpmBadge } from '$stylist/development/interface/recipe/npm-badge';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { TOKEN_SOFTWARE_BADGE } from '$stylist/development/const/array/software-badge';

/** NPM badge for package information. */
export default {
	component: NpmBadge,
	title: 'NPMBadge',
	description: 'An NPM badge component for displaying package information.',
	args: { type: 'version', value: '1.0.0' },
	controls: {
		type: { type: 'select', options: TOKEN_SOFTWARE_BADGE },
		value: { type: 'text' },
		label: { type: 'text', description: 'Overrides the default label of the badge type.' },
		link: { type: 'text', description: 'Wraps the badge in a link when set.' }
	},
	presets: {
		Downloads: { type: 'downloads', value: '12k/week' },
		License: { type: 'license', value: 'MIT' },
		Linked: { link: 'https://www.npmjs.com/package/stylist-svelte' }
	},
	layout: 'centered'
} satisfies ContractStory<RecipeNpmBadge>;
