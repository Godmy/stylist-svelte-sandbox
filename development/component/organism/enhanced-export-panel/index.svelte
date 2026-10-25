<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeEnhancedExportPanel } from '$stylist/development/interface/recipe/enhanced-export-panel';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import { createEnhancedExportPanelState } from '$stylist/development/component/organism/enhanced-export-panel/state.svelte';
	const FileCode = 'file-code';
	const Download = 'download';
	const Copy = 'copy';
	const CheckCircle = 'check-circle';
	const Code2 = 'code';
	const ExternalLink = 'external-link';
	const Package = 'package';
	const Terminal = 'terminal';

	let props: RecipeEnhancedExportPanel & HTMLAttributes<HTMLDivElement> = $props();
	const state = createEnhancedExportPanelState(() => props);
</script>

<div class="export-panel">
	<div class="pep-header">
		<h3 class="pep-title">Export Component</h3>
		<p class="pep-subtitle">Generate Svelte code, open online editors, or install via npm</p>
	</div>

	<div class="pep-section">
		<div class="pep-code-header">
			<h3 class="pep-label">Code Preview (Svelte)</h3>
			<div class="pep-code-actions">
				<button onclick={state.copyCode} class="pep-action-btn pep-action-btn--green">
					{#if state.copySuccess}
						<BaseIcon name={CheckCircle} style="width:0.875rem;height:0.875rem" />
						Copied!
					{:else}
						<BaseIcon name={Copy} style="width:0.875rem;height:0.875rem" />
						Copy
					{/if}
				</button>
				<button onclick={state.downloadCode} class="pep-action-btn pep-action-btn--blue">
					<BaseIcon name={Download} style="width:0.875rem;height:0.875rem" />
					Download
				</button>
			</div>
		</div>

		<div class="pep-code-block">
			<div class="pep-code-block-header">
				<div class="pep-traffic">
					<div style="width:0.75rem;height:0.75rem;border-radius:9999px;background:#ef4444"></div>
					<div style="width:0.75rem;height:0.75rem;border-radius:9999px;background:#eab308"></div>
					<div style="width:0.75rem;height:0.75rem;border-radius:9999px;background:#22c55e"></div>
				</div>
				<span class="pep-filename">Svelte Code</span>
				<div style="width:4rem"></div>
			</div>
			<div class="pep-code-content">
				<pre class="_c1"><code class="_c2">{state.currentCode}</code></pre>
			</div>
		</div>
	</div>

	<div class="pep-section">
		<h3 class="pep-label" style="margin-bottom:0.75rem">Quick Actions</h3>
		<div class="pep-actions-grid">
			<button onclick={state.openInCodeSandbox} class="pep-action-card pep-action-card--yellow">
				<div class="pep-card-top">
					<div class="pep-card-icon">◆</div>
					<BaseIcon
						name={ExternalLink}
						style="width:1rem;height:1rem;color:#ca8a04;opacity:0;transition:opacity 0.15s"
					/>
				</div>
				<div class="pep-card-info">
					<h4 class="pep-card-title pep-card-title--yellow">CodeSandbox</h4>
					<p class="pep-card-desc pep-card-desc--yellow">Open in browser IDE</p>
				</div>
			</button>

			<button onclick={state.openInStackBlitz} class="pep-action-card pep-action-card--blue">
				<div class="pep-card-top">
					<div class="pep-card-icon">◆</div>
					<BaseIcon
						name={ExternalLink}
						style="width:1rem;height:1rem;color:#2563eb;opacity:0;transition:opacity 0.15s"
					/>
				</div>
				<div class="pep-card-info">
					<h4 class="pep-card-title pep-card-title--blue">StackBlitz</h4>
					<p class="pep-card-desc pep-card-desc--blue">Instant dev environment</p>
				</div>
			</button>
		</div>
	</div>

	<div class="pep-section">
		<h3 class="pep-label" style="margin-bottom:0.75rem">NPM Installation</h3>
		<div class="pep-npm-row">
			<div class="pep-npm-box">
				<BaseIcon name={Terminal} style="width:1rem;height:1rem;flex-shrink:0" />
				<code style="flex:1">npm install @stylist-svelte/components</code>
			</div>
			<button onclick={state.copyNpmCommand} class="pep-npm-copy-btn">
				{#if state.npmCopySuccess}
					<BaseIcon name={CheckCircle} style="width:1rem;height:1rem" />
					Copied!
				{:else}
					<BaseIcon name={Copy} style="width:1rem;height:1rem" />
					Copy
				{/if}
			</button>
		</div>
	</div>

	<div class="pep-features-grid">
		<div class="pep-feature-card pep-feature-card--orange">
			<div class="pep-feature-header">
				<BaseIcon name={Code2} style="width:1rem;height:1rem;color:#ea580c" />
				<h4 class="pep-feature-title pep-feature-title--orange">Svelte First</h4>
			</div>
			<p class="pep-feature-desc pep-feature-desc--orange">
				Export Svelte-ready snippets with current prop values
			</p>
		</div>

		<div class="pep-feature-card pep-feature-card--green">
			<div class="pep-feature-header">
				<BaseIcon name={FileCode} style="width:1rem;height:1rem;color:#16a34a" />
				<h4 class="pep-feature-title pep-feature-title--green">TypeScript Ready</h4>
			</div>
			<p class="pep-feature-desc pep-feature-desc--green">
				Drop the snippet into your project and start building
			</p>
		</div>
	</div>

	<div class="pep-pro-tip">
		<p class="pep-pro-tip-text">
			<strong class="pep-pro-tip-strong">Pro tip:</strong> The exported code includes all current prop
			values and can be used directly in your project!
		</p>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: var(--opacity-0);
			transform: scale(0.95);
		}
		to {
			opacity: var(--opacity-100);
			transform: scale(1);
		}
	}
	pre {
		margin: 0;
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	code {
		display: block;
	}

	.export-panel {
		height: 100%;
		overflow: auto;
		background: linear-gradient(to bottom, white, #f9fafb);
		padding: 1.5rem;
	}
	@media (prefers-color-scheme: dark) {
		.export-panel {
			background: linear-gradient(to bottom, #1f2937, #111827);
		}
	}
	.pep-header {
		margin-bottom: 1.5rem;
	}
	.pep-title {
		margin-bottom: 0.5rem;
		background: linear-gradient(to right, #ea580c, #dc2626, #9333ea);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		font-size: 1.25rem;
		font-weight: 700;
	}
	@media (prefers-color-scheme: dark) {
		.pep-title {
			background: linear-gradient(to right, #fb923c, #f87171, #c084fc);
			-webkit-background-clip: text;
			background-clip: text;
		}
	}
	.pep-subtitle {
		font-size: 0.875rem;
		color: #4b5563;
	}
	@media (prefers-color-scheme: dark) {
		.pep-subtitle {
			color: #9ca3af;
		}
	}
	.pep-section {
		margin-bottom: 1.5rem;
	}
	.pep-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: #374151;
	}
	@media (prefers-color-scheme: dark) {
		.pep-label {
			color: #d1d5db;
		}
	}
	.pep-code-header {
		margin-bottom: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.pep-code-actions {
		display: flex;
		gap: 0.5rem;
	}
	.pep-action-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		border-radius: 0.5rem;
		border-width: 2px;
		border-style: solid;
		padding: 0.375rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		transition: all 0.15s;
		cursor: pointer;
	}
	.pep-action-btn:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	.pep-action-btn:active {
		transform: scale(0.95);
	}
	.pep-action-btn--green {
		border-color: #bbf7d0;
		background: linear-gradient(to right, #f0fdf4, #ecfdf5);
		color: #15803d;
	}
	@media (prefers-color-scheme: dark) {
		.pep-action-btn--green {
			border-color: #166534;
			background: linear-gradient(to right, rgb(20 83 45 / 0.3), rgb(6 78 59 / 0.3));
			color: #86efac;
		}
	}
	.pep-action-btn--blue {
		border-color: #bfdbfe;
		background: linear-gradient(to right, #eff6ff, #eef2ff);
		color: #1d4ed8;
	}
	@media (prefers-color-scheme: dark) {
		.pep-action-btn--blue {
			border-color: #1e40af;
			background: linear-gradient(to right, rgb(30 58 138 / 0.3), rgb(49 46 129 / 0.3));
			color: #93c5fd;
		}
	}
	.pep-code-block {
		position: relative;
		overflow: hidden;
		border-radius: 0.75rem;
		border: 2px solid #374151;
		background: #111827;
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
	}
	@media (prefers-color-scheme: dark) {
		.pep-code-block {
			border-color: #1f2937;
			background: black;
		}
	}
	.pep-code-block-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #374151;
		background: #1f2937;
		padding: 0.5rem 1rem;
	}
	@media (prefers-color-scheme: dark) {
		.pep-code-block-header {
			background: #111827;
		}
	}
	.pep-traffic {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.pep-filename {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.75rem;
		color: #9ca3af;
	}
	.pep-code-content {
		max-height: 24rem;
		overflow-x: auto;
		overflow-y: auto;
		padding: 1rem;
	}
	.pep-actions-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}
	.pep-action-card {
		border-radius: 0.75rem;
		border-width: 2px;
		border-style: solid;
		padding: 1rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		transition: all 0.15s;
		cursor: pointer;
		text-align: left;
	}
	.pep-action-card:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	.pep-action-card:active {
		transform: scale(0.95);
	}
	.pep-action-card--yellow {
		border-color: #fef08a;
		background: linear-gradient(to bottom right, #fefce8, #fefce8);
	}
	@media (prefers-color-scheme: dark) {
		.pep-action-card--yellow {
			border-color: #854d0e;
			background: linear-gradient(to bottom right, rgb(113 63 18 / 0.2), rgb(113 63 18 / 0.2));
		}
	}
	.pep-action-card--blue {
		border-color: #bfdbfe;
		background: linear-gradient(to bottom right, #eff6ff, #ecfeff);
	}
	@media (prefers-color-scheme: dark) {
		.pep-action-card--blue {
			border-color: #1e40af;
			background: linear-gradient(to bottom right, rgb(30 58 138 / 0.2), rgb(22 78 99 / 0.2));
		}
	}
	.pep-card-top {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.pep-card-icon {
		font-size: 1.5rem;
	}
	.pep-card-info {
		text-align: left;
	}
	.pep-card-title {
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
		font-weight: 700;
	}
	.pep-card-title--yellow {
		color: #713f12;
	}
	.pep-card-title--blue {
		color: #1e3a5f;
	}
	@media (prefers-color-scheme: dark) {
		.pep-card-title--yellow {
			color: #fef08a;
		}
		.pep-card-title--blue {
			color: #bfdbfe;
		}
	}
	.pep-card-desc {
		font-size: 0.75rem;
	}
	.pep-card-desc--yellow {
		color: #92400e;
	}
	.pep-card-desc--blue {
		color: #1d4ed8;
	}
	@media (prefers-color-scheme: dark) {
		.pep-card-desc--yellow {
			color: #fde68a;
		}
		.pep-card-desc--blue {
			color: #93c5fd;
		}
	}
	.pep-npm-row {
		display: flex;
		gap: 0.5rem;
	}
	.pep-npm-box {
		display: flex;
		flex: 1;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		border: 2px solid #374151;
		background: #111827;
		padding: 0.75rem 1rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.875rem;
		color: #4ade80;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	@media (prefers-color-scheme: dark) {
		.pep-npm-box {
			border-color: #1f2937;
			background: black;
		}
	}
	.pep-npm-copy-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		background: linear-gradient(to right, #22c55e, #10b981);
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		transition: all 0.15s;
		border: none;
		cursor: pointer;
	}
	.pep-npm-copy-btn:hover {
		transform: scale(1.05);
		background: linear-gradient(to right, #16a34a, #059669);
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
	}
	.pep-npm-copy-btn:active {
		transform: scale(0.95);
	}
	.pep-features-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.pep-feature-card {
		border-radius: 0.75rem;
		border-width: 2px;
		border-style: solid;
		padding: 1rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
	.pep-feature-card--orange {
		border-color: #fed7aa;
		background: linear-gradient(to bottom right, #fff7ed, #fef2f2);
	}
	@media (prefers-color-scheme: dark) {
		.pep-feature-card--orange {
			border-color: #9a3412;
			background: linear-gradient(to bottom right, rgb(154 52 18 / 0.2), rgb(153 27 27 / 0.2));
		}
	}
	.pep-feature-card--green {
		border-color: #bbf7d0;
		background: linear-gradient(to bottom right, #f0fdf4, #ecfdf5);
	}
	@media (prefers-color-scheme: dark) {
		.pep-feature-card--green {
			border-color: #166534;
			background: linear-gradient(to bottom right, rgb(20 83 45 / 0.2), rgb(6 78 59 / 0.2));
		}
	}
	.pep-feature-header {
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.pep-feature-title {
		font-size: 0.75rem;
		font-weight: 700;
	}
	.pep-feature-title--orange {
		color: #7c2d12;
	}
	.pep-feature-title--green {
		color: #14532d;
	}
	@media (prefers-color-scheme: dark) {
		.pep-feature-title--orange {
			color: #fed7aa;
		}
		.pep-feature-title--green {
			color: #bbf7d0;
		}
	}
	.pep-feature-desc {
		font-size: 0.75rem;
	}
	.pep-feature-desc--orange {
		color: #9a3412;
	}
	.pep-feature-desc--green {
		color: #15803d;
	}
	@media (prefers-color-scheme: dark) {
		.pep-feature-desc--orange {
			color: #fdba74;
		}
		.pep-feature-desc--green {
			color: #86efac;
		}
	}
	.pep-pro-tip {
		margin-top: 1rem;
		border-radius: 0.75rem;
		border: 2px solid #e9d5ff;
		background: linear-gradient(to right, #faf5ff, #fdf2f8);
		padding: 1rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
	@media (prefers-color-scheme: dark) {
		.pep-pro-tip {
			border-color: #6b21a8;
			background: linear-gradient(to right, rgb(88 28 135 / 0.2), rgb(131 24 67 / 0.2));
		}
	}
	.pep-pro-tip-text {
		font-size: 0.75rem;
		color: #6b21a8;
	}
	@media (prefers-color-scheme: dark) {
		.pep-pro-tip-text {
			color: #d8b4fe;
		}
	}
	.pep-pro-tip-strong {
		color: #581c87;
	}
	@media (prefers-color-scheme: dark) {
		.pep-pro-tip-strong {
			color: #e9d5ff;
		}
	}

	._c1 {
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
	._c2 {
		font-family: ui-monospace, monospace;
		color: #f3f4f6;
	}
</style>
