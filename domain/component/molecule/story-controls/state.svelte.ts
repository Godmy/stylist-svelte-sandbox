import type { RecipeStoryControls } from '$stylist/domain/interface/recipe/story-controls';
import { resolveHtmlText } from '$stylist/html/function/resolve/html-text';
import { transformHtmlText } from '$stylist/html/function/transform/html-text';
import { resolveStoryControls } from '$stylist/domain/function/resolve/story-controls';
/** Reactive behavior of story-controls; props are read lazily when needed. */
export function createStoryControlsState(getProps: () => RecipeStoryControls) {
	function createStoryControlsState(getProps: () => RecipeStoryControls) {
		const props = $derived(getProps());
		let preset = $state('');
		let overrides = $state<Record<string, unknown>>({});
		let text = $state<string | undefined>();
		let tab = $state<'controls' | 'html'>('controls');

		const controls = $derived(resolveStoryControls(props.story));
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
			get controls(): typeof controls {
				return controls;
			},
			get presets(): typeof presets {
				return presets;
			},
			get preset(): typeof preset {
				return preset;
			},
			get args(): typeof args {
				return args;
			},
			get text() {
				return text ?? defaultText;
			},
			get markup(): typeof markup {
				return markup;
			},
			get tab(): typeof tab {
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
	const props = $derived(getProps());
	const controlsState = createStoryControlsState(() => props);
	const TEXT = { type: 'text', label: 'Text content' } as const;
	let copied = $state(false);
	let copyError = $state('');
	async function copy() {
		if (!controlsState.markup) return;
		copyError = '';
		try {
			if (!navigator.clipboard)
				throw new Error('Clipboard is unavailable. Select the HTML to copy it.');
			await navigator.clipboard.writeText(controlsState.markup);
			copied = true;
			setTimeout(() => (copied = false), 1200);
		} catch {
			copyError = 'Unable to copy. Select the HTML to copy it.';
		}
	}
	return {
		get controlsState(): typeof controlsState {
			return controlsState;
		},
		get TEXT(): typeof TEXT {
			return TEXT;
		},
		get copied(): typeof copied {
			return copied;
		},
		set copied(__nextValue: typeof copied) {
			copied = __nextValue;
		},
		get copyError(): typeof copyError {
			return copyError;
		},
		set copyError(__nextValue: typeof copyError) {
			copyError = __nextValue;
		},
		get copy(): typeof copy {
			return copy;
		}
	};
}
export default createStoryControlsState;
