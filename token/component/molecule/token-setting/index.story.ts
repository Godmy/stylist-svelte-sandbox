import TokenSetting from './index.svelte';
import type { RecipeTokenSetting } from '$stylist/token/interface/recipe/token-setting';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { L6_TOKEN_DEFINITIONS } from '$stylist/token/const/object/orbit-control-definition';

const { variants, controls, 'component-size': componentSize } = L6_TOKEN_DEFINITIONS;

/** Token control surface with icon, dependency marker, tooltip, and inline editor. */
export default {
	component: TokenSetting,
	title: 'TokenSetting',
	description: 'Token control surface with icon, dependency marker, tooltip, and inline editor.',
	args: {
		definition: variants,
		value: variants.defaultValue,
		showTokenDetails: true,
		showDependencies: true,
		showTooltip: true,
		defaultTokenView: 'radio',
		dependencyCount: 3
	},
	controls: {
		showTokenDetails: { type: 'boolean' },
		showDependencies: { type: 'boolean' },
		showTooltip: { type: 'boolean' },
		defaultTokenView: { type: 'select', options: ['radio', 'select'] }
	},
	// The legacy definitionKey select becomes one preset per L6 definition.
	presets: {
		ComponentSize: { definition: componentSize, value: componentSize.defaultValue },
		Controls: { definition: controls, value: controls.defaultValue }
	},
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'border-radius: 1.5rem; background: linear-gradient(180deg, #eff6ff, #f8fafc); padding: 1.5rem;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeTokenSetting>;
