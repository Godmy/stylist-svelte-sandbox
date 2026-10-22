import type { HTMLAttributes } from 'svelte/elements';
import type { RecipeGenericCodeViewer } from '$stylist/development/interface/recipe/generic-code-viewer';
import { highlightCode } from '$stylist/development/function/transform/code-highlight';
export function createGenericCodeViewerState(
	getProps: () => RecipeGenericCodeViewer & HTMLAttributes<HTMLDivElement>
) {
	const code = $derived(getProps().code ?? '');
	const language = $derived(getProps().language ?? 'svelte');
	const highlightedCode = $derived(highlightCode(code, language));
	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout> | undefined;

	async function copyCode() {
		try {
			if (code) {
				await navigator.clipboard.writeText(code);
				copied = true;
				clearTimeout(copyTimeout);
				copyTimeout = setTimeout(() => {
					copied = false;
				}, 2000);
			}
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	return {
		get code() {
			return code;
		},
		get language() {
			return language;
		},
		get copied() {
			return copied;
		},
		get highlightedCode() {
			return highlightedCode;
		},
		copyCode,
		destroy() {
			clearTimeout(copyTimeout);
		}
	};
}
