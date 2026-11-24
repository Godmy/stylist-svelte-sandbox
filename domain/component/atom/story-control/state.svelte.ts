import type { RecipeStoryControl } from '$stylist/domain/interface/recipe/story-control';
import { transformStoryJson } from '$stylist/domain/function/transform/story-json';
/** Reactive behavior of story-control; props are read lazily when needed. */
export function createStoryControlComponentState(
	getProps: () => Pick<RecipeStoryControl, 'name' | 'control' | 'value' | 'onChange'>
) {
	const props = $derived(getProps());
	const id = $derived(`story-control-${props['name']}`);
	const text = (event: Event) => (event.currentTarget as HTMLInputElement).value;
	const number = (event: Event) => (event.currentTarget as HTMLInputElement).valueAsNumber;
	const json = (input: unknown) => (input === undefined ? '' : JSON.stringify(input, null, 2));
	// `json` keeps the typed text while it is invalid; an outside change (preset, reset)
	// replaces it with the formatted value.
	let draft = $state<string | null>(null);
	let error = $state('');
	let emitted = '';
	const source = $derived(draft ?? json(props['value']));
	const example = $derived(json(props['control'].example));
	$effect(() => {
		if (JSON.stringify(props['value']) === emitted) return;
		draft = null;
		error = '';
	});
	function editJson(event: Event) {
		draft = (event.currentTarget as HTMLTextAreaElement).value;
		const result = transformStoryJson(draft, props['control'].example);
		if (!result.ok) {
			error = result.error;
			return;
		}
		error = '';
		emitted = JSON.stringify(result.value);
		props['onChange']?.(result.value);
	}
	return {
		get id(): typeof id {
			return id;
		},
		get text(): typeof text {
			return text;
		},
		get number(): typeof number {
			return number;
		},
		get error(): typeof error {
			return error;
		},
		set error(__nextValue: typeof error) {
			error = __nextValue;
		},
		get source(): typeof source {
			return source;
		},
		get example(): typeof example {
			return example;
		},
		get editJson(): typeof editJson {
			return editJson;
		}
	};
}
export default createStoryControlComponentState;
