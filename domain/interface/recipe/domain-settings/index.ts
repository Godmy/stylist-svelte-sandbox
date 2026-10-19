export interface RecipeDomainSettings {
	open?: boolean;
	iconSizes?: Record<'module' | 'domain' | 'cluster' | 'joint', number>;
	onClose?: () => void;
	class?: string;
}
