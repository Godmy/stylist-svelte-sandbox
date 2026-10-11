import type { TokenSelectControlDefinition } from '$stylist/token/type/object/select-control-definition';
import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';

export interface RecipeTokenSelect {
	definition: TokenSelectControlDefinition;
	value?: TokenValue;
	onChange?: (value: TokenValue) => void;
}
