import type { HTMLAttributes } from 'svelte/elements';
import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { Snippet } from 'svelte';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';

export interface RecipeComponentPreview extends ComputeIntersectAll<
	[
		Omit<HTMLAttributes<HTMLDivElement>, 'class'> &
			SlotThemeBorder &
			SlotTypography & {
				title: string;
				description?: string;
				code: string;
				language?: string;
				componentDemo: Snippet;
				showCode?: boolean;
				class?: string;
			}
	]
> {}
