import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { ComponentType, Snippet } from 'svelte';
export interface RecipeErrorBoundary extends ComputeIntersectAll<
	[SlotThemeBorder, SlotTypography]
> {
	component: ComponentType | null | undefined;
	props?: Record<string, any>;
	children?: Snippet;

	class?: string;
}
