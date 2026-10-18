import TokenRange from './index.svelte';
import type { RecipeTokenRange } from '$stylist/token/interface/recipe/token-range';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { TokenRangeControlDefinition } from '$stylist/token/type/object/range-control-definition';

const definition: TokenRangeControlDefinition = {
	id: 'token-range-font-weight',
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

/** Range control for choosing a numeric token value. */
export default {
	component: TokenRange,
	title: 'Token Range',
	description: 'Range control for choosing a numeric token value.',
	args: { definition, value: 400 },
	controls: { value: { type: 'range', min: 100, max: 900, step: 100 } }
} satisfies ContractStory<RecipeTokenRange>;
