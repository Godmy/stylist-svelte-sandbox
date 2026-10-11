import { ClassNamesManager } from '$stylist/layout/class/manager/class-names';
import type { RecipePrivacySettings } from '$stylist/development/interface/recipe/privacy-settings';

export function createPrivacySettingsState(getProps: () => RecipePrivacySettings) {
	const props = $derived(getProps());
	let localSettings = $derived([...(props.settings ?? [])]);

	const containerClass = $derived(ClassNamesManager.merge('c-privacy-settings', props.class ?? ''));
	const titleClass = $derived('c-privacy-settings__title');
	const settingsContainerClass = $derived('c-privacy-settings__list');
	const settingItemClass = $derived('c-privacy-settings__item');
	const settingContentClass = $derived('c-privacy-settings__content');
	const settingLabelClass = $derived('c-privacy-settings__label');
	const settingDescriptionClass = $derived('c-privacy-settings__description');
	const toggleContainerClass = $derived('c-privacy-settings__toggle');
	const toggleInputClass = $derived('c-privacy-settings__toggle-input');
	const toggleTrackClass = (isEnabled: boolean) =>
		ClassNamesManager.merge(
			'c-privacy-settings__toggle-track',
			isEnabled ? 'c-privacy-settings__toggle-track--enabled' : ''
		);
	const toggleThumbClass = (isEnabled: boolean) =>
		ClassNamesManager.merge(
			'c-privacy-settings__toggle-thumb',
			isEnabled ? 'c-privacy-settings__toggle-thumb--enabled' : ''
		);
	const saveButtonContainerClass = $derived('c-privacy-settings__actions');
	const saveButtonClass = $derived('c-privacy-settings__save-button');

	function toggleSetting(id: string) {
		const index = localSettings.findIndex((s) => s.id === id);
		if (index !== -1) {
			localSettings = localSettings.map((setting, at) =>
				at === index ? { ...setting, enabled: !setting.enabled } : setting
			);
		}
	}

	return {
		get localSettings() {
			return localSettings;
		},
		get containerClass() {
			return containerClass;
		},
		get titleClass() {
			return titleClass;
		},
		get settingsContainerClass() {
			return settingsContainerClass;
		},
		get settingItemClass() {
			return settingItemClass;
		},
		get settingContentClass() {
			return settingContentClass;
		},
		get settingLabelClass() {
			return settingLabelClass;
		},
		get settingDescriptionClass() {
			return settingDescriptionClass;
		},
		get toggleContainerClass() {
			return toggleContainerClass;
		},
		get toggleInputClass() {
			return toggleInputClass;
		},
		toggleTrackClass,
		toggleThumbClass,
		get saveButtonContainerClass() {
			return saveButtonContainerClass;
		},
		get saveButtonClass() {
			return saveButtonClass;
		},
		toggleSetting
	};
}
