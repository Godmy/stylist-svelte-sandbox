<script lang="ts">
	import type { RecipeSamoMorphologyBox } from '$stylist/domain/interface/recipe/samo-morphology-box';
	import createSamoMorphologyBoxComponentState from '$stylist/domain/component/molecule/samo-morphology-box/state.svelte';

	let {
		eyebrow = 'Morphological box',
		title = 'Zwicky’s method, applied to a button',
		description = 'Fritz Zwicky designed the morphological box to explore multi-dimensional problems. SAMO decomposes a UI element into independent axes — domains horizontally, clusters vertically — and every cell becomes one small file. Here is a Material Design 3 button taken apart.',
		product = 'Material Design 3 Button',
		domains = ['theme', 'typography', 'layout', 'interaction', 'control'],
		rows = [
			{
				cluster: 'data',
				accent: '#64748b',
				cells: [
					{ value: '--md-sys-color', note: 'Colour tokens from the MD3 palette.' },
					{ value: 'label-medium', note: 'Font token: 14px, weight 500.' },
					{ value: 'height: 40', note: 'Base container height from the MD3 spec.' },
					{ value: 'hover / pressed', note: 'State-layer opacity data for tactile feedback.' },
					{ value: 'variant=outlined', note: 'Data describing the selectable style variants.' }
				]
			},
			{
				cluster: 'const',
				accent: '#d97706',
				cells: [
					{ value: 'SHAPE_FULL', note: 'Corner-radius constant for the pill shape.' },
					{ value: 'LINE_HEIGHT_20', note: 'Line-height constant for the label.' },
					{ value: 'PADDING_H_24', note: 'Horizontal padding constant, 24px.' },
					{ value: 'TRANSITION_150', note: 'State transition duration constant.' },
					{ value: 'DENSITY_COMPACT', note: 'Compact density height constant, 32px.' }
				]
			},
			{
				cluster: 'type',
				accent: '#0284c7',
				cells: [
					{ value: 'ColorScheme', note: 'Typing of the colour palette.' },
					{ value: 'TypographyToken', note: 'Type of a font token object.' },
					{ value: 'Dimension', note: 'Type of sizes and spacings.' },
					{ value: 'ButtonState', note: 'Union of interaction states.' },
					{ value: 'ControlVariant', note: 'Union of the available variants.' }
				]
			},
			{
				cluster: 'interface',
				accent: '#7c3aed',
				cells: [
					{ value: 'SlotTheme', note: 'Slot that accepts theme overrides.' },
					{ value: 'SlotText', note: 'Slot for the label content.' },
					{ value: 'BehaviorShapeable', note: 'Behavior: pill, rounded, square.' },
					{ value: 'BehaviorClickable', note: 'Behavior: click, loading, cursor.' },
					{ value: 'RecipeButton', note: 'The final recipe merging all of the above.' }
				]
			},
			{
				cluster: 'class',
				accent: '#db2777',
				cells: [
					{ value: 'ThemeResolver', note: 'Manager that resolves the active theme.' },
					{ value: 'TypographyManager', note: 'Manager applying type scales.' },
					{ value: 'LayoutManager', note: 'Manager computing container geometry.' },
					{ value: 'RippleManager', note: 'Manager running the ripple animation.' },
					{ value: 'ControlManager', note: 'Manager keeping control state consistent.' }
				]
			},
			{
				cluster: 'function',
				accent: '#059669',
				cells: [
					{ value: 'resolveColor()', note: 'Picks the colour for the current variant and state.' },
					{ value: 'applyType()', note: 'Applies the label typography.' },
					{ value: 'calcGap()', note: 'Calculates the icon gap and min-width.' },
					{ value: 'handleRipple()', note: 'Starts the Material ripple wave.' },
					{ value: 'mergeProps()', note: 'Merges configuration from all recipes.' }
				]
			},
			{
				cluster: 'component',
				accent: '#ea580c',
				cells: [
					{ value: '<ThemeProvider>', note: 'Injects theme CSS variables via context.' },
					{ value: '<Text>', note: 'Typography wrapper for the label.' },
					{ value: '<Pill>', note: 'Flex container with the pill shape.' },
					{ value: '<Ripple>', note: 'Animation context for the press feedback.' },
					{ value: '<Button>', note: 'The final component: the sum of its column parts.' }
				]
			}
		],
		steps = [
			{
				title: 'Extract the axes',
				description: 'Split the problem into independent parameters: domains and clusters.'
			},
			{
				title: 'Enumerate the values',
				description: 'List every possible value for each axis — the closed set of seven clusters.'
			},
			{
				title: 'Build the field',
				description: 'Every intersection is a candidate entity with a fixed, predictable address.'
			},
			{
				title: 'Select combinations',
				description:
					'Keep only the cells the product needs — each becomes one file with one export.'
			}
		],
		class: className = ''
	}: RecipeSamoMorphologyBox = $props();

	const state = createSamoMorphologyBoxComponentState(() => ({ domains: domains, rows: rows }));
</script>

