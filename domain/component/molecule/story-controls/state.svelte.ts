import type { RecipeStoryControls } from '$stylist/domain/interface/recipe/story-controls';

export default function createStoryControlsState(getProps: () => RecipeStoryControls) {
	const props = $derived(getProps());
	let preset = $state('');
	let overrides = $state<Record<string, unknown>>({});

	const controls = $derived(Object.entries(props.story.controls ?? {}).filter(([, c]) => c));
	const presets = $derived(Object.keys(props.story.presets ?? {}));
	const args = $derived<Record<string, unknown>>({
		...props.story.args,
		...(preset ? props.story.presets?.[preset] : undefined),
		...overrides
	});

	$effect(() => {
		props.onChange?.($state.snapshot(args));
	});

	return {
		get controls() {
			return controls;
		},
		get presets() {
			return presets;
		},
		get preset() {
			return preset;
		},
		get args() {
			return args;
		},
		get changed() {
			return preset !== '' || Object.keys(overrides).length > 0;
		},
		selectPreset(name: string) {
			preset = name;
			overrides = {};
		},
		set(name: string, value: unknown) {
			overrides = { ...overrides, [name]: value };
		},
		reset() {
			preset = '';
			overrides = {};
		}
	};
}
