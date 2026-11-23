import type { RecipeDomainSettings } from '$stylist/domain/interface/recipe/domain-settings';

export default function createDomainSettingsState(getProps: () => RecipeDomainSettings) {
	let element = $state<HTMLDialogElement>();
	$effect(() => {
		const { open, modal } = getProps();
		if (!element) return;
		if (element.open) element.close();
		if (open) {
			if (modal) element.showModal();
			else element.show();
		}
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
