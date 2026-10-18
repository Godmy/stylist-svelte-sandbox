/** Seed button that toggles the orbit panel; positioned by `style`. */
export interface RecipeCardOpen {
	orbitOpen?: boolean;
	dragging?: boolean;
	style?: string;
	onPointerDown?: (event: PointerEvent) => void;
	onClick?: () => void;
}
