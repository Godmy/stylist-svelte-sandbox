<script lang="ts">
	import type { RecipeDomainEntity } from '$stylist/domain/interface/recipe/domain-entity';

	let {
		name,
		path,
		fileCount,
		active = false,
		draggable = false,
		onSelect,
		onAdd,
		onDragStart
	}: RecipeDomainEntity = $props();
</script>

<button
	type="button"
	class="c-domain-entity"
	class:is-active={active}
	title={path}
	{draggable}
	ondragstart={onDragStart}
	onclick={() => onSelect?.(path)}
	ondblclick={() => onAdd?.(path)}
>
	<span class="entity-name">{name}</span>
	{#if fileCount != null}
		<small class="entity-count">{fileCount}</small>
	{/if}
</button>

<style>
	.c-domain-entity {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem;
		align-items: center;
		min-height: 28px;
		width: 100%;
		padding: 0.32rem 0.42rem;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--color-text-primary);
		text-align: left;
		cursor: pointer;
	}

	.c-domain-entity:hover,
	.c-domain-entity.is-active {
		border-color: var(--color-border-primary);
		background: var(--color-background-secondary);
	}

	.entity-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: var(--font-mono, monospace);
		font-size: 11px;
	}

	.entity-count {
		color: var(--color-text-secondary);
		font-size: 11px;
		margin-right: 0.25rem;
	}
</style>
