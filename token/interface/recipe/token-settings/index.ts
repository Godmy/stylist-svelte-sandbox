import type { TOKEN_SETTING } from '$stylist/token/const/object/token-setting';

/** Registry browser of the token settings with search, domain filter and columns. */
export interface RecipeTokenSettings {
	settings?: typeof TOKEN_SETTING;
	title?: string;
	columns?: number;
	showColumnControl?: boolean;
}
