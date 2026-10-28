export interface RecipeDomainMenu {
	landingVisible?: boolean;
	componentsVisible?: boolean;
	domainVisible?: boolean;
	howItWorksOpen?: boolean;
	settingsOpen?: boolean;
	onLandingToggle?: () => void;
	onComponentsToggle?: () => void;
	onDomainToggle?: () => void;
	onHowItWorksToggle?: () => void;
	onSettingsToggle?: () => void;
	onManifestReload?: () => void;
	class?: string;
}
