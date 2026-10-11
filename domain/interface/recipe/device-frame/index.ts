import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { SlotChildren } from '$stylist/theme/interface/slot/children';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';
import type { SlotClass } from '$stylist/theme/interface/slot/class';
import type { TokenOrientation } from '$stylist/layout/type/alias/orientation';

export interface RecipeDeviceFrame extends ComputeIntersectAll<
	[SlotThemeBorder, SlotTypography, SlotChildren, SlotClass]
> {
	device?: DeviceFrameViewport;
	orientation?: TokenOrientation;
}
