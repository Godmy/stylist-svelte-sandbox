import type { RecipeSamoUmbrellaMap } from '$stylist/domain/interface/recipe/samo-umbrella-map';
/** Reactive behavior of samo-umbrella-map; props are read lazily when needed. */
export function createSamoUmbrellaMapComponentState(
	getProps: () => Pick<RecipeSamoUmbrellaMap, 'modules'> & {
		modules: Exclude<RecipeSamoUmbrellaMap['modules'], undefined>;
	}
) {
	const props = $derived(getProps());
	let activeIndex = $state(0);
	const activeModule = $derived(props['modules'][activeIndex] ?? props['modules'][0]);
	const publicCount = $derived(
		props['modules'].filter((module) => module.visibility === 'public').length
	);
	return {
		get activeIndex(): typeof activeIndex {
			return activeIndex;
		},
		set activeIndex(__nextValue: typeof activeIndex) {
			activeIndex = __nextValue;
		},
		get activeModule(): typeof activeModule {
			return activeModule;
		},
		get publicCount(): typeof publicCount {
			return publicCount;
		}
	};
}
export default createSamoUmbrellaMapComponentState;
