import type { RecipeSamoNestedMethods } from '$stylist/domain/interface/recipe/samo-nested-methods';
/** Reactive behavior of samo-nested-methods; props are read lazily when needed. */
export function createSamoNestedMethodsComponentState(
	getProps: () => Pick<RecipeSamoNestedMethods, 'methods'> & {
		methods: Exclude<RecipeSamoNestedMethods['methods'], undefined>;
	}
) {
	const props = $derived(getProps());
	let activeId = $state('');
	const activeMethod = $derived(
		props['methods'].find((method) => method.id === activeId) ?? props['methods'][0]
	);
	return {
		get activeId(): typeof activeId {
			return activeId;
		},
		set activeId(__nextValue: typeof activeId) {
			activeId = __nextValue;
		},
		get activeMethod(): typeof activeMethod {
			return activeMethod;
		}
	};
}
export default createSamoNestedMethodsComponentState;
