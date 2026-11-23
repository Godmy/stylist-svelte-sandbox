import { onMount } from 'svelte';
import { MediaQuery } from 'svelte/reactivity';
import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';
import { DOMAIN_SCREEN } from '$stylist/domain/const/object/domain-screen';
import type { TypeDomainScreen } from '$stylist/domain/type/alias/domain-screen';
import type { RecipeDomainPlayground } from '$stylist/domain/interface/recipe/domain-playground';

export function createDomainPlaygroundState(getProps: () => RecipeDomainPlayground) {
	const props = $derived(getProps());
	const mobile = new MediaQuery('(max-width: 840px)');
	let currentScreen = $state<TypeDomainScreen>(getProps().initialScreen ?? DOMAIN_SCREEN.LANDING);
	let storyDevice = $state<DeviceFrameViewport>('desktop');
	let fullscreen = $state(false);
	onMount(() => {
		const mobile = window.matchMedia('(max-width: 840px)').matches;
		storyDevice = mobile ? 'mobile' : 'desktop';
		fullscreen = mobile;
	});
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
						: path === '/reports' && props.reports
							? DOMAIN_SCREEN.REPORTS
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
	function handleReportsToggle() {
		navigate('/reports');
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
		get mobile() {
			return mobile.current;
		},
		get storyDevice() {
			return storyDevice;
		},
		set storyDevice(value: DeviceFrameViewport) {
			storyDevice = value;
		},
		get fullscreen() {
			return fullscreen;
		},
		set fullscreen(value: boolean) {
			fullscreen = value;
		},
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
		handleReportsToggle,
		handleSettingsToggle,
		closeSettings,
		handleManifestReload
	};
}

export default createDomainPlaygroundState;
