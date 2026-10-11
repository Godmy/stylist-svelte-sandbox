import type { HTMLAttributes } from 'svelte/elements';
import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { TokenColorTone } from '$stylist/design-token/type/alias/color-tone';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';

export interface RecipeDocumentationBlock extends ComputeIntersectAll<
	[
		HTMLAttributes<HTMLElement> &
			SlotThemeBorder &
			SlotTypography & {
				title?: string;
				content: string;
				variant?: TokenColorTone;
				codeExamples?: {
					title?: string;
					code: string;
					language?: string;
					showLineNumbers?: boolean;
				}[];
				tags?: string[];
			}
	]
> {}
