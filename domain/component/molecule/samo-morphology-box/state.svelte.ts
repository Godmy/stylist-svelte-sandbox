import type { RecipeSamoMorphologyBox } from '$stylist/domain/interface/recipe/samo-morphology-box';
/** Reactive behavior of samo-morphology-box; props are read lazily when needed. */
export function createSamoMorphologyBoxComponentState(
	getProps: () => Pick<RecipeSamoMorphologyBox, 'domains' | 'rows'> & {
		domains: Exclude<RecipeSamoMorphologyBox['domains'], undefined>;
		rows: Exclude<RecipeSamoMorphologyBox['rows'], undefined>;
	}
) {
	const props = $derived(getProps());
	let activeRow = $state(6);
	let activeColumn = $state(4);
	const activeCell = $derived(props['rows'][activeRow]?.cells[activeColumn]);
	const activeAddress = $derived(
		`${props['domains'][activeColumn] ?? ''}/${props['rows'][activeRow]?.cluster ?? ''}/…`
	);
	function selectCell(rowIndex: number, columnIndex: number) {
		activeRow = rowIndex;
		activeColumn = columnIndex;
	}
	return {
		get activeRow(): typeof activeRow {
			return activeRow;
		},
		set activeRow(__nextValue: typeof activeRow) {
			activeRow = __nextValue;
		},
		get activeColumn(): typeof activeColumn {
			return activeColumn;
		},
		set activeColumn(__nextValue: typeof activeColumn) {
			activeColumn = __nextValue;
		},
		get activeCell(): typeof activeCell {
			return activeCell;
		},
		get activeAddress(): typeof activeAddress {
			return activeAddress;
		},
		get selectCell(): typeof selectCell {
			return selectCell;
		}
	};
}
export default createSamoMorphologyBoxComponentState;
