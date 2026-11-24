import type { RecipeSamoAssemblyPipeline } from '$stylist/domain/interface/recipe/samo-assembly-pipeline';

/** Reactive behavior of samo-assembly-pipeline; props are read lazily when needed. */
export function createSamoAssemblyPipelineComponentState(
	getProps: () => Pick<RecipeSamoAssemblyPipeline, 'clusters'> & {
		clusters: Exclude<RecipeSamoAssemblyPipeline['clusters'], undefined>;
	}
) {
	const props = $derived(getProps());
	let activeIndex = $state(3);
	const activeCluster = $derived(props['clusters'][activeIndex] ?? props['clusters'][0]);
	const allowedSources = $derived(
		props['clusters'].slice(0, activeIndex).map((cluster) => cluster.name)
	);
	return {
		get activeIndex(): typeof activeIndex {
			return activeIndex;
		},
		set activeIndex(__nextValue: typeof activeIndex) {
			activeIndex = __nextValue;
		},
		get activeCluster(): typeof activeCluster {
			return activeCluster;
		},
		get allowedSources(): typeof allowedSources {
			return allowedSources;
		}
	};
}
export default createSamoAssemblyPipelineComponentState;
