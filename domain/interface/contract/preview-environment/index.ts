import type { TokenFontFamily } from '$stylist/design-token/type/alias/font-family';
import type { TokenFontSize } from '$stylist/design-token/type/alias/font-size';
import type { TokenLineHeight } from '$stylist/design-token/type/alias/line-height';
import type { LocaleCode } from '$stylist/localization/type/alias/locale-code';

/** Serializable environment settings, separate from component args. Empty values inherit the current theme. */
export interface ContractPreviewEnvironment {
	skin?: boolean;
	mode?: 'light' | 'dark';
	fontFamily?: TokenFontFamily;
	fontSize?: TokenFontSize;
	lineHeight?: TokenLineHeight;
	density?: 'compact' | 'comfortable';
	/** Language of every story (LocaleProvider around the canvas), with or without the skin. */
	locale?: LocaleCode;
}