<section class={`c-samo-morphology-box ${className}`}>
	<header class="smb-header">
		<p class="smb-eyebrow">{eyebrow}</p>
		<h2 class="smb-title">{title}</h2>
		<p class="smb-description">{description}</p>
	</header>

	<ol class="smb-steps">
		{#each steps as step, index (index)}
			<li class="smb-step">
				<span class="smb-step-index">{index + 1}</span>
				<div>
					<p class="smb-step-title">{step.title}</p>
					<p class="smb-step-desc">{step.description}</p>
				</div>
			</li>
		{/each}
	</ol>

	<div class="smb-board">
		<div class="smb-scroll">
			<table class="smb-table">
				<caption class="smb-caption">{product}</caption>
				<thead>
					<tr>
						<th scope="col" class="smb-corner">cluster ↓ / domain →</th>
						{#each domains as domain, columnIndex (columnIndex)}
							<th
								scope="col"
								class="smb-domain"
								class:is-active={columnIndex === state.activeColumn}
							>
								{domain}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each rows as row, rowIndex (rowIndex)}
						<tr style={`--smb-accent:${row.accent}`}>
							<th scope="row" class="smb-cluster" class:is-active={rowIndex === state.activeRow}>
								{row.cluster}
							</th>
							{#each row.cells as cell, columnIndex (columnIndex)}
								<td class="smb-cell-wrap">
									<button
										type="button"
										class="smb-cell"
										class:is-active={rowIndex === state.activeRow &&
											columnIndex === state.activeColumn}
										class:is-cross={rowIndex === state.activeRow ||
											columnIndex === state.activeColumn}
										aria-pressed={rowIndex === state.activeRow &&
											columnIndex === state.activeColumn}
										onclick={() => state.selectCell(rowIndex, columnIndex)}
										onmouseenter={() => state.selectCell(rowIndex, columnIndex)}
										onfocus={() => state.selectCell(rowIndex, columnIndex)}
									>
										{cell.value}
									</button>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if state.activeCell}
			<div class="smb-detail" style={`--smb-accent:${rows[state.activeRow]?.accent}`}>
				<code class="smb-detail-address">{state.activeAddress}</code>
				<p class="smb-detail-value">{state.activeCell.value}</p>
				<p class="smb-detail-note">{state.activeCell.note}</p>
				<p class="smb-detail-hint">
					The <strong>component</strong> row is the assembly of everything above it. The
					<strong>control</strong> column read top-down is the button itself.
				</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.c-samo-morphology-box {
		display: grid;
		gap: 2rem;
	}

	.smb-header {
		max-width: 56rem;
	}

	.smb-eyebrow {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.smb-title {
		margin-top: 0.75rem;
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		line-height: 1.15;
		font-weight: 900;
		letter-spacing: -0.03em;
		color: var(--color-text-primary);
	}

	.smb-description {
		margin-top: 1rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.smb-steps {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
	}

	.smb-step {
		display: flex;
		gap: 0.75rem;
		border-radius: 1rem;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 92%, white 8%);
		padding: 1rem;
	}

	.smb-step-index {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		background: linear-gradient(135deg, #ea580c, #dc2626);
		font-weight: 900;
		color: #fff;
	}

	.smb-step-title {
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.smb-step-desc {
		margin-top: 0.25rem;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	.smb-board {
		display: grid;
		gap: 1.25rem;
		border-radius: 28px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 94%, white 6%);
		padding: clamp(1rem, 2.5vw, 1.75rem);
	}

	@media (min-width: 1200px) {
		.smb-board {
			grid-template-columns: minmax(0, 1fr) 18rem;
			align-items: start;
		}
	}

	.smb-scroll {
		overflow-x: auto;
	}

	.smb-table {
		width: 100%;
		min-width: 44rem;
		border-collapse: separate;
		border-spacing: 0.375rem;
	}

	.smb-caption {
		caption-side: top;
		padding-bottom: 0.5rem;
		text-align: left;
		font-size: 1.125rem;
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.smb-corner {
		font-size: 0.6875rem;
		font-weight: 600;
		text-align: left;
		color: var(--color-text-secondary);
	}

	.smb-domain,
	.smb-cluster {
		border-radius: 0.625rem;
		padding: 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		font-weight: 700;
		color: var(--color-text-secondary);
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.smb-domain.is-active {
		background-color: color-mix(in srgb, var(--color-warning-500) 16%, transparent);
		color: var(--color-text-primary);
	}

	.smb-cluster {
		text-align: left;
		color: var(--smb-accent);
	}

	.smb-cluster.is-active {
		background-color: color-mix(in srgb, var(--smb-accent) 16%, transparent);
	}

	.smb-cell-wrap {
		padding: 0;
	}

	.smb-cell {
		width: 100%;
		min-height: 2.75rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--smb-accent) 22%, var(--color-border-primary));
		background-color: color-mix(in srgb, var(--smb-accent) 5%, var(--color-background-primary));
		padding: 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			background-color 0.15s,
			border-color 0.15s,
			color 0.15s;
	}

	.smb-cell.is-cross {
		background-color: color-mix(in srgb, var(--smb-accent) 12%, var(--color-background-primary));
	}

	.smb-cell.is-active {
		border-color: var(--smb-accent);
		background-color: var(--smb-accent);
		color: #fff;
	}

	.smb-detail {
		border-radius: 1.25rem;
		border-left: 4px solid var(--smb-accent);
		background-color: color-mix(in srgb, var(--smb-accent) 8%, transparent);
		padding: 1.25rem;
	}

	.smb-detail-address {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
	}

	.smb-detail-value {
		margin-top: 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 1.375rem;
		font-weight: 800;
		word-break: break-word;
		color: var(--smb-accent);
	}

	.smb-detail-note {
		margin-top: 0.5rem;
		line-height: 1.6;
		color: var(--color-text-primary);
	}

	.smb-detail-hint {
		margin-top: 1rem;
		font-size: 0.875rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}
</style>
