import Orbit from '$stylist/token/component/molecule/orbit/index.svelte';
import type { RecipeOrbit } from '$stylist/token/interface/recipe/orbit';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { L6_TOKEN_DEFINITIONS } from '$stylist/token/const/object/orbit-control-definition';

/** Composable orbit molecule that places token nodes around one ring. */
export default {
	component: Orbit,
	title: 'Orbit',
	description: 'Composable orbit molecule that places token nodes around one ring.',
	args: {
		opened: true,
		radius: 112,
		nodes: [
			{
				id: 'component-size',
				icon: 'component-size',
				label: 'Component Size',
				definition: L6_TOKEN_DEFINITIONS['component-size']
			},
			{
				id: 'variants',
				icon: 'variants',
				label: 'Variants',
				definition: L6_TOKEN_DEFINITIONS.variants
			},
			{
				id: 'controls',
				icon: 'controls',
				label: 'Controls',
				definition: L6_TOKEN_DEFINITIONS.controls
			},
			{ id: 'state', icon: 'state', label: 'State', definition: L6_TOKEN_DEFINITIONS.state }
		]
	},
	controls: {
		opened: { type: 'boolean' },
		radius: { type: 'number', min: 72, max: 160 }
	},
	presets: { Closed: { opened: false } },
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'display: grid; place-items: center; min-height: 24rem; border: 1px solid #d7dee8; border-radius: 0.5rem; background: #f8fafc; padding: 2rem;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeOrbit>;
