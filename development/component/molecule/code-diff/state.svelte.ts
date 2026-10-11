import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipeCodeDiff } from '$stylist/development/interface/recipe/code-diff';

export function createCodeDiffState(getProps: () => RecipeCodeDiff) {
	const props = $derived(getProps());
	function computeDiffLines(
		original: string,
		modified: string
	): {
		type: 'unchanged' | 'added' | 'removed' | 'changed';
		original: string | null;
		modified: string | null;
		lineNumber: number;
	}[] {
		const originalLines = original.split('\n');
		const modifiedLines = modified.split('\n');
		const lines: {
			type: 'unchanged' | 'added' | 'removed' | 'changed';
			original: string | null;
			modified: string | null;
			lineNumber: number;
		}[] = [];
		const maxLines = Math.max(originalLines.length, modifiedLines.length);

		for (let index = 0; index < maxLines; index++) {
			const originalLine = index < originalLines.length ? originalLines[index] : null;
			const modifiedLine = index < modifiedLines.length ? modifiedLines[index] : null;

			if (originalLine === modifiedLine) {
				lines.push({
					type: 'unchanged',
					original: originalLine,
					modified: modifiedLine,
					lineNumber: index + 1
				});
			} else {
				lines.push({
					type: originalLine === null ? 'added' : modifiedLine === null ? 'removed' : 'changed',
					original: originalLine,
					modified: modifiedLine,
					lineNumber: index + 1
				});
			}
		}

		return lines;
	}

	const diffLines = $derived(computeDiffLines(props.original ?? '', props.modified ?? ''));
	const containerClass = $derived(ClassNamesManager.merge('c-code-diff', props.class ?? ''));
	const headerClassComputed = $derived(
		ClassNamesManager.merge('c-code-diff__header', props.headerClass ?? '')
	);
	const mainContentClass = 'c-code-diff__main';
	const lineNumbersContainerClass = 'c-code-diff__line-numbers';
	const lineNumberItemClass = 'c-code-diff__line-number';
	const contentContainerClass = $derived(
		ClassNamesManager.merge('c-code-diff__content', props.contentClass ?? '')
	);
	const diffLineClass = (type: string) =>
		ClassNamesManager.merge('c-code-diff__line', `c-code-diff__line--${type}`);
	const diffSpanClass = (type: string) =>
		ClassNamesManager.merge('c-code-diff__text', `c-code-diff__text--${type}`);
	const getDiffContentClass = 'c-code-diff__body';
	const getChangedContainerClass = 'c-code-diff__changed';

	return {
		get diffLines() {
			return diffLines;
		},
		get containerClass() {
			return containerClass;
		},
		get headerClassComputed() {
			return headerClassComputed;
		},
		get mainContentClass() {
			return mainContentClass;
		},
		get lineNumbersContainerClass() {
			return lineNumbersContainerClass;
		},
		get lineNumberItemClass() {
			return lineNumberItemClass;
		},
		get contentContainerClass() {
			return contentContainerClass;
		},
		diffLineClass,
		diffSpanClass,
		get getDiffContentClass() {
			return getDiffContentClass;
		},
		get getChangedContainerClass() {
			return getChangedContainerClass;
		}
	};
}
