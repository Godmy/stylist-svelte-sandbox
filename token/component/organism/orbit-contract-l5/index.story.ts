import OrbitContractL5 from './index.svelte';
import type { RecipeOrbitContractL5 } from '$stylist/token/interface/recipe/orbit-contract-l5';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Orbit contract view for L5 graph-node controls across architecture, information, and interaction tiers. */
export default {
	component: OrbitContractL5,
	title: 'OrbitContractL5',
	description:
		'Orbit contract view for L5 graph-node controls across architecture, information, and interaction tiers.',
	args: { opened: true, showCore: true, showCaption: true },
	controls: {
		opened: { type: 'boolean' },
		showCore: { type: 'boolean' },
		showCaption: { type: 'boolean' }
	},
	presets: { Closed: { opened: false } },
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'display: grid; place-items: center; min-height: 26rem; border: 1px solid #d7dee8; border-radius: 0.5rem; background: #f8fafc; padding: 2.5rem;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeOrbitContractL5>;
