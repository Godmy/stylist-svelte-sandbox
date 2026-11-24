import type { Snippet } from 'svelte';

export interface RecipeDomainSettings {
	navigation?: Snippet;
	displaySettings?: Snippet;
	open?: boolean;
	modal?: boolean;
	iconSizes?: Record<'module' | 'domain' | 'cluster' | 'joint' | 'search', number>;
	onClose?: () => void;
	class?: string;
}
