import SamoUmbrellaMap from '$stylist/domain/component/molecule/samo-umbrella-map/index.svelte';
import type { RecipeSamoUmbrellaMap } from '$stylist/domain/interface/recipe/samo-umbrella-map';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** The umbrella repository: module registry, alias resolution and the nested commit order. */
export default {
	component: SamoUmbrellaMap,
	title: 'SamoUmbrellaMap',
	description:
		'The umbrella repository: module registry, alias resolution and the nested commit order.',
	args: {
		eyebrow: 'Chapter 03',
		title: 'An umbrella over modules',
		description:
			'stylist-svelte is an umbrella repository. The code itself lives in modules — separate Git repositories, each owning a group of domains and keeping its own history. modules.json is the registry that maps every domain to exactly one owner.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoUmbrellaMap>;
