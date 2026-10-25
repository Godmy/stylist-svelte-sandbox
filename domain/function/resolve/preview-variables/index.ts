import { TOKEN_FONT_FAMILY } from '$stylist/design-token/const/object/font-family';
import { TOKEN_FONT_SIZE } from '$stylist/design-token/const/object/font-size';
import { TOKEN_LINE_HEIGHT } from '$stylist/design-token/const/object/line-height';
import { DESIGN_TOKEN_DENSITY } from '$stylist/design-token/const/preset/density';
import { ManagerThemeCSS } from '$stylist/theme/class/manager/theme-css';
import { THEME_MODE_LIGHT } from '$stylist/theme/const/record/theme-mode-light';
import { THEME_MODE_DARK } from '$stylist/theme/const/record/theme-mode-dark';
import type { ContractPreviewEnvironment } from '$stylist/domain/interface/contract/preview-environment';

/** Explicit preview mode overrides inherited theme variables; individual overrides win last. */
export function resolvePreviewVariables(
	settings: ContractPreviewEnvironment
): Record<string, string> {
	const vars =
		settings.mode === 'dark'
			? ManagerThemeCSS.convertToCSSVars(THEME_MODE_DARK)
			: settings.mode === 'light'
				? ManagerThemeCSS.convertToCSSVars(THEME_MODE_LIGHT)
				: {};
	if (settings.fontFamily && Object.hasOwn(TOKEN_FONT_FAMILY, settings.fontFamily))
		vars['--typography-font-family'] = TOKEN_FONT_FAMILY[settings.fontFamily];
	if (settings.fontSize && Object.hasOwn(TOKEN_FONT_SIZE, settings.fontSize))
		vars['--font-size-4'] = TOKEN_FONT_SIZE[settings.fontSize];
	if (settings.lineHeight && Object.hasOwn(TOKEN_LINE_HEIGHT, settings.lineHeight))
		vars['--line-height-normal'] = TOKEN_LINE_HEIGHT[settings.lineHeight];
	if (settings.density && Object.hasOwn(DESIGN_TOKEN_DENSITY, settings.density)) {
		const density = DESIGN_TOKEN_DENSITY[settings.density];
		vars['--density-block'] = density.block;
		vars['--density-inline'] = density.inline;
		vars['--density-scale'] = density.scale;
	}
	return vars;
}
