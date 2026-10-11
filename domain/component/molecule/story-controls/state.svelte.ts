import { resolveHtmlText } from '$stylist/html/function/resolve/html-text';
import { transformHtmlText } from '$stylist/html/function/transform/html-text';
import type { RecipeStoryControls } from '$stylist/domain/interface/recipe/story-controls';

export default function createStoryControlsState(getProps: () => RecipeStoryControls) {
	const props = $derived(getProps());
	let preset = $state('');
	let overrides = $state<Record<string, unknown>>({});
	let text = $state<string | undefined>();
	let tab = $state<'controls' | 'html'>('controls');

	const controls = $derived(Object.entries(props.story.controls ?? {}).filter(([, c]) => c));
	const presets = $derived(Object.keys(props.story.presets ?? {}));
	const args = $derived<Record<string, unknown>>({
		...props.story.args,
		...(preset ? props.story.presets?.[preset] : undefined),
		...overrides
	});
	// Content with a single text node gets a text control; its edits replace that text.
	const defaultText = $derived(resolveHtmlText(props.story.content ?? []));
	const content = $derived(
		props.story.content && defaultText !== null && text !== undefined
			? transformHtmlText(props.story.content, text)
			: props.story.content
	);
	const markup = $derived(props.markup?.(args, content) ?? null);

	$effect(() => {
		props.onChange?.($state.snapshot(args), content && $state.snapshot(content));
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
		get text() {
			return text ?? defaultText;
		},
		get markup() {
			return markup;
		},
		get tab() {
			return tab;
		},
		get changed() {
			return preset !== '' || Object.keys(overrides).length > 0 || text !== undefined;
		},
		selectTab(next: 'controls' | 'html') {
			tab = next;
		},
		selectPreset(name: string) {
			preset = name;
			overrides = {};
		},
		set(name: string, value: unknown) {
			overrides = { ...overrides, [name]: value };
		},
		setText(value: unknown) {
			text = String(value ?? '');
		},
		reset() {
			preset = '';
			overrides = {};
			text = undefined;
		}
	};
}
