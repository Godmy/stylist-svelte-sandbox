/** Reactive behavior of samo-platform-stack; props are read lazily when needed. */
export function createSamoPlatformStackComponentState() {
	let activeLayer = $state(0);
	return {
		get activeLayer(): typeof activeLayer {
			return activeLayer;
		},
		set activeLayer(__nextValue: typeof activeLayer) {
			activeLayer = __nextValue;
		}
	};
}
export default createSamoPlatformStackComponentState;
