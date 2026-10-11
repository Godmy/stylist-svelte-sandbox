import type { Token } from '$stylist/token/type/object/token';
import { TOKEN_COLOR_TONE } from '$stylist/design-token/const/array/color-tone';
import { TOKEN_THEME_MODE } from '$stylist/theme/const/array/theme-mode';
import { TOKEN_THEME_SCHEME } from '$stylist/theme/const/array/theme-scheme';
import { TOKEN_TOKEN_VALUE } from '$stylist/design-token/const/array/token-value';

export const TOKEN_THEME_SETTING = [
	{
		key: 'theme-mode',
		label: 'Theme Mode',
		domain: 'theme',
		controlKind: 'radio',
		values: TOKEN_THEME_MODE
	},
	{
		key: 'theme-scheme',
		label: 'Theme Scheme',
		domain: 'theme',
		controlKind: 'radio',
		values: TOKEN_THEME_SCHEME
	},
	{
		key: 'theme-tone',
		label: 'Theme Tone',
		domain: 'theme',
		controlKind: 'radio',
		values: TOKEN_COLOR_TONE
	},
	{
		key: 'token-value',
		label: 'Token Value',
		domain: 'theme',
		controlKind: 'radio',
		values: TOKEN_TOKEN_VALUE
	}
] satisfies readonly Token[];
