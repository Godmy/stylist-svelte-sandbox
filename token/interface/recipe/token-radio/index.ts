import type { TokenRadioControlDefinition } from '$stylist/token/type/object/radio-control-definition';
import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';

export interface RecipeTokenRadio {
	definition: TokenRadioControlDefinition;
	value?: TokenValue;
	onChange?: (value: TokenValue) => void;
}
