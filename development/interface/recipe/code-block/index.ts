import type { HTMLAttributes } from 'svelte/elements';
import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { TokenSize } from '$stylist/design-token/type/alias/size';
import type { TokenCodeLanguage } from '$stylist/development/type/alias/code-language';
import type { TokenCodeView } from '$stylist/development/type/alias/code-view';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { SlotTheme } from '$stylist/theme/interface/slot/theme';

export interface RecipeCodeBlock extends ComputeIntersectAll<
	[
		Omit<HTMLAttributes<HTMLDivElement>, 'class'> &
			SlotThemeBorder &
			SlotTypography & {
				code?: string;
				language?: TokenCodeLanguage | 'text';
				variant?: TokenCodeView;
				size?: TokenSize;
				showLineNumbers?: boolean;
				startLineNumber?: number;
				highlightLines?: number[];
				title?: string;
				tags?: string[];
				copyable?: boolean;
				copyOnHover?: boolean;
				class?: string;
				contentClass?: string;
				lineNumberClass?: string;
				codeClass?: string;
				headerClass?: string;
			},
		SlotTheme
	]
> {}
