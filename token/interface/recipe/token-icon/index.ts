/** Icon token selector: one value from a visual icon set. */
export interface RecipeTokenIcon {
	title?: string;
	icons?: readonly string[];
	value?: string;
	class?: string;
	onSelect?: (icon: string) => void;
}
