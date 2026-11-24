import type { RecipeJsonTreeViewer } from '$stylist/domain/interface/recipe/json-tree-viewer';
/** Reactive behavior of json-tree-viewer; props are read lazily when needed. */
export function createJsonTreeViewerComponentState(
	getProps: () => Pick<RecipeJsonTreeViewer, 'content'> & {
		content: Exclude<RecipeJsonTreeViewer['content'], undefined>;
	}
) {
	const props = $derived(getProps());
	const parsed = $derived.by(() => {
		try {
			return { value: JSON.parse(props['content']) as unknown, error: null };
		} catch (e) {
			return { value: null, error: (e as Error).message };
		}
	});
	let collapsed = $state(new Set<string>());
	function toggle(path: string) {
		const next = new Set(collapsed);
		if (next.has(path)) next.delete(path);
		else next.add(path);
		collapsed = next;
	}
	function isOpen(path: string) {
		return !collapsed.has(path);
	}
	function typeOf(value: unknown): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		if (typeof value === 'object') return 'object';
		return typeof value as 'string' | 'number' | 'boolean';
	}
	return {
		get parsed(): typeof parsed {
			return parsed;
		},
		get toggle(): typeof toggle {
			return toggle;
		},
		get isOpen(): typeof isOpen {
			return isOpen;
		},
		get typeOf(): typeof typeOf {
			return typeOf;
		}
	};
}
export default createJsonTreeViewerComponentState;
