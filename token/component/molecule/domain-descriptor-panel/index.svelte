<script lang="ts">
	import OrbitBackground from '$stylist/token/component/atom/orbit-background/index.svelte';
	import Orbit from '$stylist/token/component/molecule/orbit/index.svelte';
	import OrbitContractL5 from '$stylist/token/component/organism/orbit-contract-l5/index.svelte';
	import { L6_TOKEN_DEFINITIONS } from '$stylist/token/const/object/orbit-control-definition';
	import type { RecipeDomainDescriptorPanel } from '$stylist/token/interface/recipe/domain-descriptor-panel';
	import type { TypeDomainComponentProjection } from '$stylist/domain/type/object/domain-component-projection';

	type DescriptorMode = 'architecture' | 'information' | 'interaction' | 'controls' | 'contracts';

	const modeLabels: Record<DescriptorMode, string> = {
		architecture: 'Architecture',
		information: 'Information',
		interaction: 'Interaction',
		controls: 'Controls',
		contracts: 'Contracts'
	};
	const architectureNodes = [
		{
			id: 'component-size',
			icon: 'component-size',
			label: 'Component Size',
			definition: L6_TOKEN_DEFINITIONS['component-size']
		},
		{
			id: 'animations',
			icon: 'animations',
			label: 'Animations',
			definition: L6_TOKEN_DEFINITIONS.animations
		}
	];
	const informationNodes = [
		{
			id: 'style',
			icon: 'style',
			label: 'Style',
			definition: L6_TOKEN_DEFINITIONS.style
		},
		{
			id: 'variants',
			icon: 'variants',
			label: 'Variants',
			definition: L6_TOKEN_DEFINITIONS.variants
		},
		{
			id: 'text-element',
			icon: 'text-element',
			label: 'Text Element',
			definition: L6_TOKEN_DEFINITIONS['text-element']
		}
	];
	const interactionNodes = [
		{
			id: 'controls',
			icon: 'controls',
			label: 'Controls',
			definition: L6_TOKEN_DEFINITIONS.controls
		},
		{
			id: 'state',
			icon: 'state',
			label: 'State',
			definition: L6_TOKEN_DEFINITIONS.state
		}
	];

	let { descriptor, class: className = '' }: RecipeDomainDescriptorPanel = $props();

	let activeMode = $state<DescriptorMode>('architecture');
	let projection = $state<TypeDomainComponentProjection | null>(null);
	let projectionLoading = $state(false);
	let projectionError = $state('');
	const descriptorEntityPath = $derived(descriptor.entityPath);

	function stringifyPreview(value: unknown): string {
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return String(value);
		}
	}

	function slicePreview(value: unknown): string {
		const text = stringifyPreview(value);
		return text.length > 360 ? `${text.slice(0, 360)}...` : text;
	}

	function readObjectField(value: unknown, key: string): string | null {
		if (typeof value !== 'object' || value === null || !(key in value)) {
			return null;
		}

		const fieldValue = (value as Record<string, unknown>)[key];
		return fieldValue == null ? null : String(fieldValue);
	}

	const architectureRows = $derived(
		projection
			? [
					{ label: 'Recipe', value: projection.architecture.recipeTypePath ?? 'missing' },
					{ label: 'State', value: projection.architecture.stateFunctionPath ?? 'missing' },
					{ label: 'Component', value: projection.architecture.componentModulePath ?? 'missing' },
					{
						label: 'Contracts',
						value: projection.architecture.contractPaths.length
							? projection.architecture.contractPaths.join('\n')
							: 'none'
					}
				]
			: []
	);
	const architecturePipeline = $derived(
		projection
			? [
					{
						label: 'Recipe',
						value: projection.architecture.recipeTypePath,
						kind: 'contract'
					},
					{
						label: 'State',
						value: projection.architecture.stateFunctionPath,
						kind: 'runtime'
					},
					{
						label: 'Component',
						value: projection.architecture.componentModulePath,
						kind: 'render'
					}
				]
			: []
	);

	const informationGroups = $derived(
		projection
			? [
					{ label: 'Recipe JSON', items: projection.information.recipeJson },
					{ label: 'Enum JSON', items: projection.information.enumJson },
					{ label: 'Map JSON', items: projection.information.mapJson }
				]
			: []
	);

	const interactionRows = $derived(
		projection
			? [
					{
						label: 'State pipeline',
						value: projection.interaction.hasStatePipeline ? 'available' : 'missing'
					},
					{ label: 'Story module', value: projection.interaction.storyModulePath ?? 'missing' },
					{ label: 'State JSON count', value: String(projection.interaction.stateJson.length) }
				]
			: []
	);

	const controlPreviews = $derived(projection?.controls.controlJson ?? []);
	const controlCards = $derived(
		controlPreviews.map((control, index) => ({
			title: readObjectField(control, 'id') ?? `Control #${index + 1}`,
			kind: readObjectField(control, 'controlKind') ?? 'unknown',
			tokenName: readObjectField(control, 'tokenName') ?? 'unknown',
			taxonomy:
				readObjectField(control, 'functionalTaxonomy') ??
				readObjectField(control, 'taxonomy') ??
				'unknown',
			preview: slicePreview(control)
		}))
	);
	const contractFiles = $derived(projection?.contracts.files ?? []);

	async function loadProjection(): Promise<void> {
		projectionLoading = true;
		projectionError = '';

		try {
			const response = await fetch(
				`/api/descriptor?entityPath=${encodeURIComponent(descriptor.entityPath)}`
			);
			if (!response.ok) {
				throw new Error(`Descriptor request failed with ${response.status}`);
			}

			projection = (await response.json()) as TypeDomainComponentProjection;
		} catch (error) {
			projectionError = error instanceof Error ? error.message : String(error);
		} finally {
			projectionLoading = false;
		}
	}

	$effect(() => {
		// Read only to re-run the projection when the descriptor path changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		descriptorEntityPath;
		projection = null;
		projectionError = '';
		void loadProjection();
	});
