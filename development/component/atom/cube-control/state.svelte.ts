import type { RecipeCubeControl } from '$stylist/development/interface/recipe/cube-control';
import type { Point2D } from '$stylist/canvas/interface/slot/point-2d';
import { TOKEN_CUBE_FACE_TITLE } from '$stylist/token/const/array/cube-face-title';
import { TOKEN_CUBE_FACE_NAME } from '$stylist/token/const/array/cube-face-name';
import { CUBE_FACE_NUMBERS_SNAPSHOT } from '$stylist/development/const/record/cube-face-numbers-snapshot';
import { CUBE_FACE_THEMES } from '$stylist/development/const/record/cube-face-theme';
import { CUBE_HORIZONTAL_ICONS } from '$stylist/development/const/record/cube-horizontal-icon';
import { CUBE_VERTICAL_ICONS } from '$stylist/development/const/record/cube-vertical-icon';

export function createCubeControlState(getProps: () => RecipeCubeControl) {
	const props = $derived(getProps());
	const size = $derived(props.size ?? 380);
	const perspective = $derived(props.perspective ?? 700);
	const autoRotate = $derived(props.autoRotate ?? true);
	const rotationDuration = $derived(props.rotationDuration ?? 24);
	const interactive = $derived(props.interactive ?? true);
	const inertiaFriction = $derived(props.inertiaFriction ?? 0.94);
	const inertiaSensitivity = $derived(props.inertiaSensitivity ?? 1);
	const faceLabels = $derived(props.faceLabels ?? true);
	const className = $derived(props.class ?? '');

	const cubeSize = $derived(Math.max(40, size));
	const perspectiveValue = $derived(Math.max(200, perspective));
	const durationValue = $derived(Math.max(1, rotationDuration));
	const inertiaFrictionValue = $derived(clamp(inertiaFriction, 0.82, 0.99));
	const inertiaSensitivityValue = $derived(clamp(inertiaSensitivity, 0.2, 3));

	let rotationX = $state(-22);
	let rotationY = $state(32);
	let isDragging = $state(false);
	let isInertiaSpinning = $state(false);
	let lastPointerX = $state(0);
	let lastPointerY = $state(0);
	let lastMoveTime = $state(0);
	let pointerTravel = $state(0);
	let velocityX = $state(0);
	let velocityY = $state(0);
	let inertiaFrame: number | null = null;
	let autoRotateFrame: number | null = null;
	let autoRotatePauseUntil = $state(0);
	let autoRotateRampStart = $state(0);
	let vectorShiftInterval: number | null = null;
	let autoDriftX = $state(0);
	let autoDriftY = $state(0);
	let targetDriftX = $state(0);
	let targetDriftY = $state(0);
	let faceNumbers = $state(CUBE_FACE_NUMBERS_SNAPSHOT.map((grid) => [...grid]));
	let activeCells = $state(TOKEN_CUBE_FACE_TITLE.map(() => -1));
	let selectedIconId = $state(null as string | null);
	let selectedTitleFace = $state(null as number | null);
	let selectedCellByFace = $state(TOKEN_CUBE_FACE_TITLE.map(() => -1));
	let lastSelectionSignature = '';
	let isHoveringSelectable = $state(false);

	const orbitTransform = $derived(`rotateX(${rotationX}deg) rotateY(${rotationY}deg)`);

	function clamp(value: number, min: number, max: number) {
		return Math.min(max, Math.max(min, value));
	}

	function stopInertia() {
		if (typeof window === 'undefined') return;
		if (inertiaFrame !== null) {
			window.cancelAnimationFrame(inertiaFrame);
			inertiaFrame = null;
		}
		velocityX = 0;
		velocityY = 0;
		isInertiaSpinning = false;
	}

	function handlePointerDown(event: PointerEvent) {
		if (!interactive) return;
		stopInertia();
		isDragging = true;
		isInertiaSpinning = false;
		pointerTravel = 0;
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		lastMoveTime = performance.now();
	}

	function selectIcon(iconId: string) {
		selectedIconId = iconId;
		emitSelectionChange();
	}

	function emitSelectionChange() {
		const signature = `${selectedIconId ?? ''}|${selectedTitleFace ?? ''}|${selectedCellByFace.join(',')}`;
		if (signature === lastSelectionSignature) return;
		lastSelectionSignature = signature;
		props.onSelectionChange?.({
			selectedIconId,
			selectedTitleFace,
			selectedCellByFace: [...selectedCellByFace]
		});
	}

	function pushDebugLog(entry: {
		ts: number;
		source: 'stage' | 'icon' | 'title' | 'cell';
		action: string;
		id?: string;
		faceIndex?: number;
		cellIndex?: number;
		pointerType?: string;
		x?: number;
		y?: number;
	}) {
		props.onDebugLog?.(entry);
	}

	function scheduleAutoRotateResume() {
		if (typeof window === 'undefined') return;
		const now = performance.now();
		autoRotatePauseUntil = now + 4000;
		autoRotateRampStart = autoRotatePauseUntil;
	}

	function resetRotation() {
		stopInertia();
		rotationX = -22;
		rotationY = 32;
	}

	const selectionState: {
		selectedIconId: string | null;
		selectedTitleFace: number | null;
		selectedCellByFace: number[];
	} = {
		get selectedIconId() {
			return selectedIconId;
		},
		get selectedTitleFace() {
			return selectedTitleFace;
		},
		get selectedCellByFace() {
			return [...selectedCellByFace];
		}
	};

	const rotationState: Point2D = {
		get x() {
			return rotationX;
		},
		get y() {
			return rotationY;
		}
	};

	return {
		get cubeSize() {
			return cubeSize;
		},
		get perspectiveValue() {
			return perspectiveValue;
		},
		get durationValue() {
			return durationValue;
		},
		get inertiaFrictionValue() {
			return inertiaFrictionValue;
		},
		get inertiaSensitivityValue() {
			return inertiaSensitivityValue;
		},
		get orbitTransform() {
			return orbitTransform;
		},
		get rotationX() {
			return rotationX;
		},
		set rotationX(v: number) {
			rotationX = v;
		},
		get rotationY() {
			return rotationY;
		},
		set rotationY(v: number) {
			rotationY = v;
		},
		get isDragging() {
			return isDragging;
		},
		get isInertiaSpinning() {
			return isInertiaSpinning;
		},
		get lastPointerX() {
			return lastPointerX;
		},
		set lastPointerX(v: number) {
			lastPointerX = v;
		},
		get lastPointerY() {
			return lastPointerY;
		},
		set lastPointerY(v: number) {
			lastPointerY = v;
		},
		get lastMoveTime() {
			return lastMoveTime;
		},
		set lastMoveTime(v: number) {
			lastMoveTime = v;
		},
		get pointerTravel() {
			return pointerTravel;
		},
		set pointerTravel(v: number) {
			pointerTravel = v;
		},
		get velocityX() {
			return velocityX;
		},
		set velocityX(v: number) {
			velocityX = v;
		},
		get velocityY() {
			return velocityY;
		},
		set velocityY(v: number) {
			velocityY = v;
		},
		get inertiaFrame() {
			return inertiaFrame;
		},
		set inertiaFrame(v: number | null) {
			inertiaFrame = v;
		},
		get autoRotateFrame() {
			return autoRotateFrame;
		},
		set autoRotateFrame(v: number | null) {
			autoRotateFrame = v;
		},
		get autoRotatePauseUntil() {
			return autoRotatePauseUntil;
		},
		set autoRotatePauseUntil(v: number) {
			autoRotatePauseUntil = v;
		},
		get autoRotateRampStart() {
			return autoRotateRampStart;
		},
		set autoRotateRampStart(v: number) {
			autoRotateRampStart = v;
		},
		get vectorShiftInterval() {
			return vectorShiftInterval;
		},
		set vectorShiftInterval(v: number | null) {
			vectorShiftInterval = v;
		},
		get autoDriftX() {
			return autoDriftX;
		},
		set autoDriftX(v: number) {
			autoDriftX = v;
		},
		get autoDriftY() {
			return autoDriftY;
		},
		set autoDriftY(v: number) {
			autoDriftY = v;
		},
		get targetDriftX() {
			return targetDriftX;
		},
		set targetDriftX(v: number) {
			targetDriftX = v;
		},
		get targetDriftY() {
			return targetDriftY;
		},
		set targetDriftY(v: number) {
			targetDriftY = v;
		},
		get faceNumbers() {
			return faceNumbers;
		},
		set faceNumbers(v: number[][]) {
			faceNumbers = v;
		},
		get activeCells() {
			return activeCells;
		},
		set activeCells(v: number[]) {
			activeCells = v;
		},
		get selectedIconId() {
			return selectedIconId;
		},
		set selectedIconId(v: string | null) {
			selectedIconId = v;
		},
		get selectedTitleFace() {
			return selectedTitleFace;
		},
		set selectedTitleFace(v: number | null) {
			selectedTitleFace = v;
		},
		get selectedCellByFace() {
			return selectedCellByFace;
		},
		set selectedCellByFace(v: number[]) {
			selectedCellByFace = v;
		},
		get isHoveringSelectable() {
			return isHoveringSelectable;
		},
		set isHoveringSelectable(v: boolean) {
			isHoveringSelectable = v;
		},
		get autoRotate() {
			return autoRotate;
		},
		get interactive() {
			return interactive;
		},
		get faceLabels() {
			return faceLabels;
		},
		get className() {
			return className;
		},
		get FACE_TITLES() {
			return TOKEN_CUBE_FACE_TITLE;
		},
		get FACE_NAMES() {
			return TOKEN_CUBE_FACE_NAME;
		},
		get FACE_THEMES() {
			return CUBE_FACE_THEMES;
		},
		get VERTICAL_ICONS() {
			return CUBE_VERTICAL_ICONS;
		},
		get HORIZONTAL_ICONS() {
			return CUBE_HORIZONTAL_ICONS;
		},
		clamp,
		stopInertia,
		handlePointerDown,
		selectIcon,
		emitSelectionChange,
		pushDebugLog,
		scheduleAutoRotateResume,
		resetRotation,
		selectionState,
		rotationState,
		get onRotate() {
			return props.onRotate;
		},
		get onSelectionChange() {
			return props.onSelectionChange;
		},
		get onDebugLog() {
			return props.onDebugLog;
		}
	};
}

export default createCubeControlState;
