<script lang="ts">
	import type { RecipeStoryControl } from '$stylist/domain/interface/recipe/story-control';

	import createStoryControlComponentState from '$stylist/domain/component/atom/story-control/state.svelte';

	let {
		name,
		control,
		value,
		onChange,
		auto = false,
		class: className = ''
	}: RecipeStoryControl = $props();

	const state = createStoryControlComponentState(() => ({
		name: name,
		control: control,
		value: value,
		onChange: onChange
	}));
</script>

<div class="c-story-control {className}" data-type={control.type}>
	<label class="label" for={state.id}>
		<span>
			{control.label ?? name}
			{#if auto}<span class="auto" title="Inferred from the arg value">auto</span>{/if}
		</span>
		{#if control.type === 'range' || control.type === 'number'}
			<output for={state.id}>{String(value ?? '')}</output>
		{/if}
	</label>
	{#if control.description}
		<p class="description">{control.description}</p>
	{/if}

	{#if control.type === 'boolean'}
		<input
			id={state.id}
			class="toggle"
			type="checkbox"
			role="switch"
			checked={Boolean(value)}
			onchange={(event) => onChange?.(event.currentTarget.checked)}
		/>
	{:else if control.type === 'select'}
		<select
			id={state.id}
			class="field"
			value={String(value ?? '')}
			onchange={(event) => {
				const option = control.options?.[event.currentTarget.selectedIndex - 1];
				onChange?.(option === undefined ? undefined : option);
			}}
		>
			<option value="">—</option>
			{#each control.options ?? [] as option (option)}
				<option value={String(option)}>{option}</option>
			{/each}
		</select>
	{:else if control.type === 'number' || control.type === 'range'}
		<input
			id={state.id}
			class={control.type === 'range' ? 'slider' : 'field'}
			type={control.type}
			min={control.min}
			max={control.max}
			step={control.step}
			value={value ?? ''}
			oninput={(event) =>
				onChange?.(Number.isNaN(state.number(event)) ? undefined : state.number(event))}
		/>
	{:else if control.type === 'color'}
		<div class="color">
			<input
				id={state.id}
				type="color"
				value={String(value ?? '#000000')}
				oninput={(event) => onChange?.(state.text(event))}
			/>
			<input
				class="field"
				type="text"
				value={String(value ?? '')}
				aria-label="{control.label ?? name} value"
				oninput={(event) => onChange?.(state.text(event))}
			/>
		</div>
	{:else if control.type === 'json'}
		<textarea
			id={state.id}
			class="field code"
			rows={Math.min(14, Math.max(4, state.source.split('\n').length))}
			spellcheck="false"
			placeholder={state.example}
			aria-invalid={state.error ? 'true' : undefined}
			aria-describedby={state.error ? `${state.id}-error` : undefined}
			value={state.source}
			oninput={state.editJson}></textarea>
		{#if state.error}
			<p class="error" id="{state.id}-error">{state.error}</p>
		{/if}
	{:else}
		<input
			id={state.id}
			class="field"
			type="text"
			value={String(value ?? '')}
			oninput={(event) => onChange?.(state.text(event))}
		/>
	{/if}
</div>

<style>
	.c-story-control {
		display: grid;
		gap: 0.4rem;
		min-width: 0;
	}

	.c-story-control[data-type='json'] {
		grid-column: 1 / -1;
	}

	.label {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-text-primary);
		overflow-wrap: anywhere;
	}

	.auto {
		margin-inline-start: 0.35rem;
		padding: 0 0.3rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 999px;
		font-size: 0.65rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
	}

	output {
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.description {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--color-text-secondary);
	}

	.field {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		padding: 0.4rem 0.55rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.375rem;
		background: var(--color-background-primary);
		font: inherit;
		font-size: 0.82rem;
		color: var(--color-text-primary);
	}

	.code {
		resize: vertical;
		font-family: var(--font-family-mono, ui-monospace, monospace);
		font-size: 0.78rem;
		line-height: 1.45;
		white-space: pre;
		tab-size: 2;
	}

	.field[aria-invalid='true'] {
		border-color: var(--color-danger-500, #dc2626);
	}

	.error {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-danger-600, #b91c1c);
		overflow-wrap: anywhere;
	}

	.field:focus-visible,
	.toggle:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 1px;
	}

	.slider,
	.toggle {
		accent-color: var(--color-primary-500);
	}

	.toggle {
		justify-self: start;
		width: 1.1rem;
		height: 1.1rem;
		margin: 0;
	}

	.color {
		display: grid;
		grid-template-columns: 2.25rem minmax(0, 1fr);
		gap: 0.4rem;
	}

	.color input[type='color'] {
		width: 100%;
		height: 100%;
		padding: 0;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.375rem;
		background: none;
	}
</style>
