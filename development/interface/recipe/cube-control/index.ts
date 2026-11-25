import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { HTMLAttributes } from 'svelte/elements';

export interface RecipeCubeControl extends ComputeIntersectAll<[HTMLAttributes<HTMLDivElement>]> {
	size?: number;
	perspective?: number;
	autoRotate?: boolean;
	rotationDuration?: number;
	interactive?: boolean;
	inertiaEnabled?: boolean;
	inertiaFriction?: number;
	inertiaSensitivity?: number;
	faceLabels?: boolean;
	class?: string;
	onRotate?: (rotation: { x: number; y: number }) => void;
	onSelectionChange?: (selection: {
		selectedIconId: string | null;
		selectedTitleFace: number | null;
		selectedCellByFace: number[];
	}) => void;
	onDebugLog?: (entry: {
		ts: number;
		source: 'stage' | 'icon' | 'title' | 'cell';
		action: string;
		id?: string;
		faceIndex?: number;
		cellIndex?: number;
		pointerType?: string;
		x?: number;
		y?: number;
	}) => void;
}
