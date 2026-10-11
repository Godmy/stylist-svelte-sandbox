import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { HTMLAttributes } from 'svelte/elements';
import type { TokenSize } from '$stylist/design-token/type/alias/size';
import type { TokenCodeView } from '$stylist/development/type/alias/code-view';
export interface RecipeSyntaxHighlightedCode extends ComputeIntersectAll<
	[HTMLAttributes<HTMLDivElement>]
> {
	class?: string;
	code?: string;
	language?: string;
	variant?: TokenCodeView;
	size?: TokenSize;
	showLineNumbers?: boolean;
	startLineNumber?: number;
}
