import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
export interface RecipeCodeViewer extends ComputeIntersectAll<[SlotThemeBorder, SlotTypography]> {
	componentName?: string;
	props?: Record<string, any>;
	theme?: 'light' | 'dark' | 'github-light' | 'github-dark';
	onCopySuccess?: () => void;
	onCopyError?: (error: unknown) => void;
	onDownloadSuccess?: () => void;
	onDownloadError?: (error: unknown) => void;

	code?: string;
	language?: string;
	readonly?: boolean;
	class?: string;
}
