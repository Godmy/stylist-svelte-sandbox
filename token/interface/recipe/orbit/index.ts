import type { TokenControlDefinition } from '$stylist/token/type/object/token-control-definition';

/** One ring of token nodes placed evenly around the orbit radius. */
export interface RecipeOrbit {
	opened?: boolean;
	radius?: number;
	nodes: readonly {
		id: string;
		icon: string;
		label: string;
		definition: TokenControlDefinition;
	}[];
}
