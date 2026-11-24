import type { RecipeStoryCanvas } from '$stylist/domain/interface/recipe/story-canvas';
import { resolvePreviewVariables } from '$stylist/domain/function/resolve/preview-variables';
import { serializeHtmlStylesheet } from '$stylist/html/function/serialize/html-stylesheet';

/** Reactive behavior of story-canvas; props are read lazily when needed. */
export function createStoryCanvasComponentState(
	getProps: () => Pick<RecipeStoryCanvas, 'story' | 'args' | 'content' | 'environment'>
) {
	const props = $derived(getProps());
	let root = $state<HTMLDivElement>();
	const skin = $derived(props['environment'] !== undefined && props['environment'].skin !== false);
	const stylesheet = serializeHtmlStylesheet();
	$effect(() => {
		if (!root || !props['environment'] || !skin) return;
		const target = root;
		const vars = resolvePreviewVariables(props['environment']);
		const previous = Object.keys(vars).map(
			(key) => [key, target.style.getPropertyValue(key)] as const
		);
		for (const [key, value] of Object.entries(vars)) target.style.setProperty(key, value);
		return () => {
			for (const [key, value] of previous) {
				if (value) target.style.setProperty(key, value);
				else target.style.removeProperty(key);
			}
		};
	});
	const values = $derived(props['args'] ?? props['story'].args ?? {});
	const nodes = $derived(props['content'] ?? props['story'].content);
	return {
		get root(): typeof root {
			return root;
		},
		set root(__nextValue: typeof root) {
			root = __nextValue;
		},
		get skin(): typeof skin {
			return skin;
		},
		get stylesheet(): typeof stylesheet {
			return stylesheet;
		},
		get values(): typeof values {
			return values;
		},
		get nodes(): typeof nodes {
			return nodes;
		}
	};
}
export default createStoryCanvasComponentState;
