<script lang="ts">
	import TokenControlComposer from '$stylist/token/component/molecule/token/index.svelte';
	import { TOKEN_SETTING } from '$stylist/token/const/object/token-setting';
	import type { RecipeTokenSettings } from '$stylist/token/interface/recipe/token-settings';
	import { createTokenSettingsState } from './state.svelte';

	let {
		settings = TOKEN_SETTING,
		title = 'Token Settings',
		columns = 3,
		showColumnControl = false
	}: RecipeTokenSettings = $props();

	const settingsState = createTokenSettingsState(() => ({ settings }));
	let gridColumns = $derived(columns);
	const columnOptions = [1, 2, 3, 4, 5, 6];

	function taxonomyFor(domain: string) {
		if (domain === 'interaction') return 'interaction';
		if (
			domain === 'architecture' ||
			domain === 'canvas' ||
			domain === 'graph' ||
			domain === 'layout'
		) {
			return 'architecture';
		}
		return 'information';
	}
</script>

<section class="token-settings" style={`--token-settings-columns: ${gridColumns};`}>
	<header class="token-settings__header">
		<div>
			<h2>{title}</h2>
			<p>{settingsState.filteredSettings.length} registered token groups</p>
		</div>
		<div class="token-settings__tools">
			{#if showColumnControl}
				<label class="token-settings__column-control">
					<span>Columns</span>
					<select bind:value={gridColumns} aria-label="Token card columns">
						{#each columnOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
			{/if}
			<input
				type="search"
				placeholder="Search tokens"
				bind:value={settingsState.search}
				aria-label="Search token settings"
			/>
			<select bind:value={settingsState.domain} aria-label="Filter by domain">
				{#each settingsState.domains as domain}
					<option value={domain}>{domain}</option>
				{/each}
			</select>
		</div>
	</header>

	<div class="token-settings__grid">
		{#each settingsState.filteredSettings as setting}
			{@const currentValue = settingsState.getValue(setting.key, setting.values[0] ?? '')}
			<article class="token-settings__item">
				<header>
					<div>
						<strong>{setting.label}</strong>
						<span>{setting.domain}</span>
					</div>
					<code>{currentValue}</code>
				</header>
				<TokenControlComposer
					value={currentValue}
					definition={{
						id: setting.key,
						functionalTaxonomy: taxonomyFor(setting.domain),
						tokenFile: setting.domain,
						tokenName: setting.key,
						controlKind: setting.controlKind,
						defaultValue: setting.values[0] ?? '',
						options: setting.values.map((value) => ({ label: String(value), value: String(value) }))
					}}
					onChange={(value) => settingsState.setValue(setting.key, value)}
				/>
			</article>
		{/each}
	</div>
</section>

<style>
	.token-settings {
		display: grid;
		gap: var(--spacing-3, 1rem);
		--token-settings-bg: var(--surface, var(--color-background-primary, #ffffff));
		--token-settings-bg-muted: var(--bg, var(--color-background-secondary, #f8fafc));
		--token-settings-border: var(--line, var(--color-border-primary, #cbd5e1));
		--token-settings-text: var(--text, var(--color-text-primary, #0f172a));
		--token-settings-muted: var(--muted, var(--color-text-secondary, #64748b));
		--token-settings-accent: var(--accent, var(--color-primary-600, #2563eb));
		color: var(--token-settings-text);
		min-width: 0;
	}

	.token-settings__header {
		display: flex;
		flex-wrap: wrap;
		align-items: end;
		justify-content: space-between;
		gap: var(--spacing-3, 1rem);
	}

	.token-settings__header h2 {
		margin: 0;
		font-size: 1.125rem;
		line-height: 1.35;
	}

	.token-settings__header p {
		margin: 0.2rem 0 0;
		color: var(--token-settings-muted);
		font-size: 0.875rem;
	}

	.token-settings__tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-2, 0.5rem);
		min-width: 0;
	}

	.token-settings__column-control {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--token-settings-muted);
		font-size: 0.82rem;
		font-weight: 600;
	}

	.token-settings__tools input,
	.token-settings__tools select {
		box-sizing: border-box;
		min-width: 0;
		min-height: 2.25rem;
		border: 1px solid var(--token-settings-border);
		border-radius: 0.375rem;
		background: var(--token-settings-bg);
		color: inherit;
		padding: 0.4rem 0.6rem;
		font: inherit;
	}

	.token-settings__grid {
		display: grid;
		grid-template-columns: repeat(var(--token-settings-columns, 3), minmax(0, 1fr));
		gap: var(--spacing-2, 0.75rem);
		min-width: 0;
	}

	.token-settings__item {
		box-sizing: border-box;
		display: grid;
		gap: var(--spacing-2, 0.75rem);
		min-width: 0;
		border: 1px solid var(--token-settings-border);
		border-radius: 0.5rem;
		background: color-mix(in srgb, var(--token-settings-bg) 94%, var(--token-settings-bg-muted) 6%);
		padding: var(--spacing-3, 1rem);
	}

	.token-settings__item header {
		display: flex;
		justify-content: space-between;
		gap: var(--spacing-2, 0.75rem);
		min-width: 0;
	}

	.token-settings__item header > div {
		min-width: 0;
	}

	.token-settings__item strong,
	.token-settings__item span {
		display: block;
	}

	.token-settings__item strong {
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 0.92rem;
		white-space: nowrap;
	}

	.token-settings__item span {
		margin-top: 0.15rem;
		color: var(--token-settings-muted);
		font-size: 0.78rem;
	}

	.token-settings__item code {
		flex: 0 1 auto;
		align-self: start;
		max-width: 9rem;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 0.25rem;
		background: color-mix(
			in srgb,
			var(--token-settings-bg-muted) 82%,
			var(--token-settings-accent) 18%
		);
		color: var(--token-settings-text);
		padding: 0.15rem 0.35rem;
		font-size: 0.75rem;
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.token-settings__grid {
			grid-template-columns: 1fr;
		}

		.token-settings__tools,
		.token-settings__tools input,
		.token-settings__tools select {
			width: 100%;
		}
	}
</style>
