import SamoLocalDev from '$stylist/domain/component/molecule/samo-local-dev/index.svelte';
import type { RecipeSamoLocalDev } from '$stylist/domain/interface/recipe/samo-local-dev';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Local development scenarios: the library, a consuming site, a private package and module selection. */
export default {
	component: SamoLocalDev,
	title: 'SamoLocalDev',
	description:
		'Local development scenarios: the library, a consuming site, a private package and module selection.',
	args: {
		eyebrow: 'Chapter 04',
		title: 'Local development: connecting your packages',
		description:
			'Sites consume Stylist from source, not from a built dist. A Yarn portal links the package, and the same moduleAliases() that powers the sandbox maps every $stylist/<domain> import to its owning module — so an edit in any module hot-reloads straight into the site.'
	},
	controls: {
		eyebrow: { type: 'text' },
		title: { type: 'text' },
		description: { type: 'text' }
	}
} satisfies ContractStory<RecipeSamoLocalDev>;
