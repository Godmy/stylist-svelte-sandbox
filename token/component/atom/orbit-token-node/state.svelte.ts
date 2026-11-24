import { untrack } from 'svelte';

import type { RecipeOrbitTokenNode } from '$stylist/token/interface/recipe/orbit-token-node';
import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';
/** Reactive behavior of orbit-token-node; props are read lazily when needed. */
export function createOrbitTokenNodeComponentState(
	getProps: () => Pick<RecipeOrbitTokenNode, 'id' | 'opened' | 'definition'> & {
		opened: Exclude<RecipeOrbitTokenNode['opened'], undefined>;
	}
) {
	const props = $derived(getProps());
	let active = $state(false);
	let value = $state<TokenValue>(untrack(() => props['definition'].defaultValue ?? ''));
	$effect(() => {
		if (!props['opened']) {
			active = false;
		}
	});
	const controlDefinition = $derived({
		...props['definition'],
		id: `${props['definition'].id}-${props['id']}`
	});
	return {
		get active(): typeof active {
			return active;
		},
		set active(__nextValue: typeof active) {
			active = __nextValue;
		},
		get value(): typeof value {
			return value;
		},
		set value(__nextValue: typeof value) {
			value = __nextValue;
		},
		get controlDefinition(): typeof controlDefinition {
			return controlDefinition;
		}
	};
}
export default createOrbitTokenNodeComponentState;
