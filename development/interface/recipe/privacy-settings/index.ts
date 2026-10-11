import type { HTMLAttributes } from 'svelte/elements';
import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';

export interface RecipePrivacySettings extends ComputeIntersectAll<
	[
		Omit<HTMLAttributes<HTMLDivElement>, 'class'> &
			SlotThemeBorder &
			SlotTypography & {
				settings?: {
					id: string;
					label: string;
					description: string;
					enabled: boolean;
				}[];
				onSave?: () => void;
				class?: string;
			}
	]
> {}
