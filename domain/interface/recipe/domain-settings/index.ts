export interface RecipeDomainSettings {
	open?: boolean;
	iconSizes?: Record<'module' | 'domain' | 'cluster' | 'joint' | 'search', number>;
	onClose?: () => void;
	class?: string;
}
