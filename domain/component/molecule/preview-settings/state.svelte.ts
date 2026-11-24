import { PREVIEW_CONTROLS } from '$stylist/domain/const/object/preview-controls';
import type { RecipePreviewSettings } from '$stylist/domain/interface/recipe/preview-settings';
/** Reactive behavior of preview-settings; props are read lazily when needed. */
export function createPreviewSettingsComponentState(
	getProps: () => Pick<RecipePreviewSettings, 'appearance'> & {
		appearance: Exclude<RecipePreviewSettings['appearance'], undefined>;
	}
) {
	const props = $derived(getProps());
	const controls = $derived(
		Object.entries(PREVIEW_CONTROLS).filter(([name]) => props['appearance'] || name === 'locale')
	);
	return {
		get controls(): typeof controls {
			return controls;
		}
	};
}
export default createPreviewSettingsComponentState;
