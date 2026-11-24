import { L6_TOKEN_DEFINITIONS } from '$stylist/token/const/object/orbit-control-definition';

/** Reactive behavior of prismatic-orbit-l6; props are read lazily when needed. */
export function createPrismaticOrbitL6ComponentState() {
	let expanded = $state(false);
	let orbitOpen = $state(false);
	let seedX = $state(64);
	let seedY = $state(118);
	let draggingSeed = $state(false);
	let seedMoved = $state(false);
	let shellElement = $state<HTMLElement | null>(null);
	let dragOffsetX = 0;
	let dragOffsetY = 0;
	const SEED_SIZE = 48;
	const SHELL_WIDTH = 500;
	const SHELL_HEIGHT = 230;
	const CARD_OFFSET_X = 0;
	const CARD_OFFSET_Y = 0;
	const ORBIT_OFFSET_X = -155;
	const ORBIT_OFFSET_Y = -160;
	const items = [
		{ id: 'architecture', label: 'Architecture', icon: 'component-size' },
		{ id: 'information', label: 'Information', icon: 'variants' },
		{ id: 'interaction', label: 'Interaction', icon: 'controls' },
		{ id: 'state', label: 'State', icon: 'state' }
	] as const;
	const architectureNodes = [
		{
			id: 'component-size',
			icon: 'component-size',
			label: 'Component Size',
			definition: L6_TOKEN_DEFINITIONS['component-size']
		},
		{ id: 'style', icon: 'style', label: 'Style', definition: L6_TOKEN_DEFINITIONS.style }
	] as const;
	const informationNodes = [
		{
			id: 'variants',
			icon: 'variants',
			label: 'Variants',
			definition: L6_TOKEN_DEFINITIONS.variants
		},
		{
			id: 'text-element',
			icon: 'text-element',
			label: 'Text Element',
			definition: L6_TOKEN_DEFINITIONS['text-element']
		}
	] as const;
	const interactionNodes = [
		{
			id: 'animations',
			icon: 'animations',
			label: 'Animations',
			definition: L6_TOKEN_DEFINITIONS.animations
		},
		{
			id: 'controls',
			icon: 'controls',
			label: 'Controls',
			definition: L6_TOKEN_DEFINITIONS.controls
		},
		{ id: 'state', icon: 'state', label: 'State', definition: L6_TOKEN_DEFINITIONS.state }
	] as const;
	function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}
	function handleSeedPointerDown(event: PointerEvent): void {
		if (event.button !== 0) return;
		const rect = shellElement?.getBoundingClientRect();
		if (!rect) return;
		draggingSeed = true;
		seedMoved = false;
		dragOffsetX = event.clientX - rect.left - seedX;
		dragOffsetY = event.clientY - rect.top - seedY;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}
	function handleWindowPointerMove(event: PointerEvent): void {
		if (!draggingSeed) return;
		const rect = shellElement?.getBoundingClientRect();
		if (!rect) return;
		seedMoved = true;
		seedX = clamp(event.clientX - rect.left - dragOffsetX, 0, SHELL_WIDTH - SEED_SIZE);
		seedY = clamp(event.clientY - rect.top - dragOffsetY, 0, SHELL_HEIGHT - SEED_SIZE);
	}
	function handleWindowPointerUp(): void {
		draggingSeed = false;
	}
	function handleSeedClick(): void {
		if (!seedMoved) {
			if (!expanded) {
				expanded = true;
				orbitOpen = false;
			} else {
				orbitOpen = !orbitOpen;
			}
		}
		seedMoved = false;
	}
	function closeCard(): void {
		expanded = false;
		orbitOpen = false;
	}
	return {
		get expanded(): typeof expanded {
			return expanded;
		},
		set expanded(__nextValue: typeof expanded) {
			expanded = __nextValue;
		},
		get orbitOpen(): typeof orbitOpen {
			return orbitOpen;
		},
		set orbitOpen(__nextValue: typeof orbitOpen) {
			orbitOpen = __nextValue;
		},
		get seedX(): typeof seedX {
			return seedX;
		},
		set seedX(__nextValue: typeof seedX) {
			seedX = __nextValue;
		},
		get seedY(): typeof seedY {
			return seedY;
		},
		set seedY(__nextValue: typeof seedY) {
			seedY = __nextValue;
		},
		get draggingSeed(): typeof draggingSeed {
			return draggingSeed;
		},
		set draggingSeed(__nextValue: typeof draggingSeed) {
			draggingSeed = __nextValue;
		},
		get shellElement(): typeof shellElement {
			return shellElement;
		},
		set shellElement(__nextValue: typeof shellElement) {
			shellElement = __nextValue;
		},
		get CARD_OFFSET_X(): typeof CARD_OFFSET_X {
			return CARD_OFFSET_X;
		},
		get CARD_OFFSET_Y(): typeof CARD_OFFSET_Y {
			return CARD_OFFSET_Y;
		},
		get ORBIT_OFFSET_X(): typeof ORBIT_OFFSET_X {
			return ORBIT_OFFSET_X;
		},
		get ORBIT_OFFSET_Y(): typeof ORBIT_OFFSET_Y {
			return ORBIT_OFFSET_Y;
		},
		get items(): typeof items {
			return items;
		},
		get architectureNodes(): typeof architectureNodes {
			return architectureNodes;
		},
		get informationNodes(): typeof informationNodes {
			return informationNodes;
		},
		get interactionNodes(): typeof interactionNodes {
			return interactionNodes;
		},
		get handleSeedPointerDown(): typeof handleSeedPointerDown {
			return handleSeedPointerDown;
		},
		get handleWindowPointerMove(): typeof handleWindowPointerMove {
			return handleWindowPointerMove;
		},
		get handleWindowPointerUp(): typeof handleWindowPointerUp {
			return handleWindowPointerUp;
		},
		get handleSeedClick(): typeof handleSeedClick {
			return handleSeedClick;
		},
		get closeCard(): typeof closeCard {
			return closeCard;
		}
	};
}
export default createPrismaticOrbitL6ComponentState;
