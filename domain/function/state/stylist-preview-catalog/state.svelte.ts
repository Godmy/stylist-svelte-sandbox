import { expandComponentTree } from '$stylist/domain/function/transform/expand-component-tree';
import type { TypeDomainTreeInput } from '$stylist/domain/type/alias/domain-tree-input';
import type { StylistPreviewSortBy } from '$stylist/domain/type/alias/stylist-preview-sort-by';
import type { StylistPreviewViewMode } from '$stylist/domain/type/alias/stylist-preview-view-mode';
import type { StylistPreviewStory } from '$stylist/domain/type/object/stylist-preview-story';

/** Catalog controls and component stories derived from the current workspace manifest. */
export function createStylistPreviewCatalogState(getTree: () => TypeDomainTreeInput) {
	let thumbnails = $state<Record<string, string>>({});
	let searchQuery = $state('');
	let selectedCategories = $state(new Set<string>());
	let selectedTags = $state(new Set<string>());
	let viewMode = $state<StylistPreviewViewMode>('grid');
	let sortBy = $state<StylistPreviewSortBy>('name');
	let showFilters = $state(false);
	const labels: Record<string, string> = {
		atom: 'Atoms',
		molecule: 'Molecules',
		organism: 'Organisms',
		template: 'Templates',
		page: 'Pages'
	};
	const entries = $derived.by<StylistPreviewStory[]>(() =>
		expandComponentTree(getTree()).flatMap((domain) =>
			domain.clusters
				.filter((cluster) => cluster.name === 'component')
				.flatMap((cluster) =>
					cluster.joints.flatMap((joint) =>
						joint.entities
							.filter((entity) =>
								entity.files.some(
									(file) => file.name === 'index.story.ts' || file.name === 'index.story.svelte'
								)
							)
							.map((entity) => ({
								id: entity.path,
								thumbnailUrl: thumbnails[entity.path],
								componentName: entity.name
									.split('-')
									.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
									.join(' '),
								category: labels[joint.name] ?? joint.name,
								subcategory: domain.name
							}))
					)
				)
		)
	);
	const categories = $derived([...new Set(entries.map((entry) => entry.category))]);
	const tags = $derived(
		[...new Set(entries.map((entry) => entry.subcategory ?? ''))].filter(Boolean).sort()
	);
	const categoryCounts = $derived.by(() =>
		Object.fromEntries(
			categories.map((category) => [
				category,
				entries.filter((entry) => entry.category === category).length
			])
		)
	);
	const stories = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();
		const filtered = entries.filter(
			(entry) =>
				(!query ||
					`${entry.componentName} ${entry.id} ${entry.category}`.toLowerCase().includes(query)) &&
				(!selectedCategories.size || selectedCategories.has(entry.category)) &&
				(!selectedTags.size || selectedTags.has(entry.subcategory ?? ''))
		);
		if (sortBy === 'name')
			filtered.sort(
				(a, b) => a.componentName.localeCompare(b.componentName) || a.id.localeCompare(b.id)
			);
		if (sortBy === 'category')
			filtered.sort(
				(a, b) =>
					a.category.localeCompare(b.category) || a.componentName.localeCompare(b.componentName)
			);
		return filtered;
	});
	function toggleSelection(set: Set<string>, value: string) {
		const next = new Set(set);
		if (next.has(value)) next.delete(value);
		else next.add(value);
		return next;
	}
	return {
		async loadThumbnails() {
			try {
				const response = await fetch('/component-previews/index.json');
				if (!response.ok) return;
				const index: unknown = await response.json();
				if (!index || typeof index !== 'object' || Array.isArray(index)) return;
				thumbnails = Object.fromEntries(
					Object.entries(index).filter(
						(entry): entry is [string, string] =>
							typeof entry[1] === 'string' && entry[1].startsWith('/component-previews/')
					)
				);
			} catch {
				// Screenshots are optional; the component catalog remains usable offline.
			}
		},
		get stories() {
			return stories;
		},
		get categories() {
			return categories;
		},
		get categoryCounts() {
			return categoryCounts;
		},
		get tags() {
			return tags;
		},
		get searchQuery() {
			return searchQuery;
		},
		get selectedCategories() {
			return selectedCategories;
		},
		get selectedTags() {
			return selectedTags;
		},
		get viewMode() {
			return viewMode;
		},
		get sortBy() {
			return sortBy;
		},
		get showFilters() {
			return showFilters;
		},
		get stats() {
			return { total: entries.length, filtered: stories.length };
		},
		onSearchQueryChange(value: string) {
			searchQuery = value;
		},
		onToggleCategory(value: string) {
			selectedCategories = toggleSelection(selectedCategories, value);
		},
		onToggleTag(value: string) {
			selectedTags = toggleSelection(selectedTags, value);
		},
		onViewModeChange(value: StylistPreviewViewMode) {
			viewMode = value;
		},
		onSortByChange(value: StylistPreviewSortBy) {
			sortBy = value;
		},
		onToggleFilters() {
			showFilters = !showFilters;
		},
		onClearFilters() {
			searchQuery = '';
			selectedCategories = new Set();
			selectedTags = new Set();
		}
	};
}

export default createStylistPreviewCatalogState;
