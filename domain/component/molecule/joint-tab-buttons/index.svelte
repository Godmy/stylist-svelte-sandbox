<script lang="ts">
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import Flag from '$stylist/svg/component/atom/flag/index.svelte';
	import { TOKEN_ICON_REGISTRY } from '$stylist/svg/const/record/icon-registry';
	import { TOKEN_FLAG_REGISTRY } from '$stylist/svg/const/record/flag-registry';
	import { resolveFamilyIcon } from '$stylist/domain/function/resolve/family-icon';
	import type { RecipeJointTabButtons } from '$stylist/domain/interface/recipe/joint-tab-buttons';

	let {
		files = [],
		markdownFile = null,
		storyFile = null,
		selectedEntityName = '',
		activeFilePath = '',
		previewMode = 'file',
		previewKind = 'text',
		activeJoint = '',
		hasDependencyPreview = false,
		onFileSelect,
		onMarkdownSelect,
		onStorySelect,
		onJsonTreeSelect,
		onDependencySelect,
		class: className = ''
	}: RecipeJointTabButtons = $props();

	// Flags of `data/flag` show themselves; everything else takes a fitting icon or stays empty.
	const flagCode = $derived(
		activeJoint === 'flag' && selectedEntityName in TOKEN_FLAG_REGISTRY ? selectedEntityName : null
	);
	const iconName = $derived(
		flagCode ? null : resolveFamilyIcon(selectedEntityName, (name) => name in TOKEN_ICON_REGISTRY)
	);
</script>

<div class="c-joint-tab-buttons {className}" aria-label="Files">
	<div class="action-group">
		<div
			class="entity-icon-shell"
			class:entity-icon-shell--empty={!iconName && !flagCode}
			title={flagCode ? `Flag: ${flagCode}` : iconName ? `Icon: ${iconName}` : undefined}
		>
			{#if flagCode}
				<Flag code={flagCode} size={16} />
			{:else if iconName}
				<Icon name={iconName} size="sm" />
			{/if}
		</div>
	</div>

	<div class="tabs-scroll">
		{#if markdownFile}
			<button
				type="button"
				class="tab tab--mode"
				class:active={previewMode === 'markdown'}
				data-hint="Read documentation"
				onclick={() => onMarkdownSelect?.()}
			>
				index.md
			</button>
		{/if}

		{#if storyFile}
			<button
				type="button"
				class="tab tab--mode"
				class:active={previewMode === 'story'}
				data-hint="Open interactive playground"
				onclick={() => onStorySelect?.()}
			>
				playground
			</button>
		{/if}

		{#if previewKind === 'json'}
			<button
				type="button"
				class="tab tab--mode"
				class:active={previewMode === 'json-tree'}
				data-hint="Explore JSON tree"
				onclick={() => onJsonTreeSelect?.()}
			>
				tree
			</button>
		{/if}

		{#if hasDependencyPreview}
			<button
				type="button"
				class="tab tab--mode"
				class:active={previewMode === 'di'}
				data-hint="Inspect component dependencies"
				onclick={() => onDependencySelect?.()}
			>
				DI
			</button>
		{/if}

		{#each files as file (file.path)}
			<button
				type="button"
				class="tab"
				class:active={previewMode === 'file' && activeFilePath === file.path}
				data-hint={file.path}
				onclick={() => onFileSelect?.(file.path)}
			>
				{file.name}
			</button>
		{/each}
	</div>
</div>

<style>
	/* Same height and divider as the joint toolbar next to it (icon + 12px button, 2px padding, 1px border). */
	.c-joint-tab-buttons {
		--joint-tab-height: calc(var(--domain-joint-icon-size, 16px) + 12px);
		display: flex;
		align-items: center;
		gap: 0.35rem;
		box-sizing: border-box;
		height: calc(var(--joint-tab-height) + 5px);
		padding: 2px 0.75rem 2px 0.5rem;
		border-bottom: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
	}

	/* One row keeps the fixed height: extra tabs scroll horizontally instead of wrapping. */
	.tabs-scroll {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		flex: 1;
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.action-group {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.entity-icon-shell {
		display: inline-grid;
		place-items: center;
		box-sizing: border-box;
		width: var(--joint-tab-height);
		height: var(--joint-tab-height);
		color: var(--color-text-primary);
		flex-shrink: 0;
	}

	/* Registry SVGs carry only a viewBox: without an explicit size they collapse to zero width. */
	.entity-icon-shell :global(svg) {
		width: var(--domain-joint-icon-size, 16px);
		height: var(--domain-joint-icon-size, 16px);
	}

	/* Borderless like the toolbar buttons; the selected tab gets the same bottom bar as the cluster row. */
	.tab {
		position: relative;
		flex: 0 0 auto;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: var(--color-text-secondary);
		box-sizing: border-box;
		height: var(--joint-tab-height);
		padding: 0 0.55rem;
		font-family: var(--font-mono, monospace);
		font-size: 12px;
		cursor: pointer;
		transition:
			background-color 100ms,
			color 100ms;
	}

	.tab:hover {
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
	}

	.tab.active {
		background: color-mix(in srgb, var(--color-primary-500) 15%, transparent);
		color: var(--color-primary-600);
	}

	.tab.active::after {
		content: '';
		position: absolute;
		left: 5px;
		right: 5px;
		bottom: 0;
		height: 3px;
		border-radius: 3px 3px 0 0;
		background: var(--color-primary-500);
	}

	.tab:focus-visible {
		outline: 1px solid var(--color-primary-500);
		outline-offset: -1px;
	}

	.tab--icon {
		display: inline-grid;
		place-items: center;
		width: 36px;
		padding: 0;
	}
</style>
