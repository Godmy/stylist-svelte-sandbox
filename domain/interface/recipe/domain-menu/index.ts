export interface RecipeDomainMenu {
	landingVisible?: boolean;
	componentsVisible?: boolean;
	domainVisible?: boolean;
	howItWorksOpen?: boolean;
	settingsOpen?: boolean;
	reportsVisible?: boolean;
	onLandingToggle?: () => void;
	onComponentsToggle?: () => void;
	onDomainToggle?: () => void;
	onReportsToggle?: () => void;
	onHowItWorksToggle?: () => void;
	onSettingsToggle?: () => void;
	onManifestReload?: () => void;
	class?: string;
}
