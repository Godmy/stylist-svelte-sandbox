<script lang="ts">
	import HtmlButton from '$stylist/html/component/atom/button/index.svelte';
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import SearchOverlay from '$stylist/search/component/molecule/search-overlay/index.svelte';
	import TaxonomyBreadcrumbs from '$stylist/domain/component/molecule/taxonomy-breadcrumbs/index.svelte';
	import type { RecipeDomainSearch } from '$stylist/domain/interface/recipe/domain-search';
	import createDomainSearchState from '$stylist/domain/component/molecule/domain-search/state.svelte';

	let props: RecipeDomainSearch = $props();
	const state = createDomainSearchState(() => props);
</script>

<SearchOverlay
	bind:open={state.open}
	bind:query={state.query}
	placeholder="Search domain entities..."
	class="c-domain-search {props.class ?? ''}"
>
	{#snippet results()}
		<div class="c-domain-search__results" role="listbox" aria-label="Search results">
			{#if state.filteredEntries.length === 0}
				<p class="c-domain-search__empty">No matching entities.</p>
			{:else}
				{#each state.filteredEntries as entry (entry.id)}
					<HtmlButton
						type="button"
						class="c-domain-search__result"
						role="option"
						aria-selected="false"
						title={entry.entityPath}
						onclick={() => state.handleSelect(entry.id)}
					>
						<TaxonomyBreadcrumbs
							domain={entry.domain}
							cluster={entry.cluster}
							joint={entry.joint}
							family={entry.family}
						/>
					</HtmlButton>
				{/each}
			{/if}
		</div>
	{/snippet}

	<HtmlButton
		type="button"
		class="c-domain-search__copy {state.pathCopied ? 'is-copied' : ''}"
		disabled={!props.currentPath}
		title={props.currentPath ? `Copy path: ${props.currentPath}` : 'No entity selected'}
		aria-label="Copy component path"
		onclick={state.handleCopyPath}
	>
		<Icon name={state.pathCopied ? 'check' : 'copy'} size={16} aria-hidden="true" />
	</HtmlButton>
</SearchOverlay>

<style>
	:global {
		/* Sandbox chrome: compact mono field, sized by the playground's icon-size setting. */
		:where(.c-domain-search) {
			--search-icon-size: var(--domain-search-icon-size, 16px);
			--search-overlay-width: var(--domain-search-overlay-width, 500px);
			flex-shrink: 0;
		}
		:where(.c-domain-search .c-search-field__input) {
			font-family: var(--font-mono, monospace);
			font-size: var(--font-size-3, 0.75rem);
		}
		:where(.c-domain-search__empty) {
			margin: 0;
			padding: var(--space-3, 0.75rem);
			font-size: var(--font-size-3, 0.75rem);
			color: var(--color-text-secondary, GrayText);
		}
		:where(.c-domain-search__result) {
			display: block;
			inline-size: 100%;
			padding: var(--space-1, 0.25rem);
			border: var(--border-width-thin, 1px) solid transparent;
			border-radius: var(--radius-2, 0.5rem);
			background: transparent;
			color: inherit;
			font-weight: inherit;
			text-align: start;
			cursor: pointer;
		}
		:where(.c-domain-search__result:hover) {
			border-color: var(--color-border-primary, GrayText);
			background: var(--color-background-secondary, Canvas);
		}
		:where(.c-domain-search__result .c-taxonomy-breadcrumbs) {
			inline-size: 100%;
			padding: var(--space-2, 0.5rem) var(--space-1-5, 0.375rem);
			border-block-end: none;
		}
		/* Same box as SearchToggle. */
		:where(.c-domain-search__copy) {
			display: inline-grid;
			place-items: center;
			box-sizing: border-box;
			inline-size: calc(var(--search-icon-size) + 0.75rem);
			block-size: calc(var(--search-icon-size) + 0.75rem);
			padding: 0;
			border: var(--border-width-thin, 1px) solid var(--color-border-primary, GrayText);
			border-radius: var(--radius-2, 0.5rem);
			background: var(--color-background-primary, Canvas);
			color: var(--color-text-secondary, GrayText);
			cursor: pointer;
		}
		:where(.c-domain-search__copy:hover:not(:disabled)) {
			border-color: var(--color-primary-500, Highlight);
			background: color-mix(
				in srgb,
				var(--color-primary-500, Highlight) 10%,
				var(--color-background-primary, Canvas)
			);
			color: var(--color-text-primary, CanvasText);
		}
		:where(.c-domain-search__copy.is-copied) {
			border-color: var(--color-success-500, GrayText);
			color: var(--color-success-500, CanvasText);
		}
		:where(.c-domain-search__copy svg) {
			inline-size: var(--search-icon-size);
			block-size: var(--search-icon-size);
		}
	}
</style>
