import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { SlotChildren } from '$stylist/theme/interface/slot/children';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { Snippet } from 'svelte';
export interface RecipeLiveCodeSection extends ComputeIntersectAll<
	[SlotThemeBorder, SlotTypography, SlotChildren]
> {
	badgeText?: string;
	title?: string;
	description?: string;
	code?: string;
	ctaText?: string;
	ctaHref?: string;
	children?: Snippet;

	class?: string;
}
