import DomainDescriptorPanel from './index.svelte';
import type { RecipeDomainDescriptorPanel } from '$stylist/token/interface/recipe/domain-descriptor-panel';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Orbit panel summarizing a component descriptor's architecture, information, interaction, controls, and contracts. */
export default {
	component: DomainDescriptorPanel,
	title: 'DomainDescriptorPanel',
	description:
		"Orbit panel summarizing a component descriptor's architecture, information, interaction, controls, and contracts.",
	args: {
		descriptor: {
			entityPath: 'commerce/component/molecule/price-tag',
			domain: 'commerce',
			cluster: 'component',
			joint: 'molecule',
			family: 'price-tag',
			componentModulePath: 'commerce/component/molecule/price-tag/index.svelte',
			recipeTypePath: 'commerce/interface/recipe/price-tag/index.ts',
			stateFunctionPath: null,
			jsonPaths: [],
			contractPaths: [],
			interfaceRecipeJsonPaths: [],
			constEnumJsonPaths: [],
			constMapJsonPaths: [],
			functionStateJsonPaths: [],
			functionScriptJsonPaths: [],
			controlDefinitionJsonPaths: [],
			hasRecipePipeline: true,
			hasStatePipeline: false,
			hasStoryPreview: true,
			storyModulePath: 'commerce/component/molecule/price-tag/index.story.svelte'
		}
	},
	controls: {},
	context: {
		kind: 'element',
		tag: 'div',
		attrs: { style: 'max-width: 44rem;' },
		children: [{ kind: 'outlet' }]
	}
} satisfies ContractStory<RecipeDomainDescriptorPanel>;
