import type { Token } from '$stylist/token/type/object/token';
import { TOKEN_FONT_SIZE } from '$stylist/design-token/const/object/font-size';
import { TOKEN_FONT_WEIGHT } from '$stylist/design-token/const/object/font-weight';
import { TOKEN_COLOR_TONE } from '$stylist/design-token/const/array/color-tone';

export const TOKEN_TYPOGRAPHY_SETTING = [
	{
		key: 'font-size',
		label: 'Font Size',
		domain: 'typography',
		controlKind: 'radio',
		values: Object.keys(TOKEN_FONT_SIZE)
	},
	{
		key: 'font-weight',
		label: 'Font Weight',
		domain: 'typography',
		controlKind: 'radio',
		values: Object.keys(TOKEN_FONT_WEIGHT)
	},
	{
		key: 'tone',
		label: 'Tone',
		domain: 'typography',
		controlKind: 'radio',
		values: TOKEN_COLOR_TONE
	}
] satisfies readonly Token[];
