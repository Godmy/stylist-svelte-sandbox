import { untrack } from 'svelte';
import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipeComponentPreview } from '$stylist/development/interface/recipe/component-preview';

export function createComponentPreviewState(getProps: () => RecipeComponentPreview) {
	const props = $derived(getProps());
	let activeTab = $state(untrack(() => props.showCode) ? 'code' : 'preview');

	const classes = $derived(ClassNamesManager.merge('c-component-preview', props.class ?? ''));
	const headerClasses = 'c-component-preview__header';
	const titleClasses = 'c-component-preview__title';
	const descriptionClasses = 'c-component-preview__description';
	const previewContainerClasses = 'c-component-preview__preview';
	const demoContainerClasses = 'c-component-preview__demo';
	const codeContainerClasses = 'c-component-preview__code';
	const tabContainerClasses = 'c-component-preview__tabs';
	const tabListClasses = 'c-component-preview__tab-list';
	const tabButtonClasses = (isActive: boolean) =>
		ClassNamesManager.merge(
			'c-component-preview__tab',
			isActive ? 'c-component-preview__tab--active' : 'c-component-preview__tab--inactive'
		);

	function setPreviewTab(tab: 'preview' | 'code') {
		activeTab = tab;
	}

	return {
		get activeTab() {
			return activeTab;
		},
		get classes() {
			return classes;
		},
		get headerClasses() {
			return headerClasses;
		},
		get titleClasses() {
			return titleClasses;
		},
		get descriptionClasses() {
			return descriptionClasses;
		},
		get previewContainerClasses() {
			return previewContainerClasses;
		},
		get demoContainerClasses() {
			return demoContainerClasses;
		},
		get codeContainerClasses() {
			return codeContainerClasses;
		},
		get tabContainerClasses() {
			return tabContainerClasses;
		},
		get tabListClasses() {
			return tabListClasses;
		},
		tabButtonClasses,
		setPreviewTab
	};
}
