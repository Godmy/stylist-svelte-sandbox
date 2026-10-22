import DeviceFrame from '$stylist/domain/component/organism/device-frame/index.svelte';
import type { RecipeDeviceFrame } from '$stylist/domain/interface/recipe/device-frame';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { DEVICE_FRAME_VIEWPORT } from '$stylist/domain/const/array/device-frame-viewport';
import { TOKEN_ORIENTATION } from '$stylist/layout/const/array/orientation';

/** Responsive frame wrapper for previewing content at device sizes. */
export default {
	component: DeviceFrame,
	title: 'Device Frame',
	description:
		'Responsive frame wrapper for previewing content at mobile, tablet, desktop, and fullscreen sizes.',
	args: { device: 'desktop', orientation: TOKEN_ORIENTATION[1] },
	controls: {
		device: { type: 'select', options: DEVICE_FRAME_VIEWPORT },
		orientation: { type: 'select', options: TOKEN_ORIENTATION }
	},
	presets: {
		Mobile: { device: 'mobile' },
		'Tablet horizontal': { device: 'tablet', orientation: TOKEN_ORIENTATION[0] }
	},
	content: [
		{
			kind: 'element',
			tag: 'div',
			attrs: {
				style:
					'min-height: 240px; padding: 24px; background: linear-gradient(135deg, #f8fafc, #e2e8f0); display: grid; place-items: center;'
			},
			children: [
				{
					kind: 'element',
					tag: 'div',
					attrs: { style: 'text-align: center; color: #334155;' },
					children: [
						{
							kind: 'element',
							tag: 'div',
							attrs: { style: 'font-weight: 800; font-size: 20px;' },
							children: [{ kind: 'text', value: 'Responsive Preview' }]
						},
						{
							kind: 'element',
							tag: 'div',
							attrs: { style: 'margin-top: 8px;' },
							children: [
								{ kind: 'text', value: 'Switch the device control to inspect frame sizing.' }
							]
						}
					]
				}
			]
		}
	]
} satisfies ContractStory<RecipeDeviceFrame>;
