import { untrack } from 'svelte';
import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipeContentEditorStateProps } from '$stylist/development/interface/recipe/content-editor-state-props';
import type { ContentType } from '$stylist/development/type/alias/content-editor-content-type';

type ContentElement = NonNullable<RecipeContentEditorStateProps['initialContent']>[number];

export const createContentEditorState = (getProps: () => RecipeContentEditorStateProps) => {
	const props = $derived(getProps());
	// SlotState
	let contentElements = $state<ContentElement[]>(
		untrack(() => props.initialContent) ?? [{ id: '1', type: 'text', content: '' }]
	);
	let activeElementId: string | null = $state(null);
	let isPreviewMode = $state(false);

	// Set the first element as active by default
	$effect(() => {
		if (contentElements.length > 0 && !activeElementId) {
			activeElementId = contentElements[0].id;
		}
	});

	function updateContent(id: string, newContent: string) {
		contentElements = contentElements.map((el) =>
			el.id === id ? { ...el, content: newContent } : el
		);
	}

	function addNewElement(index: number, type: ContentType = 'text') {
		const newElement: ContentElement = {
			id: `element-${Date.now()}`,
			type,
			content: ''
		};

		contentElements = [
			...contentElements.slice(0, index + 1),
			newElement,
			...contentElements.slice(index + 1)
		];

		activeElementId = newElement.id;
	}

	function deleteElement(id: string) {
		if (contentElements.length <= 1) return;

		const index = contentElements.findIndex((el) => el.id === id);
		contentElements = contentElements.filter((el) => el.id !== id);

		if (activeElementId === id) {
			activeElementId = index > 0 ? contentElements[index - 1].id : contentElements[0]?.id || null;
		}
	}

	function moveElement(id: string, direction: 'up' | 'down') {
		const index = contentElements.findIndex((el) => el.id === id);
		if (index === -1) return;

		if (direction === 'up' && index > 0) {
			const newElements = [...contentElements];
			[newElements[index - 1], newElements[index]] = [newElements[index], newElements[index - 1]];
			contentElements = newElements;
		} else if (direction === 'down' && index < contentElements.length - 1) {
			const newElements = [...contentElements];
			[newElements[index + 1], newElements[index]] = [newElements[index], newElements[index + 1]];
			contentElements = newElements;
		}
	}

	function formatText(command: string) {
		document.execCommand(command, false);
	}

	function togglePreview() {
		isPreviewMode = !isPreviewMode;
		props.onPreview?.();
	}

	function handleSave() {
		props.onSave?.(contentElements);
	}

	function setActiveElementId(id: string | null) {
		activeElementId = id;
	}

	function setIsPreviewMode(value: boolean) {
		isPreviewMode = value;
	}

	// Computed classes
	const rootClasses = $derived.by(() => ClassNamesManager.merge('c-content-editor', props.class));

	const toolbarClasses = $derived.by(() =>
		ClassNamesManager.merge('c-content-editor__toolbar', props.toolbarClass)
	);

	const editorClasses = $derived.by(() =>
		ClassNamesManager.merge('c-content-editor__editor', props.editorClass)
	);

	const contentClasses = $derived.by(() =>
		ClassNamesManager.merge('c-content-editor__content', props.contentClass)
	);

	const activeElementClasses = $derived.by(() => 'c-content-editor__content--active');

	const inactiveElementClasses = $derived.by(() => 'c-content-editor__content--inactive');

	const buttonClasses = $derived.by(() => 'c-content-editor__btn');

	const dividerClasses = $derived.by(() => 'c-content-editor__divider');

	const iconButtonClasses = $derived.by(() => 'c-content-editor__icon');

	const moveButtonClasses = $derived.by(() => 'c-content-editor__move-btn');

	const deleteButtonClasses = $derived.by(() => 'c-content-editor__delete-btn');

	const addButtonTextClasses = $derived.by(() => 'c-content-editor__add-btn');

	const addIconClasses = $derived.by(() => 'c-content-editor__add-icon');

	const previewClasses = $derived.by(() => 'c-content-editor__preview');

	const headingClasses = $derived.by(() => 'c-content-editor__heading');

	const quoteClasses = $derived.by(() => 'c-content-editor__quote');

	const listClasses = $derived.by(() => 'c-content-editor__list');

	const textareaClasses = $derived.by(() => 'c-content-editor__textarea');

	const headingInputClasses = $derived.by(() => 'c-content-editor__heading-input');

	const quoteTextareaClasses = $derived.by(() => 'c-content-editor__quote-textarea');

	const imagePlaceholderClasses = $derived.by(() => 'c-content-editor__image-placeholder');

	const imagePlaceholderIconClasses = $derived.by(() => 'c-content-editor__image-icon');

	const imagePlaceholderTextClasses = $derived.by(() => 'c-content-editor__image-text');

	const imagePlaceholderHintClasses = $derived.by(() => 'c-content-editor__image-hint');

	return {
		// SlotState getters
		get contentElements() {
			return contentElements;
		},
		get activeElementId() {
			return activeElementId;
		},
		get isPreviewMode() {
			return isPreviewMode;
		},

		// Actions
		setActiveElementId,
		setIsPreviewMode,
		setContentElements(elements: ContentElement[]) {
			contentElements = elements;
		},

		// Handlers
		updateContent,
		addNewElement,
		deleteElement,
		moveElement,
		formatText,
		togglePreview,
		handleSave,

		// Classes
		get rootClasses() {
			return rootClasses;
		},
		get toolbarClasses() {
			return toolbarClasses;
		},
		get editorClasses() {
			return editorClasses;
		},
		get contentClasses() {
			return contentClasses;
		},
		get activeElementClasses() {
			return activeElementClasses;
		},
		get inactiveElementClasses() {
			return inactiveElementClasses;
		},
		get buttonClasses() {
			return buttonClasses;
		},
		get dividerClasses() {
			return dividerClasses;
		},
		get iconButtonClasses() {
			return iconButtonClasses;
		},
		get moveButtonClasses() {
			return moveButtonClasses;
		},
		get deleteButtonClasses() {
			return deleteButtonClasses;
		},
		get addButtonTextClasses() {
			return addButtonTextClasses;
		},
		get addIconClasses() {
			return addIconClasses;
		},
		get previewClasses() {
			return previewClasses;
		},
		get headingClasses() {
			return headingClasses;
		},
		get quoteClasses() {
			return quoteClasses;
		},
		get listClasses() {
			return listClasses;
		},
		get textareaClasses() {
			return textareaClasses;
		},
		get headingInputClasses() {
			return headingInputClasses;
		},
		get quoteTextareaClasses() {
			return quoteTextareaClasses;
		},
		get imagePlaceholderClasses() {
			return imagePlaceholderClasses;
		},
		get imagePlaceholderIconClasses() {
			return imagePlaceholderIconClasses;
		},
		get imagePlaceholderTextClasses() {
			return imagePlaceholderTextClasses;
		},
		get imagePlaceholderHintClasses() {
			return imagePlaceholderHintClasses;
		}
	};
};

export default createContentEditorState;
