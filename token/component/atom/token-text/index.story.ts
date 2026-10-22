import TokenText from '$stylist/token/component/atom/token-text/index.svelte';
import type { RecipeTokenText } from '$stylist/token/interface/recipe/token-text';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { TokenTextControlDefinition } from '$stylist/token/type/object/text-control-definition';

const definition: TokenTextControlDefinition = {
	id: 'token-text-line-height',
	functionalTaxonomy: 'information',
	tokenFile: 'information/line-height',
	tokenName: 'LINE_HEIGHT',
	controlKind: 'text',
	description: 'Line height',
	defaultValue: '1.5',
	placeholder: 'For example: 1.5'
};

/** Text control for entering a token value. */
export default {
	component: TokenText,
	title: 'Token Text',
	description: 'Text control for entering a token value.',
	args: { definition, value: '1.5' },
	controls: { value: { type: 'text' }, placeholder: { type: 'text' } }
} satisfies ContractStory<RecipeTokenText>;
