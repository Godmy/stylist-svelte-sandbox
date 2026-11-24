import type { RecipeSamoOverview } from '$stylist/domain/interface/recipe/samo-overview';
/** Reactive behavior of samo-overview; props are read lazily when needed. */
export function createSamoOverviewComponentState(
	getProps: () => Pick<RecipeSamoOverview, 'coordinates' | 'addresses'> & {
		coordinates: Exclude<RecipeSamoOverview['coordinates'], undefined>;
		addresses: Exclude<RecipeSamoOverview['addresses'], undefined>;
	}
) {
	const props = $derived(getProps());
	let activeAddressIndex = $state(0);
	let activeCoordinateIndex = $state(0);
	const activeAddress = $derived(props['addresses'][activeAddressIndex] ?? props['addresses'][0]);
	const activeCoordinate = $derived(
		props['coordinates'][activeCoordinateIndex] ?? props['coordinates'][0]
	);
	const addressSegments = $derived(
		activeAddress
			? [activeAddress.domain, activeAddress.cluster, activeAddress.joint, activeAddress.family]
			: []
	);
	const logicalImport = $derived(`$stylist/${addressSegments.join('/')}`);
	return {
		get activeAddressIndex(): typeof activeAddressIndex {
			return activeAddressIndex;
		},
		set activeAddressIndex(__nextValue: typeof activeAddressIndex) {
			activeAddressIndex = __nextValue;
		},
		get activeCoordinateIndex(): typeof activeCoordinateIndex {
			return activeCoordinateIndex;
		},
		set activeCoordinateIndex(__nextValue: typeof activeCoordinateIndex) {
			activeCoordinateIndex = __nextValue;
		},
		get activeAddress(): typeof activeAddress {
			return activeAddress;
		},
		get activeCoordinate(): typeof activeCoordinate {
			return activeCoordinate;
		},
		get addressSegments(): typeof addressSegments {
			return addressSegments;
		},
		get logicalImport(): typeof logicalImport {
			return logicalImport;
		}
	};
}
export default createSamoOverviewComponentState;
