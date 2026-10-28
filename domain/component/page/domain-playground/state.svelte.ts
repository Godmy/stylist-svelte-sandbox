import { DOMAIN_SCREEN } from '$stylist/domain/const/object/domain-screen';
import type { TypeDomainScreen } from '$stylist/domain/type/alias/domain-screen';
import type { RecipeDomainPlayground } from '$stylist/domain/interface/recipe/domain-playground';

export function createDomainPlaygroundState(getProps: () => RecipeDomainPlayground) {
	const props = $derived(getProps());
	let currentScreen = $state<TypeDomainScreen>(getProps().initialScreen ?? DOMAIN_SCREEN.LANDING);
	let isSettingsOpen = $state(false);
	let selectedStoryPath = $state('');
	let catalogVisited = $state(getProps().initialScreen === DOMAIN_SCREEN.COMPONENTS);
	let settingsReturnRoute = '/';

	function applyRoute(route: string) {
		const url = new URL(route, 'https://stylist.invalid');
		const path = url.pathname.replace(/\/$/, '') || '/';
		isSettingsOpen = path === '/settings';
		if (isSettingsOpen) return;
		settingsReturnRoute = route;
		currentScreen =
			path === '/components'
				? DOMAIN_SCREEN.COMPONENTS
				: path === '/playground'
					? DOMAIN_SCREEN.DOMAIN
					: path === '/about'
						? DOMAIN_SCREEN.HOW_IT_WORKS
						: DOMAIN_SCREEN.LANDING;
		selectedStoryPath =
			path === '/playground' ? url.searchParams.get('component') || 'html/component/atom/h1' : '';
		if (currentScreen === DOMAIN_SCREEN.COMPONENTS) catalogVisited = true;
	}

	if (getProps().route) applyRoute(getProps().route!);
	$effect(() => {
		if (props.route) applyRoute(props.route);
	});

	function navigate(route: string) {
		if (props.onNavigate) {
			if (route !== props.route) props.onNavigate(route);
		} else {
			applyRoute(route);
			if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
		}
	}

	function handleComponentsToggle() {
		navigate('/components');
	}
	function openStory(path: string) {
		navigate('/playground?component=' + encodeURIComponent(path));
	}
	function handleDomainToggle() {
		navigate('/playground');
	}
	function handleLandingToggle() {
		navigate('/');
	}
	function handleHowItWorksToggle() {
		navigate('/about');
	}
	function handleSettingsToggle() {
		if (isSettingsOpen) closeSettings();
		else navigate('/settings');
	}
	function closeSettings() {
		navigate(settingsReturnRoute);
	}

	function handleManifestReload() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}

	return {
		get catalogVisited() {
			return catalogVisited;
		},
		get currentScreen() {
			return currentScreen;
		},
		get isSettingsOpen() {
			return isSettingsOpen;
		},
		get selectedStoryPath() {
			return selectedStoryPath;
		},
		handleComponentsToggle,
		openStory,
		handleDomainToggle,
		handleLandingToggle,
		handleHowItWorksToggle,
		handleSettingsToggle,
		closeSettings,
		handleManifestReload
	};
}

export default createDomainPlaygroundState;
