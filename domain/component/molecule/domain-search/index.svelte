<script lang="ts">
	import DomainSearchField from '$stylist/domain/component/atom/domain-search-field/index.svelte';
	import DomainSearchToggle from '$stylist/domain/component/atom/domain-search-toggle/index.svelte';
	import TaxonomyBreadcrumbs from '$stylist/domain/component/molecule/taxonomy-breadcrumbs/index.svelte';
	import type { RecipeDomainSearch } from '$stylist/domain/interface/recipe/domain-search';
	import createDomainSearchState from './state.svelte';

	let props: RecipeDomainSearch = $props();
	const state = createDomainSearchState(() => props);
</script>

<div class="c-domain-search {props.class ?? ''}">
	{#if state.open}
		<div class="search-shell">
			<DomainSearchField
				bind:inputRef={state.inputRef}
				bind:value={state.query}
				onEscape={state.closeSearch}
			/>

			{#if state.query.trim()}
				<div class="search-results" role="listbox" aria-label="Search results">
					{#if state.filteredEntries.length === 0}
						<p class="empty-state">No matching entities.</p>
					{:else}
						{#each state.filteredEntries as entry (entry.id)}
							<button
								type="button"
								class="search-result"
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
							</button>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<DomainSearchToggle open={state.open} onToggle={state.handleToggle} />

	<button
		type="button"
		class="copy-path-button"
		class:is-copied={state.pathCopied}
		disabled={!props.currentPath}
		title={props.currentPath ? `Copy path: ${props.currentPath}` : 'No entity selected'}
		aria-label="Copy component path"
		onclick={state.handleCopyPath}
	>
		{#if state.pathCopied}
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M20 6 9 17l-5-5" />
			</svg>
		{:else}
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="9" y="9" width="12" height="12" rx="2" />
				<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
			</svg>
		{/if}
	</button>
</div>

<style>
	.c-domain-search {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		flex-shrink: 0;
	}

	.search-shell {
		position: absolute;
		right: calc(100% + 0.35rem);
		top: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		width: var(--domain-search-overlay-width, 500px);
	}
	/* Extra class for specificity over the field's own fixed 510px width. */
	.c-domain-search .search-shell :global(.c-domain-search-field) {
		box-sizing: border-box;
		width: 100%;
	}

	.search-results {
		position: absolute;
		top: calc(100% + 0.35rem);
		left: 0;
		z-index: 1000;
		width: 510px;
		max-height: min(22rem, 60vh);
		overflow: auto;
		padding: 0.35rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 12px;
		background: var(--color-background-primary);
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
	}

	.search-result {
		width: 100%;
		padding: 0.2rem 0.3rem;
		border: 1px solid transparent;
		border-radius: 10px;
		background: transparent;
		text-align: left;
		cursor: pointer;
	}

	.search-result:hover {
		border-color: var(--color-border-primary);
		background: var(--color-background-secondary);
	}

	.search-result :global(.c-taxonomy-breadcrumbs) {
		width: 100%;
		padding: 0.45rem 0.35rem;
		border-bottom: none;
	}

	.empty-state {
		margin: 0;
		padding: 0.7rem;
		color: var(--color-text-secondary);
		font-size: 12px;
	}

	.copy-path-button {
		display: inline-grid;
		place-items: center;
		width: calc(var(--domain-search-icon-size, 16px) + 12px);
		height: calc(var(--domain-search-icon-size, 16px) + 12px);
		padding: 0;
		border: 1px solid var(--color-border-primary);
		border-radius: 8px;
		background: var(--color-background-primary);
		color: var(--color-text-secondary);
		cursor: pointer;
	}

	.copy-path-button:hover:not(:disabled) {
		color: var(--color-text-primary);
		border-color: var(--color-primary-500);
		background: color-mix(in srgb, var(--color-primary-500) 10%, var(--color-background-primary));
	}

	.copy-path-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.copy-path-button.is-copied {
		color: var(--color-success-500, var(--color-text-primary));
		border-color: var(--color-success-500, var(--color-border-primary));
	}
	.copy-path-button :global(svg) {
		width: var(--domain-search-icon-size, 16px);
		height: var(--domain-search-icon-size, 16px);
	}
</style>
