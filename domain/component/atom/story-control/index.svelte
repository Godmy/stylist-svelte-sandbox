<script lang="ts">
	import type { RecipeStoryControl } from '$stylist/domain/interface/recipe/story-control';

	let { name, control, value, onChange, class: className = '' }: RecipeStoryControl = $props();

	const id = $derived(`story-control-${name}`);
	const text = (event: Event) => (event.currentTarget as HTMLInputElement).value;
	const number = (event: Event) => (event.currentTarget as HTMLInputElement).valueAsNumber;
</script>

<div class="c-story-control {className}">
	<label class="label" for={id}>
		<span>{control.label ?? name}</span>
		{#if control.type === 'range' || control.type === 'number'}
			<output for={id}>{String(value ?? '')}</output>
		{/if}
	</label>
	{#if control.description}
		<p class="description">{control.description}</p>
	{/if}

	{#if control.type === 'boolean'}
		<input
			{id}
			class="toggle"
			type="checkbox"
			role="switch"
			checked={Boolean(value)}
			onchange={(event) => onChange?.(event.currentTarget.checked)}
		/>
	{:else if control.type === 'select'}
		<select
			{id}
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
			{id}
			class={control.type === 'range' ? 'slider' : 'field'}
			type={control.type}
			min={control.min}
			max={control.max}
			step={control.step}
			value={value ?? ''}
			oninput={(event) => onChange?.(Number.isNaN(number(event)) ? undefined : number(event))}
		/>
	{:else if control.type === 'color'}
		<div class="color">
			<input
				{id}
				type="color"
				value={String(value ?? '#000000')}
				oninput={(event) => onChange?.(text(event))}
			/>
			<input
				class="field"
				type="text"
				value={String(value ?? '')}
				aria-label="{control.label ?? name} value"
				oninput={(event) => onChange?.(text(event))}
			/>
		</div>
	{:else}
		<input
			{id}
			class="field"
			type="text"
			value={String(value ?? '')}
			oninput={(event) => onChange?.(text(event))}
		/>
	{/if}
</div>

<style>
	.c-story-control {
		display: grid;
		gap: 0.4rem;
		min-width: 0;
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
