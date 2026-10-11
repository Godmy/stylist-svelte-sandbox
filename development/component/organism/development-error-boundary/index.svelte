<script lang="ts">
	import type { RecipeDevelopmentErrorBoundary } from '$stylist/development/interface/recipe/development-error-boundary';
	import { createDevelopmentErrorBoundaryState } from './state.svelte';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';

	let { ...props }: RecipeDevelopmentErrorBoundary = $props();
	const state = createDevelopmentErrorBoundaryState(() => props);
</script>

{#if state.hasError}
	<div class={state.fallbackContainerClass}>
		<div class={state.headerComputedClass}>
			<div class="deb-icon-wrap">
				<BaseIcon name={state.Bug} style="width:1.5rem;height:1.5rem;color:#ef4444" />
			</div>
			<div class="deb-content">
				<h3 class="deb-error-title">{state.title}</h3>
				<p class="deb-error-msg">{state.message}</p>
			</div>
		</div>

		{#if state.showDetails && state.error}
			<div class={state.detailsComputedClass}>
				<h4 class="deb-details-title">
					<BaseIcon name={state.FileText} style="width:1rem;height:1rem;margin-right:0.25rem" />
					Error Details
				</h4>
				<div class="deb-error-body">
					<p class="deb-error-text">{state.error.message}</p>

					{#if state.errorInfo?.componentStack}
						<details class="deb-stack-details">
							<summary class="deb-stack-summary">Component Stack Trace</summary>
							<pre class="deb-stack-pre">
              {state.errorInfo.componentStack}
            </pre>
						</details>
					{/if}
				</div>
			</div>
		{/if}

		<div class={state.actionsComputedClass}>
			{#if state.showReload}
				<button type="button" class="deb-btn deb-btn--danger" onclick={state.resetError}>
					<BaseIcon name={state.RotateCcw} style="width:1rem;height:1rem;margin-right:0.25rem" />
					Reload Page
				</button>
			{/if}

			{#if state.showCopyError}
				<button type="button" class="deb-btn deb-btn--secondary" onclick={state.copyError}>
					{#if state.copied}
						<svg
							style="width:1rem;height:1rem;margin-right:0.25rem;color:#22c55e"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Copied!
					{:else}
						<BaseIcon name={state.Copy} style="width:1rem;height:1rem;margin-right:0.25rem" />
						Copy Error
					{/if}
				</button>
			{/if}

			{#if state.showReportIssue}
				<a
					href={state.reportUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="deb-btn deb-btn--primary"
				>
					<BaseIcon name={state.ExternalLink} style="width:1rem;height:1rem;margin-right:0.25rem" />
					Report Issue
				</a>
			{/if}
		</div>
	</div>
{:else}
	<div class={state.containerClass}>
		{#if state.children}
			{#if state.children}{@render state.children()}{/if}
		{/if}
	</div>
{/if}

<style>
	.deb-fallback {
		border: 1px solid #fecaca;
		border-radius: 0.5rem;
		background: #fef2f2;
		padding: 1.5rem;
	}
	.deb-header {
		display: flex;
		align-items: flex-start;
	}
	.deb-details {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 0.375rem;
		border: 1px solid #fecaca;
	}
	.deb-actions {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.deb-icon-wrap {
		flex-shrink: 0;
	}
	.deb-content {
		margin-left: 0.75rem;
	}
	.deb-error-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: #991b1b;
	}
	.deb-error-msg {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: #b91c1c;
	}
	.deb-details-title {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		font-weight: 500;
		color: #111827;
	}
	.deb-error-body {
		margin-top: 0.5rem;
	}
	.deb-error-text {
		font-family: monospace;
		font-size: 0.875rem;
		word-break: break-words;
		color: #dc2626;
	}
	.deb-stack-details {
		margin-top: 0.75rem;
	}
	.deb-stack-summary {
		cursor: pointer;
		font-size: 0.75rem;
		color: #6b7280;
	}
	.deb-stack-pre {
		margin-top: 0.5rem;
		overflow-x: auto;
		border-radius: 0.25rem;
		background: #f3f4f6;
		padding: 0.75rem;
		font-size: 0.75rem;
	}
	.deb-btn {
		display: inline-flex;
		align-items: center;
		border-radius: 0.375rem;
		border: 1px solid transparent;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		cursor: pointer;
	}
	.deb-btn:focus {
		outline: none;
	}
	.deb-btn--danger {
		background: #dc2626;
		color: white;
	}
	.deb-btn--danger:hover {
		background: #b91c1c;
	}
	.deb-btn--secondary {
		border-color: #d1d5db;
		background: white;
		color: #374151;
	}
	.deb-btn--secondary:hover {
		background: #f9fafb;
	}
	.deb-btn--primary {
		background: #2563eb;
		color: white;
		text-decoration: none;
	}
	.deb-btn--primary:hover {
		background: #1d4ed8;
	}
</style>
