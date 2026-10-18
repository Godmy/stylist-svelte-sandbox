<script lang="ts">
	import { untrack } from 'svelte';
	import type { TokenControlDefinition } from '$stylist/token/type/object/token-control-definition';
	import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';
	import type { RecipeTokenSetting } from '$stylist/token/interface/recipe/token-setting';

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

	const architectureSvgs = (import.meta as any).glob('/src/lib/architecture/data/svg/*.svg', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
	const informationSvgs = (import.meta as any).glob('/src/lib/information/data/svg/*.svg', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;

	function normalizeSlug(input: string): string {
		return input
			.toLowerCase()
			.replace(/\[[^\]]*]/g, '')
			.replace(/_/g, '-')
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/--+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function mapSvgByName(source: Record<string, string>): Record<string, string> {
		const out: Record<string, string> = {};
		for (const [path, svg] of Object.entries(source)) {
			const fileName = path.split('/').pop() ?? '';
			const iconName = fileName.replace(/\.svg$/i, '');
			out[normalizeSlug(iconName)] = svg;
		}
		return out;
	}

	const svgByDomain = {
		architecture: mapSvgByName(architectureSvgs),
		information: mapSvgByName(informationSvgs)
	} as const;
	const svgByNameGlobal: Record<string, string> = {
		...svgByDomain.architecture,
		...svgByDomain.information
	};
	const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;

	function resolveIconSvg(def: TokenControlDefinition): string {
		const local =
			svgByDomain[def.functionalTaxonomy as keyof typeof svgByDomain] ?? svgByNameGlobal;
		const candidates = [normalizeSlug(def.tokenFile), normalizeSlug(def.tokenName)].filter(
			(name, index, arr) => name.length > 0 && arr.indexOf(name) === index
		);

		for (const candidate of candidates) {
			if (local[candidate]) return local[candidate];
		}
		for (const candidate of candidates) {
			if (svgByNameGlobal[candidate]) return svgByNameGlobal[candidate];
		}
		return fallbackSvg;
	}

	function decorateSvg(svg: string): string {
		return svg.replace('<svg', '<svg class="token-setting-molecule__icon-svg" aria-hidden="true"');
	}

	function firstOptionValue(def: TokenControlDefinition): TokenValue {
		if (def.controlKind === 'radio' || def.controlKind === 'select') {
			return def.options[0]?.value ?? '';
		}
		if (def.controlKind === 'range') {
			return def.min;
		}
		return typeof def.defaultValue === 'string' ? def.defaultValue : '';
	}

	let internalValue = $state<TokenValue>(
		untrack(() => value ?? definition.defaultValue ?? firstOptionValue(definition))
	);
	let dataOnlyOpened = $state(false);

	$effect(() => {
		if (value !== undefined && value !== internalValue) {
			internalValue = value;
		}
	});

	$effect(() => {
		if (showTokenDetails && dataOnlyOpened) {
			dataOnlyOpened = false;
		}
	});

	function setValue(next: TokenValue): void {
		internalValue = next;
		onChange?.(next);
	}

	function onIconClick(): void {
		if (showTokenDetails) return;
		dataOnlyOpened = !dataOnlyOpened;
	}

	const iconMarkup = $derived.by(() => decorateSvg(resolveIconSvg(definition)));
	const panelVisible = $derived.by(() => showTokenDetails || dataOnlyOpened);
</script>

<div class="token-setting-molecule">
	<button
		type="button"
		class="token-setting-molecule__icon-button"
		onclick={onIconClick}
		aria-label={definition.tokenName}
	>
		<div class="token-setting-molecule__icon-ring">
			{@html iconMarkup}
		</div>

		{#if showDependencies}
			<span class="token-setting-molecule__deps">{dependencyCount}</span>
		{/if}

		{#if showTooltip}
			<span class="token-setting-molecule__tooltip">{definition.tokenName}</span>
		{/if}
	</button>

	{#if panelVisible}
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
							value={typeof internalValue === 'number' ? internalValue : Number(definition.min)}
							oninput={(event) => setValue(Number((event.target as HTMLInputElement).value))}
						/>
						<span>{String(internalValue)}</span>
					</div>
				{:else if definition.controlKind === 'text'}
					<input
						class="token-setting-molecule__select"
						type="text"
						value={typeof internalValue === 'string' ? internalValue : String(internalValue ?? '')}
						oninput={(event) => setValue((event.target as HTMLInputElement).value)}
					/>
				{:else if defaultTokenView === 'radio'}
					<div class="token-setting-molecule__chips">
						{#each definition.options as option}
							<button
								type="button"
								class={`token-setting-molecule__chip ${internalValue === option.value ? 'token-setting-molecule__chip--active' : ''}`.trim()}
								onclick={() => setValue(option.value)}
							>
								{option.label}
							</button>
						{/each}
					</div>
				{:else}
					<select
						class="token-setting-molecule__select"
						value={String(internalValue)}
						onchange={(event) => {
							const next = (event.target as HTMLSelectElement).value;
							const option = definition.options.find((item) => String(item.value) === next);
							setValue(option?.value ?? next);
						}}
					>
						{#each definition.options as option}
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
