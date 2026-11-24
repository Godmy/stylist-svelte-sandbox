<script lang="ts">
	import ThemeSettings from '$stylist/theme/component/organism/theme-settings/index.svelte';
	import { ManagerThemeSettings } from '$stylist/theme/class/manager/theme-settings';
	import { ManagerThemeContext } from '$stylist/theme/class/manager/theme-context';
	import type { RecipeDomainSettings } from '$stylist/domain/interface/recipe/domain-settings';
	import createDomainSettingsState from '$stylist/domain/component/organism/domain-settings/state.svelte';
	import { createSwipeDismiss } from '$stylist/domain/function/create/swipe-dismiss';
	import TopAppBar from '$stylist/navigation/component/organism/top-app-bar/index.svelte';

	let {
		open = false,
		modal = false,
		navigation,
		displaySettings,
		iconSizes = $bindable({ module: 32, domain: 32, cluster: 24, joint: 24, search: 24 }),
		onClose,
		class: className = ''
	}: RecipeDomainSettings = $props();
	const id = $props.id();
	const state = createDomainSettingsState(() => ({ open, modal }));
	const swipe = createSwipeDismiss(
		() => open && modal,
		() => onClose?.()
	);
	const panels = ['module', 'domain', 'cluster', 'joint', 'search'] as const;

	const themeContext = ManagerThemeContext.getOptional();
	const settingsRecipe = $derived(
		ManagerThemeSettings.createContract({
			themeMode: themeContext?.themeMode,
			themeScheme: themeContext?.themeScheme,
			modeSection: {
				show: true,
				title: '',
				description: 'Switch between default, light and dark.'
			},
			schemeSection: {
				show: true,
				title: '',
				description: 'Choose the palette used by the explorer.'
			}
		})
	);
</script>

