export interface RecipeDomainMenu {
	landingVisible?: boolean;
	domainVisible?: boolean;
	howItWorksOpen?: boolean;
	settingsOpen?: boolean;
	onLandingToggle?: () => void;
	onDomainToggle?: () => void;
	onHowItWorksToggle?: () => void;
	onSettingsToggle?: () => void;
	onManifestReload?: () => void;
	class?: string;
}
