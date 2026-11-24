import { JOINT_TOOLBAR_ITEMS } from '$stylist/domain/const/value/joint-toolbar-items';

import type { RecipeJointToolbar } from '$stylist/domain/interface/recipe/joint-toolbar';
/** Reactive behavior of joint-toolbar; props are read lazily when needed. */
export function createJointToolbarComponentState(
	getProps: () => Pick<RecipeJointToolbar, 'availableJoints'>
) {
	const props = $derived(getProps());
	const items = $derived(
		props['availableJoints']
			? props['availableJoints'].map((name) => ({ name }))
			: JOINT_TOOLBAR_ITEMS
	);
	return {
		get items(): typeof items {
			return items;
		}
	};
}
export default createJointToolbarComponentState;
