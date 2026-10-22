import type { HTMLAttributes } from 'svelte/elements';
import type { RecipeCodeViewer } from '$stylist/development/interface/recipe/code-viewer';
import { highlightCode } from '$stylist/development/function/transform/code-highlight';
export function createCodeViewerState(
	getProps: () => RecipeCodeViewer & HTMLAttributes<HTMLDivElement>
) {
	const code = $derived(getProps().code ?? '');
	const componentName = $derived(getProps().componentName ?? '');
	const language = $derived(getProps().language ?? 'svelte');
	let darkMode = $state(false);
	const isDark = $derived(
		getProps().theme ? ['dark', 'github-dark'].includes(getProps().theme!) : darkMode
	);
	const highlightedCode = $derived(highlightCode(code, language));

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(code);
			getProps().onCopySuccess?.();
		} catch (error) {
			console.error('Copy error', error);
			getProps().onCopyError?.(error);
		}
	};

	const downloadCode = () => {
		let url: string | undefined;
		let anchor: HTMLAnchorElement | undefined;
		try {
			url = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
			anchor = document.createElement('a');
			anchor.href = url;
			const extension = ['svelte', 'html', 'css'].includes(language.toLowerCase())
				? language.toLowerCase()
				: 'txt';
			anchor.download = `${componentName || 'component'}.${extension}`;
			document.body.appendChild(anchor);
			anchor.click();
			getProps().onDownloadSuccess?.();
		} catch (error) {
			console.error('Download error', error);
			getProps().onDownloadError?.(error);
		} finally {
			anchor?.remove();
			if (url) URL.revokeObjectURL(url);
		}
	};

	return {
		get code() {
			return code;
		},
		get componentName() {
			return componentName;
		},
		get language() {
			return language;
		},
		get highlightedCode() {
			return highlightedCode;
		},
		get isDark() {
			return isDark;
		},
		set darkMode(value: boolean) {
			darkMode = value;
		},
		copyCode,
		downloadCode
	};
}
