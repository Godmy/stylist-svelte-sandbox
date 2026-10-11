import { untrack } from 'svelte';
import type { RecipeTokenSelect } from '$stylist/token/interface/recipe/token-select';
import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';

export function createTokenSelectState(getProps: () => RecipeTokenSelect) {
	const props = $derived(getProps());
	const valueToIndex = (candidate: TokenValue) =>
		Math.max(
			0,
			props.definition.options.findIndex((option) => option.value === candidate)
		);

	let internalIndex = $state<number>(
		untrack(() =>
			valueToIndex(
				props.value ?? props.definition.defaultValue ?? props.definition.options[0]?.value ?? ''
			)
		)
	);

	$effect(() => {
		if (props.value !== undefined) {
			const nextIndex = valueToIndex(props.value);
			if (nextIndex !== internalIndex) {
				internalIndex = nextIndex;
			}
		}
	});

	function handleChange(event: Event) {
		const nextIndex = Number((event.currentTarget as HTMLSelectElement).value);
		internalIndex = Number.isNaN(nextIndex) ? 0 : nextIndex;
		props.onChange?.(
			props.definition.options[internalIndex]?.value ?? props.definition.options[0]?.value ?? ''
		);
	}

	return {
		get internalIndex() {
			return internalIndex;
		},
		handleChange,
		valueToIndex,
		get definition() {
			return props.definition;
		},
		get onChange() {
			return props.onChange;
		}
	};
}

export default createTokenSelectState;
