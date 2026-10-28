<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeStylistPreview } from '$stylist/domain/interface/recipe/stylist-preview';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import { createStylistPreviewState } from '$stylist/domain/component/page/stylist-preview/state.svelte';
	import type { StylistPreviewSortBy } from '$stylist/domain/type/alias/stylist-preview-sort-by';

	import { DOMAIN_STYLIST_PREVIEW_MESSAGE } from '$stylist/domain/const/record/stylist-preview-message';
	import { useMessage } from '$stylist/localization/function/hook/use-message';

	let props: RecipeStylistPreview & HTMLAttributes<HTMLDivElement> = $props();
	const state = createStylistPreviewState(() => props);
	const t = useMessage('stylist-preview', DOMAIN_STYLIST_PREVIEW_MESSAGE);
</script>

<section class="pcc-wrap {props.class ?? ''}" aria-label={t('title')}>
	<div class="pcc-inner">
		<header
			class="pcc-header"
			class:pcc-header--inline={state.headerInline}
			class:pcc-header--with-menu={!!props.menu}
			{@attach state.observeHeader}
		>
			<p class="pcc-eyebrow">
				<span title="Icon: component"><BaseIcon name="component" size={16} /></span>Stylist Svelte / {t(
					'library'
				)}
			</p>

			<div class="pcc-top-row">
				<div class="pcc-search-wrap">
					<span class="pcc-search-icon"><BaseIcon name="search" size={19} /></span>
					<input
						type="search"
						value={state.searchQuery}
						oninput={(event) => state.onSearchQueryChange(event.currentTarget.value)}
						placeholder={t('search')}
						aria-label={t('searchLabel')}
						class="pcc-search-input"
					/>
					{#if state.searchQuery}
						<button
							type="button"
							onclick={() => state.onSearchQueryChange('')}
							class="pcc-clear-btn"
							aria-label={t('clearSearch')}><BaseIcon name="x" size={16} /></button
						>
					{/if}
				</div>
				<p class="pcc-found" role="status">{t('found', { count: state.stats.filtered })}</p>
				<select
					value={state.sortBy}
					aria-label={t('sortLabel')}
					onchange={(event) =>
						state.onSortByChange(event.currentTarget.value as StylistPreviewSortBy)}
					class="pcc-sort-select"
				>
					<option value="name">{t('sortName')}</option>
					<option value="category">{t('sortCategory')}</option>
					<option value="recent">{t('sortRecent')}</option>
				</select>
				<div class="pcc-view-toggle" role="group" aria-label={t('viewLabel')}>
					<button
						type="button"
						onclick={() => state.onViewModeChange('grid')}
						class:active={state.viewMode === 'grid'}
						aria-pressed={state.viewMode === 'grid'}
						aria-label={t('gridView')}
						title={t('gridView')}><BaseIcon name="grid" size={18} /></button
					>
					<button
						type="button"
						onclick={() => state.onViewModeChange('list')}
						class:active={state.viewMode === 'list'}
						aria-pressed={state.viewMode === 'list'}
						aria-label={t('listView')}
						title={t('listView')}><BaseIcon name="list" size={18} /></button
					>
				</div>
				<button
					type="button"
					onclick={state.onToggleFilters}
					class="pcc-filter-btn"
					class:active={state.showFilters}
					aria-expanded={state.showFilters}
					aria-label={state.showFilters ? t('hideFilters') : t('showFilters')}
				>
					<BaseIcon name="filter" size={18} /><span>{t('filters')}</span>
					{#if state.selectedTags.size}<span class="pcc-count">{state.selectedTags.size}</span>{/if}
				</button>
			</div>
			{#if props.menu}<div class="pcc-menu">{@render props.menu()}</div>{/if}
		</header>
		<div class="pcc-controls">
			<div class="pcc-categories" role="group" aria-label={t('categories')}>
				{#each state.categories as category}
					<button
						type="button"
						onclick={() => state.onToggleCategory(category)}
						class="pcc-cat-btn"
						class:active={state.selectedCategories.has(category)}
						aria-pressed={state.selectedCategories.has(category)}
					>
						{category}<span class="pcc-count">{state.categoryCounts[category] ?? 0}</span>
					</button>
				{/each}
			</div>
			{#if state.showFilters}
				<div class="pcc-filter-panel">
					<h2>{t('tags')}</h2>
					<div class="pcc-tags">
						{#each state.tags as tag}
							<button
								type="button"
								onclick={() => state.onToggleTag(tag)}
								class="pcc-tag-btn"
								class:active={state.selectedTags.has(tag)}
								aria-pressed={state.selectedTags.has(tag)}>{tag}</button
							>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if state.hasActiveFilters}<button
				type="button"
				class="pcc-reset"
				onclick={state.onClearFilters}><BaseIcon name="x" size={14} />{t('clearFilters')}</button
			>{/if}

		<div class:pcc-grid={state.viewMode === 'grid'} class:pcc-list={state.viewMode === 'list'}>
			{#each state.visibleStories as story (story.id)}
				{@const colors = state.getCategoryColor(story.category)}
				{@const iconName = state.getStoryIcon(story)}
				<div class="pcc-card-slot">
					<button
						type="button"
						onclick={() => state.onOpenStory(story.id)}
						class="pcc-card {colors.bg}"
						class:pcc-list-card={state.viewMode === 'list'}
					>
						<div class="pcc-card-preview" aria-hidden="true">
							<span
								class="pcc-preview-icon"
								class:pcc-preview-icon--missing={!iconName}
								title={iconName ? `Icon: ${iconName}` : t('iconMissing')}
							>
								<BaseIcon name={iconName ?? 'component'} size={48} />
							</span>
							<code class="pcc-icon-name" class:pcc-icon-name--missing={!iconName}
								>{iconName ?? `component · ${t('iconMissing')}`}</code
							>
						</div>
						<div class="pcc-card-body">
							<h2 class="pcc-card-title">{story.componentName}</h2>
							<div class="pcc-card-meta">
								<span class="pcc-domain">{story.subcategory ?? story.id.split('/')[0]}</span>
								<span class="pcc-cat-badge">{story.category.toLowerCase().replace(/s$/, '')}</span>
							</div>
						</div>
					</button>
					{#if import.meta.env.DEV && state.debugUi && state.debug?.available && state.viewMode === 'grid' && state.debug.canSelect(story.id)}
						<state.debugUi
							mode="card"
							feedback={state.debug}
							storyId={story.id}
							componentName={story.componentName}
						/>
					{/if}
				</div>
			{/each}
		</div>
		{#if state.hasMore}
			<div class="pcc-more" {@attach state.observeMore}>
				<button type="button" class="pcc-empty-btn" onclick={state.showMore}>{t('loadMore')}</button
				>
			</div>
		{/if}
		{#if state.stories.length === 0}
			<div class="pcc-empty">
				<span class="pcc-empty-icon"><BaseIcon name="search" size={28} /></span>
				<h2>{t('emptyTitle')}</h2>
				<p>{t('emptyText')}</p>
				<button type="button" class="pcc-empty-btn" onclick={state.onClearFilters}
					>{t('clearFilters')}</button
				>
			</div>
		{/if}
	</div>
	{#if import.meta.env.DEV && state.debugUi && state.debug?.available}
		<state.debugUi mode="panel" feedback={state.debug} />
	{/if}
</section>

<style>
	.pcc-wrap {
		--pcc-surface: var(--color-background-primary, #fff);
		--pcc-muted: var(--color-background-secondary, #f3f5f8);
		--pcc-text: var(--color-text-primary, #1b2638);
		--pcc-secondary: var(--color-text-secondary, #66748b);
		--pcc-line: var(--color-border-primary, #e0e5ed);
		--pcc-brand: var(--color-primary-500, #4f73e8);
		min-height: 100dvh;
		background: var(--pcc-surface);
		color: var(--pcc-text);
	}
	.pcc-inner {
		width: 100%;
		min-height: 100dvh;
		box-sizing: border-box;
	}
	.pcc-header {
		position: sticky;
		top: 0;
		z-index: 1000;
		display: grid;
		grid-template-columns: minmax(0, 1fr) max-content;
		grid-template-areas: 'brand menu' 'filters filters';
		align-items: center;
		gap: 0.75rem 1rem;
		padding: 0.75rem;
		background: var(--pcc-surface);
	}
	.pcc-header--inline {
		grid-template-columns: max-content minmax(0, 1fr) max-content;
		grid-template-areas: 'brand filters menu';
	}
	.pcc-menu {
		display: flex;
		grid-area: menu;
		justify-self: end;
		width: max-content;
		max-width: 100%;
		min-width: 0;
	}
	.pcc-eyebrow {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		grid-area: brand;
		width: max-content;
		max-width: 100%;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--pcc-secondary);
	}
	button,
	input,
	select {
		font: inherit;
		box-sizing: border-box;
	}
	button {
		cursor: pointer;
	}
	button:focus-visible,
	select:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--pcc-brand);
		outline-offset: 3px;
	}
	.pcc-controls {
		padding: 0.5rem 0.75rem 0.75rem;
		background: var(--pcc-surface);
		border-bottom: 1px solid var(--pcc-line);
	}
	.pcc-top-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		justify-content: center;
		grid-area: filters;
		justify-self: center;
		width: max-content;
		max-width: 100%;
		min-width: 0;
	}
	.pcc-search-wrap {
		position: relative;
		flex: 0 1 22rem;
		width: 22rem;
		min-width: 10rem;
	}
	.pcc-search-icon {
		position: absolute;
		top: 50%;
		left: 0.9rem;
		transform: translateY(-50%);
		color: var(--pcc-secondary);
		display: flex;
		pointer-events: none;
	}
	.pcc-search-input {
		width: 100%;
		height: 2.85rem;
		border: 1px solid var(--pcc-line);
		border-radius: 0.6rem;
		background: var(--pcc-surface);
		color: var(--pcc-text);
		padding: 0.6rem 2.7rem 0.6rem 2.7rem;
		font-size: 0.85rem;
	}
	.pcc-search-input::-webkit-search-cancel-button {
		appearance: none;
	}
	.pcc-search-input::placeholder {
		color: var(--pcc-secondary);
	}
	.pcc-clear-btn {
		position: absolute;
		right: 0.6rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		padding: 0.3rem;
		border: 0;
		border-radius: 0.3rem;
		color: var(--pcc-secondary);
		background: transparent;
	}
	.pcc-sort-select {
		height: 2.85rem;
		max-width: 14rem;
		border: 1px solid var(--pcc-line);
		border-radius: 0.6rem;
		padding: 0.6rem 0.75rem;
		font-size: 0.8rem;
		background: var(--pcc-surface);
		color: var(--pcc-text);
	}
	.pcc-view-toggle {
		display: flex;
		gap: 0.2rem;
		padding: 0.25rem;
		border: 1px solid var(--pcc-line);
		border-radius: 0.6rem;
		background: var(--pcc-surface);
	}
	.pcc-view-toggle button {
		display: flex;
		padding: 0.5rem;
		border: 0;
		border-radius: 0.35rem;
		background: transparent;
		color: var(--pcc-secondary);
	}
	.pcc-view-toggle button.active {
		color: var(--pcc-brand);
		background: color-mix(in srgb, var(--pcc-brand) 12%, var(--pcc-surface));
	}
	.pcc-filter-btn {
		height: 2.85rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--pcc-line);
		border-radius: 0.6rem;
		background: var(--pcc-surface);
		color: var(--pcc-secondary);
		font-size: 0.8rem;
	}
	.pcc-categories {
		justify-content: center;
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin-top: 0;
	}
	.pcc-cat-btn,
	.pcc-tag-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.45rem 0.7rem;
		border: 1px solid transparent;
		border-radius: 0.45rem;
		color: var(--pcc-secondary);
		background: transparent;
		font-size: 0.78rem;
	}
	.pcc-cat-btn:hover,
	.pcc-tag-btn:hover,
	.pcc-clear-btn:hover {
		background: var(--pcc-muted);
		color: var(--pcc-text);
	}
	.pcc-cat-btn.active,
	.pcc-tag-btn.active,
	.pcc-filter-btn.active {
		border-color: color-mix(in srgb, var(--pcc-brand) 28%, var(--pcc-line));
		color: var(--pcc-brand);
		background: color-mix(in srgb, var(--pcc-brand) 8%, var(--pcc-surface));
	}
	.pcc-count {
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.8;
	}
	.pcc-filter-panel {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--pcc-line);
	}
	.pcc-filter-panel h2 {
		margin: 0 0 0.65rem;
		font-size: 0.75rem;
		color: var(--pcc-secondary);
		font-weight: 550;
	}
	.pcc-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		max-height: 13rem;
		overflow-y: auto;
		padding: 0.2rem;
	}
	.pcc-tag-btn {
		border-color: var(--pcc-line);
		background: var(--pcc-surface);
	}
	.pcc-found {
		margin: 0 0.5rem 0 0;
		font-size: 0.78rem;
		color: var(--pcc-secondary);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.pcc-reset {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.4rem;
		border: 0;
		background: transparent;
		color: var(--pcc-brand);
		font-size: 0.75rem;
	}
	.pcc-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
		gap: 0;
		background: transparent;
	}
	.pcc-card-slot {
		position: relative;
		display: flex;
		min-width: 0;
	}
	.pcc-card {
		--pcc-accent: var(--pcc-brand);
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		padding: 0;
		border: 0;
		border-inline-end: 1px solid var(--pcc-line);
		border-bottom: 1px solid var(--pcc-line);
		border-radius: 0;
		overflow: hidden;
		text-align: left;
		color: var(--pcc-text);
		background: var(--pcc-surface);
		transition: background 0.18s;
	}
	.pcc-card:hover {
		background: color-mix(in srgb, var(--pcc-brand) 4%, var(--pcc-surface));
	}
	.pcc-color--atoms-bg {
		--pcc-accent: #5885d4;
	}
	.pcc-color--molecules-bg {
		--pcc-accent: #9970c7;
	}
	.pcc-color--organisms-bg {
		--pcc-accent: #409b86;
	}
	.pcc-card-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		height: 9rem;
		overflow: hidden;
		background: var(--pcc-muted);
	}
	.pcc-preview-icon {
		display: flex;
		color: var(--pcc-text);
	}
	.pcc-preview-icon--missing {
		color: var(--pcc-secondary);
		opacity: 0.5;
	}
	.pcc-icon-name {
		font-size: 0.65rem;
		color: var(--pcc-secondary);
		text-align: center;
		overflow-wrap: anywhere;
		padding: 0 0.5rem;
	}
	.pcc-icon-name--missing {
		font-style: italic;
	}
	.pcc-card-body {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 0.85rem;
		flex: 1;
		min-width: 0;
	}
	.pcc-card-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 0.85rem;
		border-top: 1px solid var(--pcc-line);
		font-size: 0.68rem;
	}
	.pcc-cat-badge {
		color: var(--pcc-accent);
	}
	.pcc-domain {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--pcc-secondary);
	}
	.pcc-card-title {
		margin: 0;
		font-size: 1rem;
		letter-spacing: -0.02em;
		line-height: 1.4;
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	.pcc-list {
		display: grid;
		gap: 0;
		background: transparent;
	}
	.pcc-list-card {
		flex-direction: row;
		align-items: stretch;
	}
	.pcc-list-card .pcc-card-preview {
		width: 8rem;
		min-height: 0;
		flex-shrink: 0;
		border-bottom: 0;
		border-right: 1px solid var(--pcc-line);
	}

	.pcc-list-card .pcc-preview-icon {
		padding: 0.7rem;
		border-radius: 0.7rem;
	}
	.pcc-list-card .pcc-card-body {
		padding: 0.85rem 1.15rem;
	}
	.pcc-more {
		display: flex;
		justify-content: center;
		padding: 1rem;
	}
	.pcc-empty {
		display: grid;
		justify-items: center;
		padding: 4rem 1rem;
		text-align: center;
	}
	.pcc-empty-icon {
		display: flex;
		padding: 1rem;
		border: 1px solid var(--pcc-line);
		border-radius: 1rem;
		background: var(--pcc-muted);
		color: var(--pcc-secondary);
	}
	.pcc-empty h2 {
		font-size: 1.1rem;
		margin: 1.2rem 0 0.5rem;
	}
	.pcc-empty p {
		color: var(--pcc-secondary);
		font-size: 0.85rem;
		margin: 0 0 1.5rem;
	}
	.pcc-empty-btn {
		border: 1px solid var(--pcc-line);
		border-radius: 0.5rem;
		padding: 0.65rem 1rem;
		background: var(--pcc-muted);
		color: var(--pcc-text);
		font-size: 0.8rem;
	}
	@media (max-width: 600px) {
		.pcc-header {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'brand' 'menu' 'filters';
		}
		.pcc-header:not(.pcc-header--with-menu) {
			grid-template-areas: 'brand' 'filters';
		}
		.pcc-search-wrap {
			flex: 1 1 calc(100% - 7rem);
			min-width: 0;
		}
		.pcc-found {
			margin-right: 0;
		}
		.pcc-sort-select {
			flex: 1;
			min-width: 0;
		}
		.pcc-filter-btn > span:not(.pcc-count) {
			display: none;
		}
		.pcc-list-card .pcc-card-preview {
			width: 5rem;
		}
		.pcc-list-card .pcc-preview-icon {
			padding: 0.4rem;
			border-radius: 0.45rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pcc-card {
			transition: none;
		}
		.pcc-card:hover {
			transform: none;
		}
	}
</style>
