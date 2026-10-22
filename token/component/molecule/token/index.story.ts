import TokenControlComposer from '$stylist/token/component/molecule/token/index.svelte';
import type { RecipeToken } from '$stylist/token/interface/recipe/token';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { TokenRadioControlDefinition } from '$stylist/token/type/object/radio-control-definition';
import type { TokenRangeControlDefinition } from '$stylist/token/type/object/range-control-definition';
import type { TokenSelectControlDefinition } from '$stylist/token/type/object/select-control-definition';
import type { TokenTextControlDefinition } from '$stylist/token/type/object/text-control-definition';

const radioDefinition: TokenRadioControlDefinition = {
	id: 'token-composer-alignment',
	functionalTaxonomy: 'architecture',
	tokenFile: 'architecture/alignment',
	tokenName: 'TOKEN_ALIGNMENT',
	controlKind: 'radio',
	description: 'Element alignment',
	defaultValue: 'start',
	options: [
		{ label: 'Start', value: 'start' },
		{ label: 'Center', value: 'center' },
		{ label: 'End', value: 'end' }
	]
};

const selectDefinition: TokenSelectControlDefinition = {
	id: 'token-composer-font-family',
	functionalTaxonomy: 'information',
	tokenFile: 'information/font-family',
	tokenName: 'FONT_FAMILY',
	controlKind: 'select',
	description: 'Text font family',
	defaultValue: 'inter',
	options: [
		{ label: 'Inter', value: 'inter' },
		{ label: 'Roboto', value: 'roboto' },
		{ label: 'Open Sans', value: 'open-sans' }
	]
};

const rangeDefinition: TokenRangeControlDefinition = {
	id: 'token-composer-font-weight',
	functionalTaxonomy: 'information',
	tokenFile: 'information/font-weight',
	tokenName: 'FONT_WEIGHT',
	controlKind: 'range',
	description: 'Font weight',
	defaultValue: 400,
	min: 100,
	max: 900,
	step: 100
};

const textDefinition: TokenTextControlDefinition = {
	id: 'token-composer-line-height',
	functionalTaxonomy: 'information',
	tokenFile: 'information/line-height',
	tokenName: 'LINE_HEIGHT',
	controlKind: 'text',
	description: 'Line height',
	defaultValue: '1.5',
	placeholder: 'For example: 1.5'
};

/** Token control composer that selects the matching control type automatically. */
export default {
	component: TokenControlComposer,
	title: 'Token Control Composer',
	description: 'Token control composer that selects the matching control type automatically.',
	args: { definition: radioDefinition },
	controls: {},
	// One preset per control kind the composer dispatches to.
	presets: {
		Radio: { definition: radioDefinition },
		Select: { definition: selectDefinition },
		Range: { definition: rangeDefinition },
		Text: { definition: textDefinition }
	},
	context: {
		kind: 'element',
		tag: 'div',
		attrs: {
			style:
				'display: grid; gap: 1rem; max-width: 42rem; border: 1px solid #d7dee8; border-radius: 0.5rem; background: #f8fafc; padding: 1.25rem;'
		},
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeToken>;
