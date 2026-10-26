import { TOKEN_FONT_FAMILY } from '$stylist/design-token/const/object/font-family';
import { TOKEN_FONT_SIZE } from '$stylist/design-token/const/object/font-size';
import { TOKEN_LINE_HEIGHT } from '$stylist/design-token/const/object/line-height';
import { DESIGN_TOKEN_DENSITY } from '$stylist/design-token/const/preset/density';

export const PREVIEW_CONTROLS = {
	skin: { type: 'boolean', label: 'HTML skin' },
	mode: { type: 'select', label: 'Preview theme', options: ['light', 'dark'] },
	fontFamily: { type: 'select', label: 'Font family', options: Object.keys(TOKEN_FONT_FAMILY) },
	fontSize: { type: 'select', label: 'Body font size', options: Object.keys(TOKEN_FONT_SIZE) },
	lineHeight: { type: 'select', label: 'Line height', options: Object.keys(TOKEN_LINE_HEIGHT) },
	density: { type: 'select', label: 'Density', options: Object.keys(DESIGN_TOKEN_DENSITY) },
	locale: {
		type: 'select',
		label: 'Language',
		options: ['en', 'ru', 'ka', 'es', 'zh', 'hi', 'ar', 'he']
	}
} as const;
