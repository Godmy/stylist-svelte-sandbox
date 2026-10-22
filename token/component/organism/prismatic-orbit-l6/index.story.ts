import PrismaticOrbitL6 from '$stylist/token/component/organism/prismatic-orbit-l6/index.svelte';
import type { RecipePrismaticOrbitL6 } from '$stylist/token/interface/recipe/prismatic-orbit-l6';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Interactive L6 shell combining movable seed, orbit layers, and expandable control card. */
export default {
	component: PrismaticOrbitL6,
	title: 'PrismaticOrbitL6',
	description:
		'Interactive L6 shell combining movable seed, orbit layers, and expandable control card.',
	args: {},
	controls: {},
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'min-height: 20rem; overflow: visible; border: 1px solid #d7dee8; border-radius: 0.5rem; background: #f8fafc; padding: 2rem;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipePrismaticOrbitL6>;
