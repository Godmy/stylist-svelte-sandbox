import type { Snippet } from 'svelte';

/** Concentric orbit stage that hosts token control nodes. */
export interface RecipeOrbitBackground {
	opened?: boolean;
	children?: Snippet;
}
