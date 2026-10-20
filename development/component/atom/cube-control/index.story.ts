import CubeControl from './index.svelte';
import type { RecipeCubeControl } from '$stylist/development/interface/recipe/cube-control';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Interactive CSS 3D cube control. */
export default {
	component: CubeControl,
	title: 'CubeControl',
	description:
		'Interactive CSS 3D cube control with drag rotation, auto-rotate mode, and directional actions.',
	args: {
		size: 380,
		perspective: 700,
		rotationDuration: 24,
		autoRotate: true,
		interactive: true,
		inertiaEnabled: true,
		inertiaFriction: 0.94,
		inertiaSensitivity: 1,
		faceLabels: true
	},
	controls: {
		size: { type: 'number', min: 80, max: 520, step: 10 },
		perspective: { type: 'number', min: 300, max: 1400, step: 50 },
		rotationDuration: { type: 'number', min: 2, max: 40, step: 1 },
		autoRotate: { type: 'boolean' },
		interactive: { type: 'boolean' },
		inertiaEnabled: { type: 'boolean' },
		inertiaFriction: { type: 'number', min: 0.82, max: 0.99, step: 0.01 },
		inertiaSensitivity: { type: 'number', min: 0.2, max: 3, step: 0.1 },
		faceLabels: { type: 'boolean' }
	},
	presets: { Static: { autoRotate: false }, 'Without labels': { faceLabels: false } },
	layout: 'centered'
} satisfies ContractStory<RecipeCubeControl>;
