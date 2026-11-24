import { onMount } from 'svelte';
import { DOMAIN_SCREEN } from '$stylist/domain/const/object/domain-screen';

import createStylistPreviewCatalogState from '$stylist/domain/function/state/stylist-preview-catalog/state.svelte';

import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';
import type { RecipeDomainPlayground } from '$stylist/domain/interface/recipe/domain-playground';
import type { RecipeDomainSettings } from '$stylist/domain/interface/recipe/domain-settings';
import { countDomainStories } from '$stylist/domain/function/count/stories';
import { MediaQuery } from 'svelte/reactivity';
import type { TypeDomainScreen } from '$stylist/domain/type/alias/domain-screen';
/** Reactive behavior of domain-playground; props are read lazily when needed. */
export function createDomainPlaygroundState(
	getProps: () => Pick<
		RecipeDomainPlayground,
		'tree' | 'initialScreen' | 'route' | 'onNavigate' | 'reports'
	> & {
		tree: Exclude<RecipeDomainPlayground['tree'], undefined>;
		initialScreen: Exclude<RecipeDomainPlayground['initialScreen'], undefined>;
	}
) {
	function createDomainPlaygroundState(getProps: () => RecipeDomainPlayground) {
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
			get storyDevice(): typeof storyDevice {
				return storyDevice;
			},
			set storyDevice(value: DeviceFrameViewport) {
				storyDevice = value;
			},
			get fullscreen(): typeof fullscreen {
				return fullscreen;
			},
			set fullscreen(value: boolean) {
				fullscreen = value;
			},
			get catalogVisited(): typeof catalogVisited {
				return catalogVisited;
			},
			get currentScreen(): typeof currentScreen {
				return currentScreen;
			},
			get isSettingsOpen(): typeof isSettingsOpen {
				return isSettingsOpen;
			},
			get selectedStoryPath(): typeof selectedStoryPath {
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
	const props = $derived(getProps());
	const screenState = createDomainPlaygroundState(() => ({
		initialScreen: props['initialScreen'],
		route: props['route'],
		onNavigate: props['onNavigate'],
		reports: props['reports']
	}));
	const catalog = createStylistPreviewCatalogState(() => props['tree']);
	const selectedStory = $derived(screenState.selectedStoryPath.split('/'));
	let iconSizes = $state<NonNullable<RecipeDomainSettings['iconSizes']>>({
		module: 32,
		domain: 32,
		cluster: 24,
		joint: 24,
		search: 24
	});
	let iconSizesLoaded = $state(false);
	onMount(() => {
		if (window.matchMedia('(max-width: 840px)').matches) storyWidths.mobile = window.innerWidth;
		try {
			const saved = JSON.parse(localStorage.getItem('stylist-domain-icon-sizes') ?? 'null');
			for (const key of ['module', 'domain', 'cluster', 'joint', 'search'] as const) {
				const size = saved?.[key];
				if (typeof size === 'number' && Number.isInteger(size) && size >= 12 && size <= 32) {
					iconSizes[key] = size;
				}
			}
		} catch {
			// Storage can be unavailable or contain an outdated value.
		}
		iconSizesLoaded = true;
	});
	$effect(() => {
		if (!iconSizesLoaded) return;
		const saved = JSON.stringify(iconSizes);
		try {
			localStorage.setItem('stylist-domain-icon-sizes', saved);
		} catch {
			// Resizing still works when browser storage is unavailable.
		}
	});
	let storyWidths = $state<Record<DeviceFrameViewport, number | null>>({
		mobile: 375,
		tablet: 768,
		desktop: 1440,
		fullscreen: null
	});
	let deviceViewportVisible = $state(false);
	const storyModuleCount = $derived(countDomainStories(props['tree']));
	const loadStylistPreview = () =>
		import('$stylist/domain/component/page/stylist-preview/index.svelte');
	const loadDomainExplorer = () =>
		import('$stylist/domain/component/organism/domain-explorer/index.svelte');
	const loadDomainHowItWorks = () =>
		import('$stylist/domain/component/page/domain-how-it-works/index.svelte');
	const loadDomainSettings = () =>
		import('$stylist/domain/component/organism/domain-settings/index.svelte');
	return {
		get screenState(): typeof screenState {
			return screenState;
		},
		get catalog(): typeof catalog {
			return catalog;
		},
		get selectedStory(): typeof selectedStory {
			return selectedStory;
		},
		get iconSizes(): typeof iconSizes {
			return iconSizes;
		},
		set iconSizes(__nextValue: typeof iconSizes) {
			iconSizes = __nextValue;
		},
		get storyWidths(): typeof storyWidths {
			return storyWidths;
		},
		set storyWidths(__nextValue: typeof storyWidths) {
			storyWidths = __nextValue;
		},
		get deviceViewportVisible(): typeof deviceViewportVisible {
			return deviceViewportVisible;
		},
		set deviceViewportVisible(__nextValue: typeof deviceViewportVisible) {
			deviceViewportVisible = __nextValue;
		},
		get storyModuleCount(): typeof storyModuleCount {
			return storyModuleCount;
		},
		get loadStylistPreview(): typeof loadStylistPreview {
			return loadStylistPreview;
		},
		get loadDomainExplorer(): typeof loadDomainExplorer {
			return loadDomainExplorer;
		},
		get loadDomainHowItWorks(): typeof loadDomainHowItWorks {
			return loadDomainHowItWorks;
		},
		get loadDomainSettings(): typeof loadDomainSettings {
			return loadDomainSettings;
		}
	};
}
export default createDomainPlaygroundState;
