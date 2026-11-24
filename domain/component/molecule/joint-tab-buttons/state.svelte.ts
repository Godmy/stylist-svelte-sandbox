import { TOKEN_FLAG_REGISTRY } from '$stylist/svg/const/record/flag-registry';
import { resolveFamilyIcon } from '$stylist/domain/function/resolve/family-icon';
import type { RecipeJointTabButtons } from '$stylist/domain/interface/recipe/joint-tab-buttons';
import { isIconName } from '$stylist/svg/function/check/icon-name';
/** Reactive behavior of joint-tab-buttons; props are read lazily when needed. */
export function createJointTabButtonsComponentState(
	getProps: () => Pick<RecipeJointTabButtons, 'selectedEntityName' | 'activeJoint'> & {
		selectedEntityName: Exclude<RecipeJointTabButtons['selectedEntityName'], undefined>;
		activeJoint: Exclude<RecipeJointTabButtons['activeJoint'], undefined>;
	}
) {
	const props = $derived(getProps());
	// Flags of `data/flag` show themselves; everything else takes a fitting icon or stays empty.
	const flagCode = $derived(
		props['activeJoint'] === 'flag' && props['selectedEntityName'] in TOKEN_FLAG_REGISTRY
			? props['selectedEntityName']
			: null
	);
	const iconName = $derived.by(() => {
		const picked = flagCode ? null : resolveFamilyIcon(props['selectedEntityName'], isIconName);
		return isIconName(picked) ? picked : null;
	});
	return {
		get flagCode(): typeof flagCode {
			return flagCode;
		},
		get iconName(): typeof iconName {
			return iconName;
		}
	};
}
export default createJointTabButtonsComponentState;
