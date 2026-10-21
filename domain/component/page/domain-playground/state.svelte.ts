import { DOMAIN_SCREEN } from '$stylist/domain/const/object/domain-screen';
import type { TypeDomainScreen } from '$stylist/domain/type/alias/domain-screen';
import type { RecipeDomainPlayground } from '$stylist/domain/interface/recipe/domain-playground';

export function createDomainPlaygroundState(
	initialScreen: RecipeDomainPlayground['initialScreen'] = DOMAIN_SCREEN.LANDING
) {
	let currentScreen = $state<TypeDomainScreen>(initialScreen);
	let isSettingsOpen = $state(false);

	function handleDomainToggle() {
		currentScreen = DOMAIN_SCREEN.DOMAIN;
	}

	function handleLandingToggle() {
		currentScreen = DOMAIN_SCREEN.LANDING;
	}

	function handleDiagnosticsToggle() {
		currentScreen = DOMAIN_SCREEN.DIAGNOSTICS;
	}

	function handleHowItWorksToggle() {
		currentScreen = DOMAIN_SCREEN.HOW_IT_WORKS;
		// The guide is a long read: always open it from the top, wherever the landing was scrolled.
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0 });
		}
	}

	function handleSettingsToggle() {
		isSettingsOpen = !isSettingsOpen;
	}

	function closeSettings() {
		isSettingsOpen = false;
	}

	function handleManifestReload() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}

	return {
		get currentScreen() {
			return currentScreen;
		},
		get isSettingsOpen() {
			return isSettingsOpen;
		},
		handleDomainToggle,
		handleLandingToggle,
		handleDiagnosticsToggle,
		handleHowItWorksToggle,
		handleSettingsToggle,
		closeSettings,
		handleManifestReload
	};
}

export default createDomainPlaygroundState;
