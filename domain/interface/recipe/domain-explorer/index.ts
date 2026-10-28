import type { TypeDomainTreeInput } from '$stylist/domain/type/alias/domain-tree-input';
import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';
export interface RecipeDomainExplorer {
	tree: TypeDomainTreeInput;
	initialDomain?: string;
	initialCluster?: string;
	initialJoint?: string;
	initialEntityPath?: string;
	initialPreviewMode?: 'file' | 'markdown' | 'story' | 'json-tree' | 'di';
	onSelectionChange?: (selection: {
		domain: string;
		cluster: string;
		joint: string;
		family: string;
		entityPath: string;
		files: { name: string; path: string }[];
	}) => void;
	storyDevice?: DeviceFrameViewport;
	storyWidth?: number | null;
	fullscreen?: boolean;
	deviceViewportVisible?: boolean;
	class?: string;
}
