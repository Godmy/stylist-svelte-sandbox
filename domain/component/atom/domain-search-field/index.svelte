<script lang="ts">
	import type { RecipeDomainSearchField } from '$stylist/domain/interface/recipe/domain-search-field';

	let {
		value = $bindable(''),
		placeholder = 'Search domain entities...',
		onInput,
		onEscape,
		inputRef = $bindable(null),
		class: className = ''
	}: RecipeDomainSearchField = $props();
</script>

<input
	bind:this={inputRef}
	bind:value
	type="search"
	class="c-domain-search-field {className}"
	{placeholder}
	autocomplete="off"
	spellcheck="false"
	oninput={(event) => onInput?.(event.currentTarget.value)}
	onkeydown={(event) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			onEscape?.();
		}
	}}
/>

<style>
	.c-domain-search-field {
		width: 510px;
		height: calc(var(--domain-search-icon-size, 16px) + 12px);
		padding: 0 0.7rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 8px;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
		font-family: var(--font-mono, monospace);
		font-size: 12px;
		outline: none;
	}

	.c-domain-search-field:focus {
		border-color: var(--color-primary-500);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary-500) 35%, transparent);
	}
</style>
