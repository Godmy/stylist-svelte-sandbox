<script lang="ts">
	import type { RecipeDebugConsole } from '$stylist/development/interface/recipe/debug-console';
	import type { DebugConsoleLogLevel } from '$stylist/development/type/alias/debug-console-log-level';
	import { createDebugConsoleState } from '$stylist/development/component/organism/debug-console/state.svelte';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';

	let { ...props }: RecipeDebugConsole = $props();
	const state = createDebugConsoleState(() => props);
</script>

<div class={state.containerClass}>
	<div class={state.headerComputedClass}>
		<div class="dc-header-left">
			<BaseIcon
				name={state.Terminal}
				style="width:1.25rem;height:1.25rem;margin-right:0.5rem;color:#6b7280"
			/>
			<h3 class="dc-title">{state.title}</h3>
			<span class="dc-entry-count">({state.filteredLogs.length} entries)</span>
		</div>

		<div class="dc-header-actions">
			{#if state.allowClear}
				<button type="button" class="dc-action-btn" onclick={state.clearLogs} title="Clear logs">
					<BaseIcon name={state.Trash2} style="width:1rem;height:1rem" />
				</button>
			{/if}

			<button
				type="button"
				class={`dc-run-btn ${state.isRunning ? 'dc-run-btn--stop' : 'dc-run-btn--start'}`}
				onclick={state.isRunning ? state.stopSimulator : state.startSimulator}
				title={state.isRunning ? 'Stop simulator' : 'Start simulator'}
			>
				{#if state.isRunning}
					<BaseIcon name={state.Square} style="width:1rem;height:1rem" />
				{:else}
					<BaseIcon name={state.Play} style="width:1rem;height:1rem" />
				{/if}
			</button>
		</div>
	</div>

	<div class="dc-filter-bar">
		<div class="dc-filter-row">
			{#if state.allowFilter}
				{#each ['log', 'info', 'warn', 'error', 'debug'] as level (level)}
					<button
						type="button"
						class={`dc-level-btn ${
							state.logLevelFilter.includes(level as DebugConsoleLogLevel)
								? state.getLevelBgColor(level as DebugConsoleLogLevel) +
									' ' +
									state.getLevelColor(level as DebugConsoleLogLevel)
								: 'dc-level-btn--inactive'
						}`}
						onclick={() => state.toggleLogLevel(level as DebugConsoleLogLevel)}
					>
						{level.toUpperCase()}
					</button>
				{/each}
			{/if}

			<div class="dc-search-wrap">
				<input
					type="text"
					class="dc-search-input"
					placeholder="Search logs..."
					bind:value={state.searchQuery}
					oninput={state.updateFilteredLogs}
				/>
				<BaseIcon
					name={state.Search}
					style="position:absolute;top:0.375rem;left:0.625rem;width:0.75rem;height:0.75rem;color:#9ca3af;pointer-events:none"
				/>
			</div>
		</div>
	</div>

	<div
		class={`dc-console ${state.consoleClass}`}
		style={`max-height: ${state.maxHeight}; overflow-y: auto;`}
	>
		{#if state.filteredLogs.length === 0}
			<div class="dc-empty">
				No logs to display. {state.isRunning
					? 'Generating logs...'
					: 'Start the simulator or add logs.'}
			</div>
		{:else}
			{#each state.filteredLogs as log}
				<div class={`dc-log-entry ${state.getLevelColor(log.level)} ${state.entryClass}`}>
					<div class="dc-log-inner">
						{#if state.showTimestamps}
							<span class="dc-timestamp">{state.formatTimestamp(log.timestamp)}</span>
						{/if}

						{#if state.showLogLevel}
							<span class={`dc-level-badge ${state.getLevelBgColor(log.level)}`}>
								{log.level.toUpperCase()}
							</span>
						{/if}

						<span class="dc-log-msg">{log.message}</span>

						{#if log.data}
							<details class="dc-log-data">
								<summary class="dc-data-summary"> [Data] </summary>
								<pre class="dc-data-pre">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
							</details>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class={`dc-footer ${state.footerClass}`}>
		<div>
			<span class="dc-footer-label">
				<BaseIcon name={state.Bug} style="width:0.75rem;height:0.75rem;margin-right:0.25rem" />
				Debug Console
			</span>
		</div>
		<div>
			{state.isRunning ? 'Live logging' : 'Ready'}
		</div>
	</div>
</div>

<style>
	.dc-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 16rem;
		background: var(--color-background-primary);
		border-top: 1px solid var(--color-border-primary);
		box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
		z-index: var(--z-index-modal);
		display: flex;
		flex-direction: column;
	}
	.dc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--color-border-primary);
		background: #f3f4f6;
	}
	.dc-level--log {
		color: #374151;
	}
	.dc-level--error {
		color: #ef4444;
	}
	.dc-level--warn {
		color: #eab308;
	}
	.dc-level--info {
		color: #3b82f6;
	}
	.dc-level--debug {
		color: #a855f7;
	}
	.dc-level-bg--log {
		background: #f3f4f6;
	}
	.dc-level-bg--error {
		background: #fee2e2;
	}
	.dc-level-bg--warn {
		background: #fef9c3;
	}
	.dc-level-bg--info {
		background: #dbeafe;
	}
	.dc-level-bg--debug {
		background: #f3e8ff;
	}
	.dc-header-left {
		display: flex;
		align-items: center;
	}
	.dc-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #111827;
	}
	.dc-entry-count {
		margin-left: 0.5rem;
		font-size: 0.75rem;
		color: #6b7280;
	}
	.dc-header-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.dc-action-btn {
		border-radius: 0.25rem;
		padding: 0.375rem;
		color: #6b7280;
		background: none;
		border: none;
		cursor: pointer;
	}
	.dc-action-btn:hover {
		background: #f3f4f6;
		color: #ef4444;
	}
	.dc-run-btn {
		border-radius: 0.25rem;
		padding: 0.375rem;
		background: none;
		border: none;
		cursor: pointer;
	}
	.dc-run-btn--stop {
		color: #ef4444;
	}
	.dc-run-btn--stop:hover {
		background: #fee2e2;
		color: #b91c1c;
	}
	.dc-run-btn--start {
		color: #22c55e;
	}
	.dc-run-btn--start:hover {
		background: #dcfce7;
		color: #15803d;
	}
	.dc-filter-bar {
		border-bottom: 1px solid var(--color-border-primary);
		background: #f9fafb;
		padding: 0.5rem;
	}
	.dc-filter-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.dc-level-btn {
		border-radius: 9999px;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border: none;
		cursor: pointer;
	}
	.dc-level-btn--inactive {
		background: #e5e7eb;
		color: #374151;
	}
	.dc-level-btn--inactive:hover {
		background: #d1d5db;
	}
	.dc-search-wrap {
		position: relative;
		flex: 1;
	}
	.dc-search-input {
		display: block;
		width: 100%;
		border-radius: 0.375rem;
		border: 1px solid #d1d5db;
		padding: 0.25rem 1rem 0.25rem 2rem;
		font-size: 0.75rem;
	}
	.dc-search-input:focus {
		border-color: #3b82f6;
		outline: none;
		box-shadow: 0 0 0 1px #3b82f6;
	}
	.dc-console {
		font-family: monospace;
		font-size: 0.75rem;
	}
	.dc-empty {
		padding: 1rem;
		text-align: center;
		color: #6b7280;
		font-style: italic;
	}
	.dc-log-entry {
		border-bottom: 1px solid var(--color-border-primary);
		padding: 0.5rem;
	}
	.dc-log-inner {
		display: flex;
	}
	.dc-timestamp {
		margin-right: 0.75rem;
		width: 5rem;
		flex-shrink: 0;
		color: #6b7280;
	}
	.dc-level-badge {
		margin-right: 0.5rem;
		border-radius: 0.25rem;
		padding: 0.125rem 0.375rem;
		font-size: 0.75rem;
		font-weight: 500;
		flex-shrink: 0;
	}
	.dc-log-msg {
		flex: 1;
		word-break: break-words;
	}
	.dc-log-data {
		margin-left: 0.5rem;
	}
	.dc-data-summary {
		cursor: pointer;
		color: #6b7280;
	}
	.dc-data-summary:hover {
		color: #374151;
	}
	.dc-data-pre {
		margin-top: 0.25rem;
		overflow-x: auto;
		border-radius: 0.25rem;
		background: #f3f4f6;
		padding: 0.5rem;
		font-size: 0.75rem;
	}
	.dc-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid var(--color-border-primary);
		padding: 0.5rem 1rem;
		font-size: 0.75rem;
		color: #6b7280;
	}
	.dc-footer-label {
		display: inline-flex;
		align-items: center;
	}
</style>
