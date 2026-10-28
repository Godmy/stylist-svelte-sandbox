import type { Snippet } from 'svelte';
import type { SlotThemeBorder } from '$stylist/theme/interface/slot/theme-border';
import type { SlotTypography } from '$stylist/typography/interface/slot/typography';
import type { ComputeIntersectAll } from '$stylist/theme/type/compute/intersect-all';
import type { StylistPreviewViewMode } from '$stylist/domain/type/alias/stylist-preview-view-mode';
import type { StylistPreviewSortBy } from '$stylist/domain/type/alias/stylist-preview-sort-by';
import type { StylistPreviewStory } from '$stylist/domain/type/object/stylist-preview-story';
export interface RecipeStylistPreview extends ComputeIntersectAll<
	[SlotThemeBorder, SlotTypography]
> {
	stories: StylistPreviewStory[];
	categories: string[];
	categoryCounts: Record<string, number>;
	tags: string[];
	searchQuery: string;
	selectedCategories: Set<string>;
	selectedTags: Set<string>;
	viewMode: StylistPreviewViewMode;
	sortBy: StylistPreviewSortBy;
	showFilters: boolean;
	stats: {
		total: number;
		filtered: number;
	};
	onSearchQueryChange: (value: string) => void;
	onToggleCategory: (category: string) => void;
	onToggleTag: (tag: string) => void;
	onViewModeChange: (mode: StylistPreviewViewMode) => void;
	onSortByChange: (sortBy: StylistPreviewSortBy) => void;
	onToggleFilters: () => void;
	onClearFilters: () => void;
	onOpenStory: (storyId: string) => void;

	/** Main menu supplied by the host so header elements can share the available width. */
	menu?: Snippet;
	class?: string;
}
