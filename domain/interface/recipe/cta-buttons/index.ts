import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { HTMLAttributes } from 'svelte/elements';
export interface RecipeCtaButtons extends ComputeIntersectAll<[HTMLAttributes<HTMLDivElement>]> {
	totalComponents?: number;
	componentsHref?: string;
	playgroundHref?: string;
	componentsTitle?: string;
	componentsDescription?: string;
	componentsActionLabel?: string;
	playgroundTitle?: string;
	playgroundDescription?: string;
	playgroundActionLabel?: string;
	onComponentsOpen?: () => void;
	onPlaygroundOpen?: () => void;
	class?: string;
}
