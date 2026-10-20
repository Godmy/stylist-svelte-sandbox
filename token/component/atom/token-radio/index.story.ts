import TokenRadio from './index.svelte';
import type { RecipeTokenRadio } from '$stylist/token/interface/recipe/token-radio';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { TokenRadioControlDefinition } from '$stylist/token/type/object/radio-control-definition';

const definition: TokenRadioControlDefinition = {
	id: 'token-radio-alignment',
	functionalTaxonomy: 'architecture',
	tokenFile: 'architecture/alignment',
	tokenName: 'TOKEN_ALIGNMENT',
	controlKind: 'radio',
	description: 'Element alignment',
	defaultValue: 'center',
	options: [
		{ label: 'Start', value: 'start' },
		{ label: 'Center', value: 'center' },
		{ label: 'End', value: 'end' },
		{ label: 'Stretch', value: 'stretch' }
	]
};

/** Radio control for choosing one value from a token option set. */
export default {
	component: TokenRadio,
	title: 'Token Radio',
	description: 'Radio control for choosing one value from a token option set.',
	args: { definition, value: 'center' },
	controls: {
		// The values of the definition options (no shared alignment token has start/end/stretch).
		value: { type: 'select', options: definition.options.map((option) => String(option.value)) }
	}
} satisfies ContractStory<RecipeTokenRadio>;
