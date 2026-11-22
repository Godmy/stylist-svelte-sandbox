import type { RecipeDomainSettings } from '$stylist/domain/interface/recipe/domain-settings';

export default function createDomainSettingsState(getProps: () => RecipeDomainSettings) {
	let element = $state<HTMLDialogElement>();
	$effect(() => {
		if (getProps().open && element && !element.open) element.showModal();
		else if (!getProps().open && element?.open) element.close();
	});
	return {
		get element() {
			return element;
		},
		set element(value: HTMLDialogElement | undefined) {
			element = value;
		}
	};
}
