import { untrack } from 'svelte';
import type { RecipeTokenRange } from '$stylist/token/interface/recipe/token-range';

export function createTokenRangeState(getProps: () => RecipeTokenRange) {
	const props = $derived(getProps());
	const initialValue = untrack(() =>
		typeof props.value === 'number'
			? props.value
			: typeof props.definition.defaultValue === 'number'
				? props.definition.defaultValue
				: props.definition.min
	);

	let internalValue = $state<number>(initialValue);

	$effect(() => {
		if (typeof props.value === 'number' && props.value !== internalValue) {
			internalValue = props.value;
		}
	});

	function handleInput(event: Event) {
		const next = Number((event.currentTarget as HTMLInputElement).value);
		internalValue = Number.isNaN(next) ? props.definition.min : next;
		props.onChange?.(internalValue);
	}

	return {
		get internalValue() {
			return internalValue;
		},
		handleInput,
		get definition() {
			return props.definition;
		},
		get onChange() {
			return props.onChange;
		}
	};
}

export default createTokenRangeState;
