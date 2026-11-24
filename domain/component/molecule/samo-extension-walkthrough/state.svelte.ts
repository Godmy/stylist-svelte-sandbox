import type { RecipeSamoExtensionWalkthrough } from '$stylist/domain/interface/recipe/samo-extension-walkthrough';
/** Reactive behavior of samo-extension-walkthrough; props are read lazily when needed. */
export function createSamoExtensionWalkthroughComponentState(
	getProps: () => Pick<RecipeSamoExtensionWalkthrough, 'steps'> & {
		steps: Exclude<RecipeSamoExtensionWalkthrough['steps'], undefined>;
	}
) {
	const props = $derived(getProps());
	const statusMark = { added: '+', changed: '~', untouched: '=' } as const;
	let activeIndex = $state(0);
	const activeStep = $derived(props['steps'][activeIndex] ?? props['steps'][0]);
	return {
		get statusMark(): typeof statusMark {
			return statusMark;
		},
		get activeIndex(): typeof activeIndex {
			return activeIndex;
		},
		set activeIndex(__nextValue: typeof activeIndex) {
			activeIndex = __nextValue;
		},
		get activeStep(): typeof activeStep {
			return activeStep;
		}
	};
}
export default createSamoExtensionWalkthroughComponentState;
