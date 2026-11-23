import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';
import type { TreeNode } from '$stylist/tree/type/object/tree-node';
import type { DomainDependency } from '$stylist/domain/type/object/domain-dependency';
import type { DomainDependencyFile } from '$stylist/domain/type/object/domain-dependency-file';
export interface RecipeDomainFilePreview {
	previewMode?: 'file' | 'markdown' | 'story' | 'json-tree' | 'di';
	fileContent?: string;
	fileLoading?: boolean;
	fileError?: string;
	storyPreviewComponent?: unknown;
	storyPreviewLoading?: boolean;
	storyPreviewError?: string;
	dependencyItems?: DomainDependency[];
	dependencyTreeNodes?: TreeNode[];
	selectedDependencyKey?: string;
	selectedDependencyFiles?: DomainDependencyFile[];
	dependencyLoading?: boolean;
	dependencyError?: string;
	onDependencySelect?: (key: string) => void;
	previewKind?: 'svg' | 'json' | 'text';
	storyDevice?: DeviceFrameViewport;
	storyWidth?: number | null;
	fullscreen?: boolean;
	storyPath?: string;
	class?: string;
}
