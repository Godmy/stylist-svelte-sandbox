<script lang="ts">
	import type { RecipePrivacySettings } from '$stylist/development/interface/recipe/privacy-settings';
	import { createPrivacySettingsState } from '$stylist/development/component/molecule/privacy-settings/state.svelte';

	let {
		settings = [],
		onSave = () => {},
		class: className = '',
		...restProps
	}: RecipePrivacySettings = $props();

	const state = createPrivacySettingsState(() => ({ settings, onSave, class: className }));
</script>

<div class={state.containerClass} {...restProps}>
	<h2 class={state.titleClass}>Privacy Settings</h2>
	<div class={state.settingsContainerClass}>
		{#each state.localSettings as setting}
			<div class={state.settingItemClass}>
				<div class={state.settingContentClass}>
					<h3 class={state.settingLabelClass}>{setting.label}</h3>
					<p class={state.settingDescriptionClass}>{setting.description}</p>
				</div>
				<label class={state.toggleContainerClass}>
					<input
						type="checkbox"
						class={state.toggleInputClass}
						checked={setting.enabled}
						onchange={() => state.toggleSetting(setting.id)}
					/>
					<div class={state.toggleTrackClass(setting.enabled)}></div>
					<div class={state.toggleThumbClass(setting.enabled)}></div>
				</label>
			</div>
		{/each}
	</div>
	<div class={state.saveButtonContainerClass}>
		<button onclick={onSave} class={state.saveButtonClass}> Save Settings </button>
	</div>
</div>

<style>
	.c-privacy-settings {
		overflow: hidden;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		background: var(--color-background-primary);
		padding: 1.5rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.c-privacy-settings__title {
		margin: 0 0 1rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.c-privacy-settings__list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.c-privacy-settings__item {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		background: var(--color-background-primary);
		padding: 0.75rem;
	}

	.c-privacy-settings__content {
		min-width: 0;
	}

	.c-privacy-settings__label {
		margin: 0;
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.c-privacy-settings__description {
		margin: 0.25rem 0 0;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.c-privacy-settings__toggle {
		position: relative;
		display: inline-flex;
		align-items: center;
		cursor: pointer;
	}

	.c-privacy-settings__toggle-input {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	.c-privacy-settings__toggle-track {
		display: block;
		width: 2.75rem;
		height: 1.5rem;
		border-radius: 999px;
		background: var(--color-neutral-300);
	}

	.c-privacy-settings__toggle-track--enabled {
		background: var(--color-primary-500);
	}

	.c-privacy-settings__toggle-thumb {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		background: var(--color-background-primary);
		transition: transform 0.2s ease;
	}

	.c-privacy-settings__toggle-thumb--enabled {
		transform: translateX(1.25rem);
	}

	.c-privacy-settings__actions {
		margin-top: 1.5rem;
	}

	.c-privacy-settings__save-button {
		border: 0;
		border-radius: 0.25rem;
		background: var(--color-primary-500);
		padding: 0.5rem 1rem;
		color: var(--color-text-inverse);
		cursor: pointer;
	}

	.c-privacy-settings__save-button:hover {
		background: var(--color-primary-600);
	}
</style>
