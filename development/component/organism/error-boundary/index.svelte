<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeErrorBoundary } from '$stylist/development/interface/recipe/error-boundary';
	import { onMount } from 'svelte';
	import { createErrorBoundaryState } from '$stylist/development/component/organism/error-boundary/state.svelte';
	let props: RecipeErrorBoundary & HTMLAttributes<HTMLDivElement> = $props();
	const state = createErrorBoundaryState(() => props);

	onMount(() => {
		const handleError = (event: ErrorEvent) => {
			state.handleError(event);
		};

		window.addEventListener('error', handleError);
		return () => window.removeEventListener('error', handleError);
	});

	$effect(() => {
		if (state.component) {
			state.clearError();
		}
	});
</script>

{#if state.error}
	<div class="peb-error-wrap">
		<div class="peb-icon-wrap">
			<svg
				style="width:2rem;height:2rem;color:#dc2626"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
		</div>
		<div>
			<h3 class="peb-error-title">Component render error</h3>
			<p class="peb-error-desc">{state.error}</p>
		</div>
		<button
			onclick={() => {
				state.clearError();
			}}
			class="peb-close-btn"
		>
			Close
		</button>
	</div>
{:else if state.component}
	{@const DynamicComponent = state.component}
	<DynamicComponent {...state.componentProps} />
{:else if state.children}
	{#if state.children}{@render state.children()}{/if}
{/if}

<style>
	.peb-error-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem;
		text-align: center;
	}
	.peb-icon-wrap {
		display: flex;
		width: 4rem;
		height: 4rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background: #fee2e2;
	}
	@media (prefers-color-scheme: dark) {
		.peb-icon-wrap {
			background: rgb(153 27 27 / 0.2);
		}
	}
	.peb-error-title {
		margin-bottom: 0.5rem;
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
	}
	@media (prefers-color-scheme: dark) {
		.peb-error-title {
			color: white;
		}
	}
	.peb-error-desc {
		max-width: 28rem;
		font-size: 0.875rem;
		color: #4b5563;
	}
	@media (prefers-color-scheme: dark) {
		.peb-error-desc {
			color: #9ca3af;
		}
	}
	.peb-close-btn {
		margin-top: 0.5rem;
		border-radius: 0.5rem;
		background: #dc2626;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}
	.peb-close-btn:hover {
		background: #b91c1c;
	}
</style>
