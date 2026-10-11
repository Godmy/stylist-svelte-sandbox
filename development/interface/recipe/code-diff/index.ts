import type { HTMLAttributes } from 'svelte/elements';
import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';

export interface RecipeCodeDiff extends ComputeIntersectAll<
	[
		Omit<HTMLAttributes<HTMLDivElement>, 'class'> &
			SlotThemeBorder &
			SlotTypography & {
				original?: string;
				modified?: string;
				language?: string;
				showLineNumbers?: boolean;
				class?: string;
				contentClass?: string;
				headerClass?: string;
			}
	]
> {}
