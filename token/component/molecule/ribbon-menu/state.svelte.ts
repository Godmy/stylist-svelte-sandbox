import type { TokenIconName } from '$stylist/svg/type/alias/icon-name';
/** Reactive behavior of ribbon-menu; props are read lazily when needed. */
export function createRibbonMenuComponentState() {
	type RibbonItem = {
		id: string;
		label: string;
		icon: TokenIconName;
	};

	const items: RibbonItem[] = [
		{ id: 'components', label: 'Components', icon: 'stylist-organism' },
		{ id: 'models', label: 'Models', icon: 'design-tokens-organism' },
		{ id: 'contracts', label: 'Contracts', icon: 'style' },
		{ id: 'colors', label: 'Colors', icon: 'colors' },
		{ id: 'styles', label: 'Styles', icon: 'style' },
		{ id: 'themes', label: 'Themes', icon: 'color-swatch' },
		{ id: 'tokens', label: 'Tokens', icon: 'design-tokens-organism' },
		{ id: 'icons', label: 'Icons', icon: 'favicon' }
	];
	let opened = $state(false);
	return {
		get items(): typeof items {
			return items;
		},
		get opened(): typeof opened {
			return opened;
		},
		set opened(__nextValue: typeof opened) {
			opened = __nextValue;
		}
	};
}
export default createRibbonMenuComponentState;
