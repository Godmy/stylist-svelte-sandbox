import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipeCodeEditor } from '$stylist/development/interface/recipe/code-editor';

export function createCodeEditorState(getProps: () => RecipeCodeEditor & { class?: string }) {
	const props = $derived(getProps());
	let internalCode = $derived(props.code ?? '');

	const containerClass = $derived(ClassNamesManager.merge('c-code-editor', props.class ?? ''));

	function handleCodeChange(newValue: string) {
		internalCode = newValue;
		props.onCodeChange?.(newValue);
	}

	function handleCopy() {
		navigator.clipboard.writeText(internalCode);
	}

	function handleDownload() {
		const blob = new Blob([internalCode], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = `code.${props.language ?? 'javascript'}`;
		anchor.click();
		URL.revokeObjectURL(url);
	}

	return {
		get internalCode() {
			return internalCode;
		},
		set internalCode(value: string) {
			internalCode = value;
		},
		get containerClass() {
			return containerClass;
		},
		handleCodeChange,
		handleCopy,
		handleDownload
	};
}
