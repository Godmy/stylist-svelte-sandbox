import DeviceViewport from './index.svelte';
import type { RecipeDeviceViewport } from '$stylist/domain/interface/recipe/device-viewport';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { DEVICE_FRAME_VIEWPORT } from '$stylist/domain/const/array/device-frame-viewport';

/** Viewport switcher; index.story.svelte remembers the category, widths and fullscreen it reports. */
export default {
	component: DeviceViewport,
	title: 'DeviceViewport',
	description:
		'Multiple viewport widths for mobile, tablet and desktop, remembered per category, with an independent fullscreen toggle.',
	args: {
		value: 'desktop',
		widths: { mobile: 375, tablet: 768, desktop: 1440, fullscreen: null },
		fullscreen: false
	},
	controls: {
		value: { type: 'select', options: DEVICE_FRAME_VIEWPORT },
		fullscreen: { type: 'boolean' }
	},
	presets: { Mobile: { value: 'mobile' }, Fullscreen: { fullscreen: true } }
} satisfies ContractStory<RecipeDeviceViewport>;
