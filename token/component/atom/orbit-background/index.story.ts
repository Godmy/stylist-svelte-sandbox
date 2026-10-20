import OrbitBackground from './index.svelte';
import type { RecipeOrbitBackground } from '$stylist/token/interface/recipe/orbit-background';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Concentric orbit stage used to host token control nodes. */
export default {
	component: OrbitBackground,
	title: 'OrbitBackground',
	description: 'Concentric orbit stage used to host token control nodes.',
	args: { opened: true },
	controls: { opened: { type: 'boolean' } },
	content: [
		{
			kind: 'element',
			tag: 'div',
			attrs: {
				style:
					'border: 1px solid #bae6fd; border-radius: 9999px; background: rgba(255, 255, 255, 0.9); padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; color: #334155;'
			},
			children: [{ kind: 'text', value: 'Orbit center' }]
		}
	],
	layout: 'centered'
} satisfies ContractStory<RecipeOrbitBackground>;
