<script lang="ts">
	// Render of index.story.ts: the catalog needs Set selections and its required callbacks.
	import StylistPreview from '$stylist/domain/component/page/stylist-preview/index.svelte';
	import type { RecipeStylistPreview } from '$stylist/domain/interface/recipe/stylist-preview';

	let args: Partial<RecipeStylistPreview> = $props();
	const noop = () => {};
</script>

<StylistPreview
	{...args}
	stories={args.stories ?? []}
	categories={args.categories ?? []}
	categoryCounts={args.categoryCounts ?? {}}
	tags={args.tags ?? []}
	searchQuery={args.searchQuery ?? ''}
	selectedCategories={new Set()}
	selectedTags={new Set()}
	viewMode={args.viewMode ?? 'grid'}
	sortBy={args.sortBy ?? 'name'}
	showFilters={args.showFilters ?? true}
	stats={args.stats ?? { total: 0, filtered: 0 }}
	onSearchQueryChange={noop}
	onToggleCategory={noop}
	onToggleTag={noop}
	onViewModeChange={noop}
	onSortByChange={noop}
	onToggleFilters={noop}
	onClearFilters={noop}
	onOpenStory={noop}
/>
