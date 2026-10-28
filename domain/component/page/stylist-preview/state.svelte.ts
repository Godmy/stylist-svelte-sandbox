import { resolveFamilyIcon } from '$stylist/domain/function/resolve/family-icon';
import { isIconName } from '$stylist/svg/function/check/icon-name';
import type { StylistPreviewStory } from '$stylist/domain/type/object/stylist-preview-story';
import type { HTMLAttributes } from 'svelte/elements';
import type { RecipeStylistPreview } from '$stylist/domain/interface/recipe/stylist-preview';
import { createComponentFeedbackState } from '$stylist/domain/function/state/component-feedback/state.svelte';

export function createStylistPreviewState(
	getProps: () => RecipeStylistPreview & HTMLAttributes<HTMLDivElement>
) {
	const debug = import.meta.env.DEV ? createComponentFeedbackState() : null;
	let debugUi = $state<
		| typeof import('$stylist/domain/component/organism/component-feedback/index.svelte').default
		| null
	>(null);
	if (import.meta.env.DEV) {
		$effect(() => {
			let active = true;
			void import('$stylist/domain/component/organism/component-feedback/index.svelte').then(
				(module) => {
					if (active) debugUi = module.default;
				}
			);
			return () => {
				active = false;
			};
		});
	}
	let headerInline = $state(false);
	const props = $derived(getProps());
	const stories = $derived(props.stories);
	let visibleCount = $state(60);
	const visibleStories = $derived(stories.slice(0, visibleCount));
	$effect(() => {
		visibleCount = Math.min(60, stories.length);
	});
	const categories = $derived.by(() => {
		const order = ['atom', 'molecule', 'organism', 'template', 'page'];
		return [...props.categories].sort((a, b) => {
			const aIndex = order.indexOf(a.toLowerCase().replace(/s$/, ''));
			const bIndex = order.indexOf(b.toLowerCase().replace(/s$/, ''));
			return (aIndex < 0 ? order.length : aIndex) - (bIndex < 0 ? order.length : bIndex);
		});
	});
	const categoryCounts = $derived(props.categoryCounts);
	const tags = $derived(props.tags);
	const searchQuery = $derived(props.searchQuery);
	const selectedCategories = $derived(props.selectedCategories);
	const selectedTags = $derived(props.selectedTags);
	const viewMode = $derived(props.viewMode);
	const sortBy = $derived(props.sortBy);
	const showFilters = $derived(props.showFilters);
	const stats = $derived(props.stats);
	const onSearchQueryChange = $derived(props.onSearchQueryChange);
	const onToggleCategory = $derived(props.onToggleCategory);
	const onToggleTag = $derived(props.onToggleTag);
	const onViewModeChange = $derived(props.onViewModeChange);
	const onSortByChange = $derived(props.onSortByChange);
	const onToggleFilters = $derived(props.onToggleFilters);
	const onClearFilters = $derived(props.onClearFilters);
	const onOpenStory = $derived(props.onOpenStory);

	const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
		atoms: {
			bg: 'pcc-color--atoms-bg',
			text: 'pcc-color--atoms-text',
			border: 'pcc-color--atoms-border'
		},
		molecules: {
			bg: 'pcc-color--molecules-bg',
			text: 'pcc-color--molecules-text',
			border: 'pcc-color--molecules-border'
		},
		organisms: {
			bg: 'pcc-color--organisms-bg',
			text: 'pcc-color--organisms-text',
			border: 'pcc-color--organisms-border'
		}
	};

	function getCategoryColor(category: string) {
		return categoryColors[category.toLowerCase()] || categoryColors.atoms;
	}

	function getCategoryIcon(category: string) {
		const cat = category.toLowerCase();
		if (cat === 'atoms') return 'code';
		if (cat === 'molecules') return 'layers';
		if (cat === 'organisms') return 'package';
		return 'sparkles';
	}

	const hasActiveFilters = $derived(
		selectedCategories.size > 0 || selectedTags.size > 0 || !!searchQuery
	);

	return {
		debug,
		get debugUi() {
			return debugUi;
		},
		get headerInline() {
			return headerInline;
		},
		observeHeader(element: HTMLElement) {
			const brand = element.querySelector<HTMLElement>('.pcc-eyebrow');
			const filters = element.querySelector<HTMLElement>('.pcc-top-row');
			const menu = element.querySelector<HTMLElement>('.pcc-menu');
			function update() {
				// A retained catalog has no measurable layout while its screen is hidden.
				if (!element.getClientRects().length) return;
				const style = getComputedStyle(element);
				const available =
					element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
				const controls = filters ? (Array.from(filters.children) as HTMLElement[]) : [];
				const filterGap = filters ? parseFloat(getComputedStyle(filters).columnGap) || 0 : 0;
				const filterWidth = controls.reduce(
					(total, control) => {
						const basis = getComputedStyle(control).flexBasis;
						const fixedBasis = /^\d+(\.\d+)?px$/.test(basis) ? parseFloat(basis) : 0;
						return total + Math.max(control.offsetWidth, fixedBasis);
					},
					Math.max(0, controls.length - 1) * filterGap
				);
				const needed =
					(brand?.offsetWidth ?? 0) +
					filterWidth +
					(menu?.offsetWidth ?? 0) +
					2 * (parseFloat(style.columnGap) || 0);
				headerInline = available >= needed;
			}
			update();
			if (typeof ResizeObserver === 'undefined') return;
			let frame: number | null = null;
			const observer = new ResizeObserver(() => {
				if (frame !== null) cancelAnimationFrame(frame);
				frame = requestAnimationFrame(() => {
					frame = null;
					update();
				});
			});
			for (const target of [element, brand, filters, menu, ...Array.from(filters?.children ?? [])])
				if (target) observer.observe(target);
			return () => {
				observer.disconnect();
				if (frame !== null) cancelAnimationFrame(frame);
			};
		},
		get visibleStories() {
			return visibleStories;
		},
		get hasMore() {
			return visibleCount < stories.length;
		},
		showMore() {
			visibleCount += 60;
		},
		observeMore(element: Element) {
			if (typeof IntersectionObserver === 'undefined') return;
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) visibleCount += 60;
				},
				{ rootMargin: '600px' }
			);
			observer.observe(element);
			return () => observer.disconnect();
		},
		getStoryIcon(story: StylistPreviewStory) {
			const family = story.id.split('/').slice(3).join('/') || story.componentName;
			const picked = resolveFamilyIcon(family, isIconName);
			return isIconName(picked) ? picked : null;
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
			return stats;
		},
		get hasActiveFilters() {
			return hasActiveFilters;
		},
		getCategoryColor,
		getCategoryIcon,
		get onSearchQueryChange() {
			return onSearchQueryChange;
		},
		get onToggleCategory() {
			return onToggleCategory;
		},
		get onToggleTag() {
			return onToggleTag;
		},
		get onViewModeChange() {
			return onViewModeChange;
		},
		get onSortByChange() {
			return onSortByChange;
		},
		get onToggleFilters() {
			return onToggleFilters;
		},
		get onClearFilters() {
			return onClearFilters;
		},
		get onOpenStory() {
			return onOpenStory;
		}
	};
}
