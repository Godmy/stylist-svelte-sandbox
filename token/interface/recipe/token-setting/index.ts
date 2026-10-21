import type { TokenControlDefinition } from '$stylist/token/type/object/token-control-definition';
import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';

/** Token control surface: icon, dependency marker, tooltip and an inline editor. */
export interface RecipeTokenSetting {
	definition: TokenControlDefinition;
	value?: TokenValue;
	showTokenDetails: boolean;
	showDependencies: boolean;
	showTooltip: boolean;
	defaultTokenView: 'radio' | 'select';
	dependencyCount?: number;
	onChange?: (value: TokenValue) => void;
}
