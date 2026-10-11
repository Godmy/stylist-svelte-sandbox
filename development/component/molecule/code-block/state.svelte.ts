import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipeCodeBlock } from '$stylist/development/interface/recipe/code-block';
import { CodeBlockManager } from '$stylist/development/class/manager/code-block';

export function createCodeBlockState(getProps: () => RecipeCodeBlock) {
	const props = $derived(getProps());
	let copied = $state(false);
	const codeLines = $derived(props.code?.split('\n') ?? []);
	const languageClass = $derived(`language-${props.language ?? 'text'}`);
	const containerClass = $derived(ClassNamesManager.merge('c-code-block', props.class ?? ''));
	const headerClassComputed = $derived(
		ClassNamesManager.merge('c-code-block__header', props.headerClass ?? '')
	);
	const lineNumbersContainerClass = $derived(
		ClassNamesManager.merge('c-code-block__line-numbers', props.lineNumberClass ?? '')
	);
	const lineNumberItemClass = (isHighlighted: boolean) =>
		ClassNamesManager.merge(
			'c-code-block__line-number',
			isHighlighted ? 'c-code-block__line-number--highlighted' : ''
		);
	const contentContainerClass = $derived(
		ClassNamesManager.merge('c-code-block__content', props.contentClass ?? '')
	);
	const preClass = $derived(ClassNamesManager.merge('c-code-block__pre', props.codeClass ?? ''));
	const headerContentClass = 'c-code-block__header-content';
	const titleClass = 'c-code-block__title';
	const tagsContainerClass = 'c-code-block__tags';
	const tagClass = 'c-code-block__tag';
	const copyButtonContainerClass = $derived(
		ClassNamesManager.merge(
			'c-code-block__copy',
			props.copyOnHover ? 'c-code-block__copy--on-hover' : ''
		)
	);
	const iconClass = 'c-code-block__icon';
	const getMainContentClass = 'c-code-block__main';

	function handleCopy() {
		CodeBlockManager.copyToClipboard(props.code ?? '', (copiedValue) => {
			copied = copiedValue;
		});
	}

	return {
		get copied() {
			return copied;
		},
		get codeLines() {
			return codeLines;
		},
		get languageClass() {
			return languageClass;
		},
		get containerClass() {
			return containerClass;
		},
		get headerClassComputed() {
			return headerClassComputed;
		},
		get lineNumbersContainerClass() {
			return lineNumbersContainerClass;
		},
		lineNumberItemClass,
		get contentContainerClass() {
			return contentContainerClass;
		},
		get preClass() {
			return preClass;
		},
		get headerContentClass() {
			return headerContentClass;
		},
		get titleClass() {
			return titleClass;
		},
		get tagsContainerClass() {
			return tagsContainerClass;
		},
		get tagClass() {
			return tagClass;
		},
		get copyButtonContainerClass() {
			return copyButtonContainerClass;
		},
		get iconClass() {
			return iconClass;
		},
		get getMainContentClass() {
			return getMainContentClass;
		},
		handleCopy
	};
}
