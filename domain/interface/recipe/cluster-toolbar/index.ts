import type { TokenOrientation } from '$stylist/layout/type/alias/orientation';
export interface RecipeClusterToolbar {
	active?: string;
	availableClusters?: readonly string[];
	orientation?: TokenOrientation;
	showLabel?: boolean;
	onSelect?: (name: string) => void;
	class?: string;
}
