import type { RecipeOrbitContractL5 } from '$stylist/token/interface/recipe/orbit-contract-l5';
import type { TokenIconName } from '$stylist/svg/type/alias/icon-name';
/** Reactive behavior of orbit-contract-l5; props are read lazily when needed. */
export function createOrbitContractL5ComponentState(
	getProps: () => Pick<RecipeOrbitContractL5, 'opened'> & {
		opened: Exclude<RecipeOrbitContractL5['opened'], undefined>;
	}
) {
	type OrbitGroup = 'architecture' | 'information' | 'interaction';
	type OrbitNode = {
		id: string;
		icon: TokenIconName;
		group: OrbitGroup;
		index: number;
		count: number;
		radius: string;
	};

	const props = $derived(getProps());
	const nodes: OrbitNode[] = [
		{
			id: 'component-size',
			icon: 'component-size',
			group: 'architecture',
			index: 0,
			count: 2,
			radius: '68px'
		},
		{ id: 'style', icon: 'style', group: 'architecture', index: 1, count: 2, radius: '68px' },

		{ id: 'variants', icon: 'variants', group: 'information', index: 0, count: 2, radius: '102px' },
		{
			id: 'text-element',
			icon: 'text-element',
			group: 'information',
			index: 1,
			count: 2,
			radius: '102px'
		},

		{
			id: 'animations',
			icon: 'animations',
			group: 'interaction',
			index: 0,
			count: 3,
			radius: '136px'
		},
		{ id: 'controls', icon: 'controls', group: 'interaction', index: 1, count: 3, radius: '136px' },
		{ id: 'state', icon: 'state', group: 'interaction', index: 2, count: 3, radius: '136px' }
	];
	let openedLocal = $state(false);
	let active = $state<string>('component-size');
	const opened = $derived(props['opened'] ?? openedLocal);
	function toggleOpened(): void {
		if (props['opened'] === null) {
			openedLocal = !openedLocal;
		}
	}
	return {
		get nodes(): typeof nodes {
			return nodes;
		},
		get active(): typeof active {
			return active;
		},
		set active(__nextValue: typeof active) {
			active = __nextValue;
		},
		get opened(): typeof opened {
			return opened;
		},
		get toggleOpened(): typeof toggleOpened {
			return toggleOpened;
		}
	};
}
export default createOrbitContractL5ComponentState;
