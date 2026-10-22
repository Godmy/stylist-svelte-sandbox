import PreviewSettings from '$stylist/domain/component/molecule/preview-settings/index.svelte';
import type { RecipePreviewSettings } from '$stylist/domain/interface/recipe/preview-settings';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Preview appearance panel; index.story.svelte keeps the environment onChange reports. */
export default {
	component: PreviewSettings,
	title: 'PreviewSettings',
	description:
		'Appearance panel that edits the preview environment: skin, mode, typography and density.',
	args: { value: { skin: true } },
	presets: { Dark: { value: { skin: true, mode: 'dark', density: 'compact' } } }
} satisfies ContractStory<RecipePreviewSettings>;
