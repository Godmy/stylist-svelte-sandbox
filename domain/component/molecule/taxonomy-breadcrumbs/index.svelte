<script lang="ts">
	import type { RecipeTaxonomyBreadcrumbs } from '$stylist/domain/interface/recipe/taxonomy-breadcrumbs';

	let {
		module,
		domain,
		cluster,
		joint,
		family,
		file,
		class: className = ''
	}: RecipeTaxonomyBreadcrumbs = $props();

	const dotIndex = $derived(file ? file.lastIndexOf('.') : -1);
	const fileName = $derived(dotIndex > 0 ? file!.slice(0, dotIndex) : (file ?? ''));
	const fileExt = $derived(dotIndex > 0 ? file!.slice(dotIndex) : '');
</script>

<nav class="c-taxonomy-breadcrumbs {className}" aria-label="Taxonomy path">
	{#if module}
		<span class="crumb" title="module">{module}</span>
		<span class="sep" aria-hidden="true">/</span>
	{/if}
	<span class="crumb" title="domain">{domain || '-'}</span>
	<span class="sep" aria-hidden="true">/</span>
	<span class="crumb" title="cluster">{cluster || '-'}</span>
	<span class="sep" aria-hidden="true">/</span>
	<span class="crumb" title="joint">{joint || '-'}</span>
	<span class="sep" aria-hidden="true">/</span>
	<span class="crumb" title="family">{family || '-'}</span>
	{#if file}
		<span class="sep" aria-hidden="true">/</span>
		<span class="crumb" title="file">{fileName}</span>{#if fileExt}<span class="ext">{fileExt}</span
			>{/if}
	{/if}
</nav>

<style>
	.c-taxonomy-breadcrumbs {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		padding: 0.5rem 0.35rem;
		border-bottom: 1px solid var(--color-border-primary);
		font-family: var(--font-mono, monospace);
		font-size: 11px;
		line-height: 1.45;
		overflow: hidden;
		white-space: nowrap;
	}

	.crumb {
		color: var(--color-text-primary);
		cursor: default;
	}

	.sep {
		color: var(--color-text-secondary);
		opacity: 0.4;
		user-select: none;
		flex-shrink: 0;
	}

	.ext {
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}
</style>
