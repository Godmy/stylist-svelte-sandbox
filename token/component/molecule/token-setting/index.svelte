<script lang="ts">
	import type { RecipeTokenSetting } from '$stylist/token/interface/recipe/token-setting';
	import createTokenSettingComponentState from '$stylist/token/component/molecule/token-setting/state.svelte';

	let {
		definition,
		value = undefined,
		showTokenDetails,
		showDependencies,
		showTooltip,
		defaultTokenView,
		dependencyCount = 0,
		onChange
	}: RecipeTokenSetting = $props();

	const state = createTokenSettingComponentState(() => ({
		definition: definition,
		value: value,
		showTokenDetails: showTokenDetails,
		onChange: onChange
	}));
</script>

<div class="token-setting-molecule">
	<button
		type="button"
		class="token-setting-molecule__icon-button"
		onclick={state.onIconClick}
		aria-label={definition.tokenName}
	>
		<div class="token-setting-molecule__icon-ring">
			{@html state.iconMarkup}
		</div>

		{#if showDependencies}
			<span class="token-setting-molecule__deps">{dependencyCount}</span>
		{/if}

		{#if showTooltip}
			<span class="token-setting-molecule__tooltip">{definition.tokenName}</span>
		{/if}
	</button>

	{#if state.panelVisible}
		<aside class="token-setting-molecule__panel">
			{#if showTokenDetails}
				<header class="token-setting-molecule__panel-header">
					<strong>{definition.tokenName}</strong>
					<small>{definition.tokenFile}</small>
				</header>
			{/if}

			<div class="token-setting-molecule__panel-body">
				{#if definition.controlKind === 'range'}
					<div class="token-setting-molecule__range-wrap">
						<input
							type="range"
							min={definition.min}
							max={definition.max}
							step={definition.step ?? 1}
							value={typeof state.internalValue === 'number'
								? state.internalValue
								: Number(definition.min)}
							oninput={(event) => state.setValue(Number((event.target as HTMLInputElement).value))}
						/>
						<span>{String(state.internalValue)}</span>
					</div>
				{:else if definition.controlKind === 'text'}
					<input
						class="token-setting-molecule__select"
						type="text"
						value={typeof state.internalValue === 'string'
							? state.internalValue
							: String(state.internalValue ?? '')}
						oninput={(event) => state.setValue((event.target as HTMLInputElement).value)}
					/>
				{:else if defaultTokenView === 'radio'}
					<div class="token-setting-molecule__chips">
						{#each definition.options as option, optionIndex (optionIndex)}
							<button
								type="button"
								class={`token-setting-molecule__chip ${state.internalValue === option.value ? 'token-setting-molecule__chip--active' : ''}`.trim()}
								onclick={() => state.setValue(option.value)}
							>
								{option.label}
							</button>
						{/each}
					</div>
				{:else}
					<select
						class="token-setting-molecule__select"
						value={String(state.internalValue)}
						onchange={(event) => {
							const next = (event.target as HTMLSelectElement).value;
							const option = definition.options.find((item) => String(item.value) === next);
							state.setValue(option?.value ?? next);
						}}
					>
						{#each definition.options as option, optionIndex2 (optionIndex2)}
							<option value={String(option.value)}>{option.label}</option>
						{/each}
					</select>
				{/if}
			</div>
		</aside>
	{/if}
</div>

<style>
	.token-setting-molecule {
		display: flex;
		align-items: flex-start;
		gap: 0.8rem;
	}

	.token-setting-molecule__icon-button {
		position: relative;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: pointer;
		border-radius: 999px;
	}

	.token-setting-molecule__icon-ring {
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--line, #d9e2ef);
		border-radius: 999px;
		display: grid;
		place-items: center;
		color: var(--muted, #64748b);
		background: #fff;
		transition:
			box-shadow 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease;
	}

	.token-setting-molecule__icon-button:hover .token-setting-molecule__icon-ring {
		border-color: color-mix(in srgb, var(--accent, #3b82f6) 65%, var(--line, #d9e2ef) 35%);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #3b82f6) 18%, transparent 82%);
		color: var(--text, #0f172a);
	}

	.token-setting-molecule__icon-ring :global(.token-setting-molecule__icon-svg) {
		width: 2.5rem;
		height: 2.5rem;
		display: block;
		color: currentColor;
	}

	.token-setting-molecule__deps {
		position: absolute;
		top: -0.2rem;
		right: -0.25rem;
		min-width: 1.2rem;
		height: 1.2rem;
		border-radius: 999px;
		border: 1px solid #cbd5e1;
		background: #0f172a;
		color: #fff;
		font-size: 0.65rem;
		font-weight: 700;
		display: grid;
		place-items: center;
		padding: 0 0.25rem;
	}

	.token-setting-molecule__tooltip {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: calc(100% + 0.35rem);
		font-size: 0.68rem;
		line-height: 1;
		white-space: nowrap;
		border: 1px solid #d9e2ef;
		background: #fff;
		color: #334155;
		border-radius: 999px;
		padding: 0.22rem 0.42rem;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.13s ease;
	}

	.token-setting-molecule__icon-button:hover .token-setting-molecule__tooltip {
		opacity: 1;
	}

	.token-setting-molecule__panel {
		border: 1px solid var(--line, #d9e2ef);
		border-radius: 10px;
		background: #fff;
		padding: 0.45rem 0.55rem;
		min-width: 250px;
		max-width: 420px;
		display: grid;
		gap: 0.45rem;
	}

	.token-setting-molecule__panel-header {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
	}

	.token-setting-molecule__panel-header strong {
		font-size: 0.75rem;
		color: #0f172a;
	}

	.token-setting-molecule__panel-header small {
		font-size: 0.66rem;
		color: #64748b;
	}

	.token-setting-molecule__panel-body {
		display: grid;
		gap: 0.45rem;
	}

	.token-setting-molecule__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.token-setting-molecule__chip {
		border: 1px solid #d9e2ef;
		border-radius: 999px;
		background: #fff;
		color: #334155;
		font-size: 0.69rem;
		padding: 0.18rem 0.5rem;
		cursor: pointer;
	}

	.token-setting-molecule__chip--active {
		border-color: #0f172a;
		background: #0f172a;
		color: #fff;
	}

	.token-setting-molecule__select {
		border: 1px solid #d9e2ef;
		border-radius: 8px;
		background: #fff;
		color: #334155;
		font-size: 0.72rem;
		padding: 0.3rem 0.45rem;
	}

	.token-setting-molecule__range-wrap {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.4rem;
		align-items: center;
	}

	.token-setting-molecule__range-wrap span {
		font-size: 0.72rem;
		font-weight: 600;
		color: #0f172a;
		min-width: 2rem;
		text-align: right;
	}
</style>
