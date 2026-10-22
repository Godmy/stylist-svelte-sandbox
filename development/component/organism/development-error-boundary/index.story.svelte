<script lang="ts">
	import DevelopmentErrorBoundary from '$stylist/development/component/organism/development-error-boundary/index.svelte';
	import type { RecipeDevelopmentErrorBoundary } from '$stylist/development/interface/recipe/development-error-boundary';

	// Render of index.story.ts: the boundary needs children content and a local crash toggle.
	let args: RecipeDevelopmentErrorBoundary = $props();

	let shouldThrow = $state(false);

	function triggerCrash() {
		shouldThrow = true;
	}

	function throwStoryError() {
		throw new Error('Simulated component failure');
	}
</script>

<section class="sb-organisms-development-error-boundary _c1">
	<div class="_c2">
		<p class="_c3">Primary Error Boundary Example</p>
		<p class="_c4">Interactive error boundary with customizable options.</p>

		<div class="_c5">
			{#if shouldThrow}
				{@const _ = throwStoryError()}
			{/if}
			<DevelopmentErrorBoundary {...args}>
				<button class="_c6 _c1" onclick={triggerCrash}> Trigger Error </button>
			</DevelopmentErrorBoundary>
		</div>
	</div>

	<div class="_c7">
		<h3 class="_c8">Error Boundary Variations</h3>
		<p class="_c9">Different error boundary configurations with various options.</p>

		<div class="_c10">
			<article class="_c11">
				<p class="_c12">Without Details</p>
				<div>
					<DevelopmentErrorBoundary showDetails={false}>
						<button class="_c6 _c1" onclick={triggerCrash}> Trigger Error </button>
					</DevelopmentErrorBoundary>
				</div>
			</article>
		</div>
	</div>
</section>

<style>
	._c1 {
		display: grid;
		width: 100%;
		gap: 2rem;
	}
	@media (min-width: 1024px) {
		._c1 {
			grid-template-columns: 1fr 1fr;
		}
	}
	._c10 {
		margin-top: 1.25rem;
	}
	._c11 {
		border-radius: 1rem;
		border-width: 1px;
		border-style: dashed;
		border-color: var(--color-border-primary);
		background-color: var(--color-background-primary);
		padding: 1rem;
	}
	._c12 {
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}
	._c2 {
		border-radius: 2rem;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-border-primary);
		background-color: var(--color-background-primary);
		padding: 1.5rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
	._c3 {
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 600;
		letter-spacing: 0.025em;
		color: var(--color-text-secondary);
		text-transform: uppercase;
	}
	._c4 {
		margin-top: 0.25rem;
		color: var(--color-text-primary);
	}
	._c5 {
		margin-top: 1.5rem;
	}
	._c6 {
		border-radius: 0.25rem;
		background-color: var(--color-red-600);
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		color: #ffffff;
	}
	._c7 {
		border-radius: 2rem;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-border-primary);
		background-color: var(--color-background-secondary);
		padding: 1.5rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
	._c8 {
		font-size: 1rem;
		line-height: 1.5rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}
	._c9 {
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: var(--color-text-secondary);
	}

	._c1:hover {
		background-color: var(--color-red-700);
	}
</style>
