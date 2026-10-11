import { untrack } from 'svelte';
import type { RecipeTokenRadio } from '$stylist/token/interface/recipe/token-radio';
import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';

export function createTokenRadioState(getProps: () => RecipeTokenRadio) {
	const props = $derived(getProps());
	let internalValue = $state<TokenValue>(
		untrack(
			() => props.value ?? props.definition.defaultValue ?? props.definition.options[0]?.value ?? ''
		)
	);

	$effect(() => {
		if (props.value !== undefined && props.value !== internalValue) {
			internalValue = props.value;
		}
	});

	function selectOption(next: TokenValue) {
		internalValue = next;
		props.onChange?.(next);
	}

	return {
		get internalValue() {
			return internalValue;
		},
		selectOption,
		get definition() {
			return props.definition;
		},
		get onChange() {
			return props.onChange;
		}
	};
}

export default createTokenRadioState;
