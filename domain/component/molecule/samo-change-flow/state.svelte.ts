import type { RecipeSamoChangeFlow } from '$stylist/domain/interface/recipe/samo-change-flow';
/** Reactive behavior of samo-change-flow; props are read lazily when needed. */
export function createSamoChangeFlowComponentState(
	getProps: () => Pick<RecipeSamoChangeFlow, 'steps'> & {
		steps: Exclude<RecipeSamoChangeFlow['steps'], undefined>;
	}
) {
	const props = $derived(getProps());
	let activeIndex = $state(0);
	let playing = $state(false);
	const activeStep = $derived(props['steps'][activeIndex] ?? props['steps'][0]);
	$effect(() => {
		if (!playing) return;
		const timer = setInterval(() => {
			if (activeIndex >= props['steps'].length - 1) {
				playing = false;
				return;
			}
			activeIndex += 1;
		}, 1800);
		return () => clearInterval(timer);
	});
	function togglePlay() {
		if (!playing && activeIndex >= props['steps'].length - 1) activeIndex = 0;
		playing = !playing;
	}
	function selectStep(index: number) {
		playing = false;
		activeIndex = index;
	}
	return {
		get activeIndex(): typeof activeIndex {
			return activeIndex;
		},
		set activeIndex(__nextValue: typeof activeIndex) {
			activeIndex = __nextValue;
		},
		get playing(): typeof playing {
			return playing;
		},
		set playing(__nextValue: typeof playing) {
			playing = __nextValue;
		},
		get activeStep(): typeof activeStep {
			return activeStep;
		},
		get togglePlay(): typeof togglePlay {
			return togglePlay;
		},
		get selectStep(): typeof selectStep {
			return selectStep;
		}
	};
}
export default createSamoChangeFlowComponentState;
