import type { TokenControlDefinition } from '$stylist/token/type/object/token-control-definition';

/** Orbit node that opens a token control editor in a popover. */
export interface RecipeOrbitTokenNode {
	id: string;
	icon: string;
	label: string;
	opened?: boolean;
	style?: string;
	definition: TokenControlDefinition;
}