{#if open}
	<dialog
		{...swipe}
		bind:this={state.element}
		class="c-domain-settings {className}"
		aria-label={modal ? 'Settings' : 'Domain settings'}
		oncancel={(event) => {
			event.preventDefault();
			onClose?.();
		}}
	>
		{#if modal}
			<TopAppBar
				heading="Settings"
				navigation="up"
				navigationLabel="Back from settings"
				onNavigation={onClose}
			/>
		{:else}
			<header class="panel-head">
				<div>
					<p class="eyebrow">Settings</p>
					<h2>Domain settings</h2>
				</div>
				<button
					type="button"
					class="close-button"
					onclick={onClose}
					aria-label="Close settings panel"
				>
					Close
				</button>
			</header>
		{/if}

		<div class="panel-body">
			{#if navigation}
				<section class="page-settings" aria-labelledby="{id}-pages">
					<h3 id="{id}-pages">Select pages</h3>
					{@render navigation()}
				</section>
			{/if}
			{#if displaySettings}
				<section class="playground-settings" aria-labelledby="{id}-playground">
					<h2 id="{id}-playground">Playground settings</h2>
					{@render displaySettings()}
				</section>
			{/if}
			{#if navigation || displaySettings}
				<h2 class="domain-settings-heading">Domain settings</h2>
			{/if}
			<section class="icon-settings" aria-labelledby="{id}-icons">
				<h3 id="{id}-icons">Panel icon sizes</h3>
				<p>Adjust each navigation panel independently.</p>
				{#each panels as panel (panel)}
					<label class="icon-size-control" for="{id}-{panel}">
						<span>{panel}</span>
						<output for="{id}-{panel}">{iconSizes[panel]} px</output>
						<input
							id="{id}-{panel}"
							type="range"
							min="12"
							max="32"
							step="1"
							value={iconSizes[panel]}
							aria-label={`${panel} icon size`}
							aria-valuetext={`${iconSizes[panel]} pixels`}
							oninput={(event) => {
								iconSizes = { ...iconSizes, [panel]: event.currentTarget.valueAsNumber };
							}}
						/>
					</label>
				{/each}
				<button
					type="button"
					class="reset-icons"
					onclick={() =>
						(iconSizes = { module: 32, domain: 32, cluster: 24, joint: 24, search: 24 })}
				>
					Reset icon sizes
				</button>
			</section>
			<div class="settings-offset">
				<ThemeSettings
					{...settingsRecipe}
					class="domain-settings-panel"
					switcherProps={{ compact: false, showHeader: false, showLabels: false }}
				/>
			</div>
		</div>
	</dialog>
{/if}

<style>
	.page-settings {
		display: grid;
		gap: 1.25rem;
		margin-bottom: 2rem;
	}
	.page-settings h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
	}
	.page-settings :global(.c-domain-menu) {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		justify-items: center;
		gap: 0.9rem;
		width: 100%;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: none;
		box-shadow: none;
		backdrop-filter: none;
	}
	.playground-settings {
		display: grid;
		gap: 1.25rem;
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--color-border-primary);
	}
	.playground-settings h2,
	.domain-settings-heading {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.4;
	}
	.domain-settings-heading {
		margin-bottom: 1.25rem;
	}
	.playground-settings :global(.c-device-viewport) {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		justify-items: center;
		gap: 1rem;
		width: 100%;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: none;
		box-shadow: none;
		backdrop-filter: none;
	}
	.playground-settings :global(.viewport-size) {
		grid-column: span 2;
		width: 100%;
		padding: 0;
		border: 0;
	}
	.playground-settings :global(.viewport-select-wrap),
	.playground-settings :global(.viewport-select-wrap select) {
		width: 100%;
	}
	.playground-settings :global(.fullscreen-button) {
		margin: 0;
		outline: 0;
	}
	.icon-settings {
		display: grid;
		gap: 0.8rem;
		margin-bottom: 1.25rem;
		padding: 1rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 18px;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
	}

	.icon-settings h3,
	.icon-settings p {
		margin: 0;
	}

	.icon-settings h3 {
		font-size: 0.95rem;
	}

	.icon-settings p,
	.icon-size-control {
		font-size: 0.82rem;
	}

	.icon-settings p,
	.icon-size-control output {
		color: var(--color-text-secondary);
	}

	.icon-size-control {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.4rem;
	}

	.icon-size-control span {
		text-transform: capitalize;
	}

	.icon-size-control input {
		grid-column: 1 / -1;
		width: 100%;
		margin: 0;
		accent-color: var(--color-primary-500);
	}

	.reset-icons {
		justify-self: start;
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 8px;
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
		font: inherit;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.c-domain-settings {
		margin: 0;
		padding: 0;
		left: auto;
		bottom: auto;
		color: var(--color-text-primary);
		position: fixed;
		top: 5.25rem;
		right: 0.7rem;
		z-index: 1600;
		width: min(calc(30rem + 4px), calc(100vw - 2rem));
		max-height: calc(100vh - 6.25rem);
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 82%, transparent);
		border-radius: 24px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-background-primary) 96%, white 4%),
			color-mix(in srgb, var(--color-background-primary) 90%, var(--color-background-secondary) 10%)
		);
		box-shadow: 0 28px 80px rgba(15, 23, 42, 0.16);
		overflow: hidden;
	}

	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1rem 0.85rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-border-primary) 78%, transparent);
	}

	.eyebrow {
		margin: 0 0 0.25rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	h2 {
		margin: 0;
		font-size: 1.05rem;
	}

	.close-button {
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 80%, transparent);
		border-radius: 999px;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
		padding: 0.65rem 0.9rem;
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
	}

	.panel-body {
		min-height: 0;
		padding: 1rem;
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
		scrollbar-gutter: stable;
	}

	.settings-offset {
		transform: translate(-12px, -6px);
		transform-origin: top left;
	}

	:global(.domain-settings-panel.c-theme-settings) {
		gap: 0.8rem;
		min-width: 0;
		width: 100%;
	}

	:global(.domain-settings-panel .c-theme-settings__surface) {
		gap: 0.85rem;
		padding: 0.9rem 1.15rem 0.9rem 0.9rem;
		border-radius: 18px;
		box-shadow: none;
		margin-right: 24px;
	}

	:global(.domain-settings-panel .c-theme-settings__surface-summary) {
		display: none;
	}

	:global(.domain-settings-panel .c-theme-settings__surface-heading) {
		gap: 0.3rem;
		padding-bottom: 0.1rem;
	}

	:global(.domain-settings-panel .c-theme-surface__content) {
		display: grid;
		gap: 0.8rem;
		padding-inline: 0 0.15rem;
	}

	:global(.domain-settings-panel .c-theme-settings__item) {
		padding: 0.75rem 0.9rem;
		margin-right: 0;
	}

	:global(.domain-settings-panel .c-theme-settings__meta) {
		gap: 0.22rem;
	}

	:global(.domain-settings-panel .c-theme-settings__title:empty),
	:global(.domain-settings-panel .c-theme-settings__help:empty) {
		display: none;
	}

	:global(.domain-settings-panel .c-theme-settings__help) {
		margin-top: -0.05rem;
	}

	:global(.domain-settings-panel .c-theme-settings__item--column) {
		padding-top: 0.7rem;
	}

	:global(.domain-settings-panel .c-theme-switcher__list) {
		grid-template-columns: 1fr;
		gap: 0.65rem;
	}

	:global(.domain-settings-panel .c-theme-switcher__item) {
		min-height: 7.1rem;
		padding: 0.75rem;
		gap: 0.45rem;
	}

	:global(.domain-settings-panel .c-theme-switcher__badge) {
		display: none;
	}

	:global(.domain-settings-panel .c-theme-switcher__top) {
		grid-template-columns: minmax(0, 1fr);
		gap: 0.35rem;
	}

	:global(.domain-settings-panel .c-theme-switcher__preview) {
		gap: 0.4rem;
	}

	:global(.domain-settings-panel .c-theme-switcher__preview-surface) {
		height: 2.8rem;
	}

	:global(.domain-settings-panel .c-theme-switcher__swatch-row) {
		gap: 0.4rem;
	}

	:global(.domain-settings-panel .c-theme-switcher__swatch) {
		width: 0.7rem;
		height: 0.7rem;
	}

	@media (max-width: 640px) {
		:global(.domain-settings-panel .c-theme-switcher__list) {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 840px) {
		.c-domain-settings :global(.c-top-app-bar__icon-button) {
			-webkit-tap-highlight-color: transparent;
			background: transparent;
		}
		.c-domain-settings {
			inset: 0;
			width: 100vw;
			max-width: none;
			height: 100dvh;
			max-height: none;
			border: 0;
			border-radius: 0;
			padding-block: env(safe-area-inset-top, 0px) env(safe-area-inset-bottom, 0px);
			box-sizing: border-box;
			touch-action: pan-y;
		}

		.settings-offset {
			transform: translate(-8px, -4px);
		}
		.panel-head {
			padding: 1.5rem 1.25rem;
		}
		.panel-head h2 {
			font-size: 1.25rem;
		}
		.panel-body {
			padding: 1.5rem 1.25rem;
		}
	}
</style>
