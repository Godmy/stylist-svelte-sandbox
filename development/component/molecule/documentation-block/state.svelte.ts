import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipeDocumentationBlock } from '$stylist/development/interface/recipe/documentation-block';

export function createDocumentationBlockState(getProps: () => RecipeDocumentationBlock) {
	const props = $derived(getProps());
	const variant = $derived(props.variant ?? 'default');
	const containerClass = $derived(
		ClassNamesManager.merge(
			'c-documentation-block',
			`c-documentation-block--${variant}`,
			props.class
		)
	);
	const headerContainerClass = $derived(
		ClassNamesManager.merge(
			'c-documentation-block__header',
			`c-documentation-block__header--${variant}`
		)
	);
	const headerContentClass = 'c-documentation-block__header-content';
	const titleClass = 'c-documentation-block__title';
	const tagsContainerClass = 'c-documentation-block__tags';
	const tagClass = 'c-documentation-block__tag';
	const contentClass = 'c-documentation-block__content';
	const codeExamplesContainerClass = 'c-documentation-block__examples';
	const codeExampleDividerClass = 'c-documentation-block__divider';

	return {
		get containerClass() {
			return containerClass;
		},
		get headerContainerClass() {
			return headerContainerClass;
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
		get contentClass() {
			return contentClass;
		},
		get codeExamplesContainerClass() {
			return codeExamplesContainerClass;
		},
		get codeExampleDividerClass() {
			return codeExampleDividerClass;
		}
	};
}
