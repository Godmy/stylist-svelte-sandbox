import TokenSelect from './index.svelte';
import type { RecipeTokenSelect } from '$stylist/token/interface/recipe/token-select';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { TokenSelectControlDefinition } from '$stylist/token/type/object/select-control-definition';

const definition: TokenSelectControlDefinition = {
	id: 'token-select-font-family',
	functionalTaxonomy: 'information',
	tokenFile: 'information/font-family',
	tokenName: 'FONT_FAMILY',
	controlKind: 'select',
	description: 'Text font family',
	defaultValue: 'inter',
	options: [
		{ label: 'Inter', value: 'inter' },
		{ label: 'Roboto', value: 'roboto' },
		{ label: 'Open Sans', value: 'open-sans' },
		{ label: 'Lato', value: 'lato' },
		{ label: 'Montserrat', value: 'montserrat' }
	]
};

/** Select control for choosing a token value from a dropdown list. */
export default {
	component: TokenSelect,
	title: 'Token Select',
	description: 'Select control for choosing a token value from a dropdown list.',
	args: { definition, value: 'inter' },
	controls: {
		value: { type: 'select', options: definition.options.map((option) => String(option.value)) }
	}
} satisfies ContractStory<RecipeTokenSelect>;
