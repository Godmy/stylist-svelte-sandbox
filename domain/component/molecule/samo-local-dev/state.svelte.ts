import type { RecipeSamoLocalDev } from '$stylist/domain/interface/recipe/samo-local-dev';
/** Reactive behavior of samo-local-dev; props are read lazily when needed. */
export function createSamoLocalDevComponentState(
	getProps: () => Pick<RecipeSamoLocalDev, 'scenarios'> & {
		scenarios: Exclude<RecipeSamoLocalDev['scenarios'], undefined>;
	}
) {
	const props = $derived(getProps());
	let activeId = $state('');
	const activeScenario = $derived(
		props['scenarios'].find((scenario) => scenario.id === activeId) ?? props['scenarios'][0]
	);
	return {
		get activeId(): typeof activeId {
			return activeId;
		},
		set activeId(__nextValue: typeof activeId) {
			activeId = __nextValue;
		},
		get activeScenario(): typeof activeScenario {
			return activeScenario;
		}
	};
}
export default createSamoLocalDevComponentState;
