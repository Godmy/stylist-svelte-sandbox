import type { ContentType } from '$stylist/development/type/alias/content-editor-content-type';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
export interface RecipeContentEditorStateProps extends ComputeIntersectAll<[]> {
	initialContent?: {
		id: string;
		type: ContentType;
		content: string;
		attributes?: Record<string, unknown>;
	}[];
	onSave?: (
		content: {
			id: string;
			type: ContentType;
			content: string;
			attributes?: Record<string, unknown>;
		}[]
	) => void;
	onPreview?: () => void;
	placeholder?: string;
	showToolbar?: boolean;
	showPreviewButton?: boolean;
	class?: string;
	toolbarClass?: string;
	editorClass?: string;
	contentClass?: string;
}
