import type { RecipeTokenText } from '$stylist/token/interface/recipe/token-text';

export function createTokenTextState(getProps: () => RecipeTokenText) {
	const props = $derived(getProps());
	const definition = $derived(props.definition);
	const placeholder = $derived(props.placeholder ?? definition.placeholder ?? 'Enter value');
	const onChange = $derived(props.onChange);
	let internalValue = $derived(props.value ?? '');

	return {
		get definition() {
			return definition;
		},
		get value() {
			return internalValue;
		},
		get placeholder() {
			return placeholder;
		},
		get onChange() {
			return onChange;
		},
		handleInput(event: Event) {
			internalValue = (event.target as HTMLInputElement).value;
			onChange?.(internalValue);
		}
	};
}

export default createTokenTextState;
