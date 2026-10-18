import TokenControlBase from './index.svelte';
import type { RecipeTokenControlBase } from '$stylist/token/interface/recipe/token-control-base';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { HtmlNode } from '$stylist/html/type/alias/html-node';
import type { TokenRadioControlDefinition } from '$stylist/token/type/object/radio-control-definition';

const definition: TokenRadioControlDefinition = {
	id: 'token-control-base-spacing',
	functionalTaxonomy: 'architecture',
	tokenFile: 'architecture/spacing',
	tokenName: 'SPACING',
	controlKind: 'radio',
	description: 'Base spacing values',
	defaultValue: '4px',
	options: [
		{ label: '4px', value: '4px' },
		{ label: '8px', value: '8px' },
		{ label: '12px', value: '12px' },
		{ label: '16px', value: '16px' }
	]
};

const chip =
	'border: 1px solid #cbd5e1; border-radius: 999px; background: #ffffff; padding: 0.3rem 0.65rem; font-size: 0.875rem; color: #334155;';

/** Base shell for rendering a token control with metadata. */
export default {
	component: TokenControlBase,
	title: 'Token Control Base',
	description: 'Base shell for rendering a token control with metadata.',
	args: { definition, layout: 'inline' },
	controls: { layout: { type: 'select', options: ['stack', 'inline'] } },
	presets: { Stack: { layout: 'stack' } },
	content: [
		{
			kind: 'element',
			tag: 'div',
			attrs: { style: 'display: flex; flex-wrap: wrap; gap: 0.5rem;' },
			children: definition.options.map((option): HtmlNode => ({
				kind: 'element',
				tag: 'button',
				attrs: { type: 'button', style: chip },
				children: [{ kind: 'text', value: option.label }]
			}))
		}
	]
} satisfies ContractStory<RecipeTokenControlBase>;
