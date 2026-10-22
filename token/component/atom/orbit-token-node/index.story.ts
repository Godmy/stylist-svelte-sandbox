import OrbitTokenNode from '$stylist/token/component/atom/orbit-token-node/index.svelte';
import type { RecipeOrbitTokenNode } from '$stylist/token/interface/recipe/orbit-token-node';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { L6_TOKEN_DEFINITIONS } from '$stylist/token/const/object/orbit-control-definition';

/** Token control node that opens a contextual editor inside the orbit shell. */
export default {
	component: OrbitTokenNode,
	title: 'OrbitTokenNode',
	description: 'Token control node that opens a contextual editor inside the orbit shell.',
	args: {
		id: 'controls',
		icon: 'controls',
		label: 'Controls',
		opened: true,
		definition: L6_TOKEN_DEFINITIONS.controls,
		style: 'transform: rotate(30deg) translate(90px) rotate(-30deg);'
	},
	controls: { opened: { type: 'boolean' }, label: { type: 'text' } },
	presets: {
		Range: {
			id: 'component-size',
			icon: 'component-size',
			label: 'Component Size',
			definition: L6_TOKEN_DEFINITIONS['component-size']
		}
	},
	// The node is absolutely positioned from the center of its orbit stage.
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'position: relative; min-height: 18rem; border: 1px solid #d7dee8; border-radius: 0.5rem; background: #f8fafc;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeOrbitTokenNode>;
