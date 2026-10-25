import type { TokenControlDefinition } from '$stylist/token/type/object/token-control-definition';
import type { TokenIconName } from '$stylist/svg/type/alias/icon-name';

/** Orbit node that opens a token control editor in a popover. */
export interface RecipeOrbitTokenNode {
	id: string;
	icon: TokenIconName;
	label: string;
	opened?: boolean;
	style?: string;
	definition: TokenControlDefinition;
}
