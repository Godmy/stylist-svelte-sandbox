import type { Snippet } from 'svelte';

/** Expandable card shell of the orbit tooling panel with items and a close slot. */
export interface RecipeCardShell {
	expanded?: boolean;
	title?: string;
	children?: Snippet;
	close?: Snippet;
}
