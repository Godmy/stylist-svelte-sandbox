import type { RecipeDomainToolbar } from '$stylist/domain/interface/recipe/domain-toolbar';

/** Reactive behavior of domain-toolbar; props are read lazily when needed. */
export function createDomainToolbarComponentState(
	getProps: () => Pick<RecipeDomainToolbar, 'domains'> & {
		domains: Exclude<RecipeDomainToolbar['domains'], undefined>;
	}
) {
	const props = $derived(getProps());
	const items = $derived.by(() =>
		[...props['domains']].sort((a, b) => a.localeCompare(b)).map((name) => ({ name }))
	);
	return {
		get items(): typeof items {
			return items;
		}
	};
}
export default createDomainToolbarComponentState;
