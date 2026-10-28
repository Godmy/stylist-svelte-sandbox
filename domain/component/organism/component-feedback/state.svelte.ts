import type { RecipeComponentFeedback } from '$stylist/domain/interface/recipe/component-feedback';

/** In-memory feedback for the story; no local server or persisted selection is used. */
export function createComponentFeedbackStoryState(): RecipeComponentFeedback['feedback'] {
	let selected = $state(true);
	let expanded = $state(true);
	let kind = $state('components');
	let note = $state('Review the heading icon.');
	return {
		get count() {
			return selected ? 1 : 0;
		},
		get expanded() {
			return expanded;
		},
		get kind() {
			return kind;
		},
		get note() {
			return note;
		},
		get paths() {
			return selected ? 'design-system\\html\\component\\atom\\h1' : '';
		},
		status: 'Story preview — changes stay in memory.',
		error: '',
		isSelected(id: string) {
			return selected && id === 'html/component/atom/h1';
		},
		toggle() {
			selected = !selected;
		},
		togglePanel() {
			expanded = !expanded;
		},
		setKind(value: string) {
			kind = value;
		},
		setNote(value: string) {
			note = value;
		},
		clear() {
			selected = false;
		},
		async copy() {
			await navigator.clipboard?.writeText(
				selected ? 'design-system\\html\\component\\atom\\h1' : ''
			);
		}
	};
}

export default createComponentFeedbackStoryState;