</script>

<aside class="c-domain-descriptor-panel {className}" aria-label="Descriptor orbit surface">
	<div class="panel-header">
		<div>
			<p class="eyebrow">Selected Descriptor</p>
			<p class="entity-path">{descriptor.entityPath}</p>
		</div>

		<div class="pill-row">
			<span class:active={descriptor.hasRecipePipeline} class="pill">recipe</span>
			<span class:active={descriptor.hasStatePipeline} class="pill">state</span>
			<span class:active={descriptor.hasStoryPreview} class="pill">story</span>
		</div>
	</div>

	<div class="mode-row" role="tablist" aria-label="Descriptor modes">
		{#each Object.entries(modeLabels) as [mode, label]}
			<button
				type="button"
				class:active={activeMode === mode}
				class="mode-button"
				role="tab"
				aria-selected={activeMode === mode}
				onclick={() => {
					activeMode = mode as DescriptorMode;
				}}
			>
				{label}
			</button>
		{/each}
	</div>

	<div class="panel-body">
		<div class="orbit-stage">
			{#if activeMode === 'contracts'}
				<div class="contract-stage">
					<OrbitContractL5 opened={true} showCore={false} showCaption={false} />
				</div>
			{:else}
				<OrbitBackground opened={true}>
					<div class="orbit-core">
						<span class="orbit-core__label">{modeLabels[activeMode]}</span>
						<strong class="orbit-core__value">{descriptor.family}</strong>
					</div>

					{#if activeMode === 'architecture'}
						<Orbit opened={true} radius={72} nodes={architectureNodes} />
					{:else if activeMode === 'information'}
						<Orbit opened={true} radius={104} nodes={informationNodes} />
					{:else}
						<Orbit opened={true} radius={136} nodes={interactionNodes} />
					{/if}
				</OrbitBackground>
			{/if}
		</div>

		<div class="summary-card">
			{#if projectionLoading}
				<p class="summary-card__title">Loading projection</p>
				<div class="summary-card__list">
					<p>Fetching descriptor projection data...</p>
				</div>
			{:else if projectionError}
				<p class="summary-card__title">Projection error</p>
				<div class="summary-card__list">
					<p>{projectionError}</p>
				</div>
			{:else if !projection}
				<p class="summary-card__title">Projection unavailable</p>
				<div class="summary-card__list">
					<p>Projection data has not been loaded yet.</p>
				</div>
			{:else if activeMode === 'architecture'}
				<p class="summary-card__title">Recipe and state pipeline</p>
				<div class="pipeline-graph" aria-label="Architecture pipeline">
					{#each architecturePipeline as node, index}
						<div class:missing={!node.value} class="pipeline-node">
							<span class="pipeline-node__kind">{node.kind}</span>
							<strong class="pipeline-node__label">{node.label}</strong>
							<p class="pipeline-node__path">{node.value ?? 'missing'}</p>
						</div>
						{#if index < architecturePipeline.length - 1}
							<div class="pipeline-arrow" aria-hidden="true">-></div>
						{/if}
					{/each}
				</div>
				<div class="summary-card__stack">
					{#each architectureRows as row}
						<div class="summary-item">
							<p class="summary-item__label">{row.label}</p>
							<pre class="summary-item__value">{row.value}</pre>
						</div>
					{/each}
				</div>
			{:else if activeMode === 'information'}
				<p class="summary-card__title">JSON information sources</p>
				<div class="summary-card__stack">
					{#each informationGroups as group}
						<div class="summary-item">
							<p class="summary-item__label">{group.label}</p>
							{#if group.items.length > 0}
								{#each group.items as item, index}
									<pre class="summary-item__value">#{index + 1} {slicePreview(item)}</pre>
								{/each}
							{:else}
								<p class="summary-item__empty">No data.</p>
							{/if}
						</div>
					{/each}
				</div>
			{:else if activeMode === 'interaction'}
				<p class="summary-card__title">Interactive runtime surface</p>
				<div class="summary-card__stack">
					{#each interactionRows as row}
						<div class="summary-item">
							<p class="summary-item__label">{row.label}</p>
							<pre class="summary-item__value">{row.value}</pre>
						</div>
					{/each}
					<div class="summary-item">
						<p class="summary-item__label">State JSON preview</p>
						{#if projection.interaction.stateJson.length > 0}
							<pre class="summary-item__value">{slicePreview(
									projection.interaction.stateJson[0]
								)}</pre>
						{:else}
							<p class="summary-item__empty">No state JSON.</p>
						{/if}
					</div>
				</div>
			{:else if activeMode === 'controls'}
				<p class="summary-card__title">Control definition sources</p>
				<div class="summary-card__stack">
					{#if controlCards.length > 0}
						{#each controlCards as control}
							<div class="control-card">
								<div class="control-card__header">
									<strong>{control.title}</strong>
									<span>{control.kind}</span>
								</div>
								<div class="control-card__meta">
									<p><strong>Token:</strong> {control.tokenName}</p>
									<p><strong>Taxonomy:</strong> {control.taxonomy}</p>
								</div>
								<pre class="summary-item__value">{control.preview}</pre>
							</div>
						{/each}
					{:else}
						<p class="summary-item__empty">No control definition JSON found.</p>
					{/if}
				</div>
			{:else}
				<p class="summary-card__title">Contract sources</p>
				<div class="summary-card__stack">
					{#if contractFiles.length > 0}
						{#each contractFiles as file}
							<div class="summary-item">
								<p class="summary-item__label">{file.path}</p>
								<pre class="summary-item__value">{file.content
										? slicePreview(file.content)
										: 'unreadable'}</pre>
							</div>
						{/each}
					{:else}
						<p class="summary-item__empty">No contract files found.</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</aside>

<style>
	.c-domain-descriptor-panel {
		position: sticky;
		bottom: 1rem;
		justify-self: end;
		display: grid;
		gap: 0.9rem;
		width: min(36rem, 100%);
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 82%, transparent);
		border-radius: 28px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(240, 247, 255, 0.94)),
			radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 38%);
		box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
		backdrop-filter: blur(12px);
	}

	.panel-header {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
	}

	.eyebrow,
	.entity-path {
		margin: 0;
	}

	.eyebrow {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.entity-path {
		margin-top: 0.35rem;
		font-family: var(--font-mono, monospace);
		font-size: 0.8rem;
		overflow-wrap: anywhere;
	}

	.pill-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		justify-content: flex-end;
	}

	.pill {
		padding: 0.2rem 0.5rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 82%, transparent);
		border-radius: 999px;
		font-size: 0.74rem;
		color: var(--color-text-secondary);
		background: rgba(255, 255, 255, 0.68);
	}

	.pill.active {
		border-color: color-mix(in srgb, var(--color-primary-500) 46%, var(--color-border-primary) 54%);
		color: var(--color-text-primary);
		background: color-mix(in srgb, var(--color-primary-500) 10%, white 90%);
	}

	.mode-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.mode-button {
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 82%, transparent);
		border-radius: 999px;
		padding: 0.5rem 0.82rem;
		background: rgba(255, 255, 255, 0.78);
		color: var(--color-text-secondary);
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
	}

	.mode-button.active {
		border-color: color-mix(in srgb, var(--color-primary-500) 48%, var(--color-border-primary) 52%);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-primary-500) 12%, white 88%),
			color-mix(in srgb, var(--color-primary-600) 8%, white 92%)
		);
		color: var(--color-text-primary);
	}

	.panel-body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 16rem;
		gap: 1rem;
		align-items: start;
	}

	.orbit-stage {
		display: grid;
		place-items: center;
		min-height: 22rem;
		padding: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 72%, transparent);
		border-radius: 24px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(234, 244, 255, 0.82));
		overflow: hidden;
	}

	.contract-stage {
		transform: scale(0.78);
		transform-origin: center;
	}

	.orbit-core {
		position: absolute;
		z-index: 3;
		display: grid;
		gap: 0.2rem;
		place-items: center;
		text-align: center;
	}

	.orbit-core__label,
	.orbit-core__value {
		margin: 0;
	}

	.orbit-core__label {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.orbit-core__value {
		max-width: 8rem;
		font-size: 0.95rem;
		overflow-wrap: anywhere;
	}

	.summary-card {
		display: grid;
		gap: 0.65rem;
		padding: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 72%, transparent);
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.84);
	}

	.summary-card__title {
		margin: 0;
		font-weight: 700;
	}

	.pipeline-graph {
		display: grid;
		gap: 0.55rem;
	}

	.pipeline-node {
		display: grid;
		gap: 0.24rem;
		padding: 0.7rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 74%, transparent);
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.82);
	}

	.pipeline-node.missing {
		border-color: color-mix(in srgb, var(--color-danger-500) 38%, var(--color-border-primary) 62%);
	}

	.pipeline-node__kind,
	.pipeline-node__label,
	.pipeline-node__path {
		margin: 0;
	}

	.pipeline-node__kind {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.pipeline-node__label {
		font-size: 0.84rem;
	}

	.pipeline-node__path {
		font-family: var(--font-mono, monospace);
		font-size: 0.72rem;
		color: var(--color-text-secondary);
		overflow-wrap: anywhere;
	}

	.pipeline-arrow {
		justify-self: center;
		font-family: var(--font-mono, monospace);
		font-size: 0.84rem;
		color: var(--color-text-secondary);
	}

	.summary-card__list,
	.summary-card__stack {
		display: grid;
		gap: 0.45rem;
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.summary-card__list p,
	.summary-item__label,
	.summary-item__empty {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.summary-item {
		display: grid;
		gap: 0.3rem;
		padding-top: 0.1rem;
	}

	.summary-item + .summary-item {
		border-top: 1px solid color-mix(in srgb, var(--color-border-primary) 68%, transparent);
		padding-top: 0.55rem;
	}

	.summary-item__label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.summary-item__value {
		margin: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		font-family: var(--font-mono, monospace);
		font-size: 0.74rem;
		color: var(--color-text-primary);
	}

	.control-card {
		display: grid;
		gap: 0.55rem;
		padding: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 74%, transparent);
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.8);
	}

	.control-card__header,
	.control-card__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem 0.8rem;
		align-items: center;
	}

	.control-card__header strong,
	.control-card__header span,
	.control-card__meta p {
		margin: 0;
	}

	.control-card__header span {
		padding: 0.18rem 0.45rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-background-secondary) 72%, white 28%);
		font-size: 0.72rem;
		color: var(--color-text-secondary);
	}

	.control-card__meta {
		font-size: 0.76rem;
		color: var(--color-text-secondary);
	}

	@media (max-width: 1120px) {
		.panel-body {
			grid-template-columns: 1fr;
		}

		.summary-card {
			order: -1;
		}
	}

	@media (max-width: 720px) {
		.panel-header {
			flex-direction: column;
		}

		.pill-row {
			justify-content: flex-start;
		}

		.contract-stage {
			transform: scale(0.66);
		}
	}
</style>
