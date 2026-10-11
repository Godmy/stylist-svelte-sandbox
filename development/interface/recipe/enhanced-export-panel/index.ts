import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
export interface RecipeEnhancedExportPanel extends ComputeIntersectAll<
	[SlotThemeBorder, SlotTypography]
> {
	componentName?: string;
	svelteCode?: string;
	props?: Record<string, any>;

	class?: string;
}
