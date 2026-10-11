import type { RecipeTokenChipSet } from '$stylist/token/interface/recipe/token-chip-set';

export function createTokenChipSetState(getProps: () => RecipeTokenChipSet) {
	const props = $derived(getProps());
	const displayTokens = $derived(
		props.dedupe ? Array.from(new Set(props.tokens)) : [...props.tokens]
	);
	const title = $derived(props.title);
	const className = $derived(props.class ?? '');

	return {
		get displayTokens() {
			return displayTokens;
		},
		get title() {
			return title;
		},
		get className() {
			return className;
		},
		get tokens() {
			return props.tokens;
		},
		get value() {
			return props.value;
		},
		get dedupe() {
			return props.dedupe ?? true;
		},
		get onSelect() {
			return props.onSelect;
		}
	};
}

export default createTokenChipSetState;
