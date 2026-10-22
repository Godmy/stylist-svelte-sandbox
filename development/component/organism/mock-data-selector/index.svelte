<script lang="ts">
	import type { RecipeMockDataSelector } from '$stylist/development/interface/recipe/mock-data-selector';
	import { createMockDataSelectorState } from '$stylist/development/component/organism/mock-data-selector/state.svelte';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';

	let { ...props }: RecipeMockDataSelector = $props();
	const state = createMockDataSelectorState(() => props);
</script>

<div class={state.containerClass}>
	<div class={state.headerComputedClass}>
		<div class="mds-header-inner">
			<BaseIcon
				name={state.Database}
				style="width:1.5rem;height:1.5rem;margin-right:0.5rem;color:#6b7280"
			/>
			<h3 class="mds-title">{state.title}</h3>
		</div>
		<p class="mds-desc">{state.description}</p>
	</div>

	<div class="mds-body">
		<div class="mds-controls">
			{#if state.showSearch}
				<div>
					<label for="search" class="mds-label">Search Schemas</label>
					<div class="mds-search-wrap">
						<div class="mds-search-icon-wrap">
							<BaseIcon name={state.Search} style="width:1.25rem;height:1.25rem;color:#9ca3af" />
						</div>
						<input
							type="text"
							id="search"
							class="mds-search-input"
							bind:value={state.searchQuery}
							placeholder="Search schemas..."
						/>
					</div>
				</div>
			{/if}

			{#if state.showTagsFilter}
				<fieldset class="mds-fieldset">
					<legend class="mds-label">Filter by Tags</legend>
					<div class="mds-tags">
						{#each state.availableTags as tag}
							<button
								type="button"
								class={`mds-tag ${state.selectedTags.includes(tag) ? 'mds-tag--active' : 'mds-tag--inactive'}`}
								onclick={() => state.toggleTag(tag)}
							>
								{tag}
							</button>
						{/each}
					</div>
				</fieldset>
			{/if}

			<fieldset class="mds-fieldset">
				<legend class="mds-label">Actions</legend>
				<div class="mds-actions">
					<button type="button" class="mds-btn mds-btn--primary" onclick={state.loadMockData}>
						<BaseIcon name={state.Download} style="width:1rem;height:1rem;margin-right:0.25rem" />
						Load Data
					</button>
				</div>
			</fieldset>
		</div>

		<div class="mds-schemas-section">
			<h4 class="mds-section-title">Available Schemas</h4>
			<div class="mds-schema-grid">
				{#each state.getFilteredSchemas() as schema}
					<div class={`mds-schema-card ${state.selectorClass}`}>
						<div class="mds-card-header">
							<div>
								<h5 class="mds-card-name">{schema.name}</h5>
								<p class="mds-card-desc">{schema.description}</p>
							</div>
							<button
								type="button"
								class="mds-add-btn"
								onclick={() => state.addSelection(schema.id)}
								title="Add to selection"
							>
								<BaseIcon name={state.Shuffle} style="width:1.25rem;height:1.25rem" />
							</button>
						</div>

						<div class="mds-card-tags">
							<div class="mds-card-tags-inner">
								{#each schema.tags as tag}
									<span class="mds-tag-chip">{tag}</span>
								{/each}
							</div>
						</div>

						<div class="mds-card-meta">
							<span>{schema.fields.length} fields</span>
							<span style="margin:0 0.5rem">•</span>
							<span>{schema.sampleData.length} samples</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		{#if state.selections.length > 0}
			<div>
				<h4 class="mds-section-title">Selected Schemas</h4>
				<div class="mds-selections">
					{#each state.selections as selection, index}
						{@const schema = state.schemas.find((s) => s.id === selection.schemaId)}
						{#if schema}
							<div class={`mds-selection-card ${state.previewClass}`}>
								<div class="mds-card-header">
									<div>
										<div class="mds-selection-name-row">
											<h5 class="mds-card-name">{schema.name}</h5>
											<span class="mds-count-badge">{selection.count} records</span>
										</div>
										<p class="mds-card-desc">{schema.description}</p>
									</div>

									<button
										type="button"
										class="mds-remove-btn"
										onclick={() => state.removeSelection(index)}
										title="Remove selection"
									>
										<svg
											style="width:1.25rem;height:1.25rem"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>

								<div class="mds-count-section">
									<div class="mds-count-header">
										<label for="count-{index}" class="mds-label"> Number of records </label>
										{#if state.allowCustomCount}
											<input
												type="number"
												id="count-{index}"
												min="1"
												max="1000"
												class="mds-count-input"
												bind:value={state.selections[index].count}
												oninput={(e) =>
													state.updateCount(index, parseInt((e.target as HTMLInputElement).value))}
											/>
										{/if}
									</div>
								</div>

								{#if state.allowFieldSelection}
									<div class="mds-field-section">
										<h6 class="mds-field-title">Select Fields</h6>
										<div class="mds-fields-wrap">
											{#each schema.fields as field}
												<label
													class={`mds-field-chip ${state.selections[index].selectedFields?.includes(field.name) ? 'mds-field-chip--active' : ''}`}
												>
													<input
														type="checkbox"
														class="mds-checkbox"
														checked={state.selections[index].selectedFields?.includes(field.name) ??
															true}
														onchange={() => state.toggleField(index, field.name)}
													/>
													<span class="mds-field-name">{field.name}</span>
												</label>
											{/each}
										</div>
									</div>
								{/if}

								<div class="mds-preview-section">
									<h6 class="mds-field-title">Data Preview</h6>
									<div class="mds-table-wrap">
										<table class="mds-table">
											<thead>
												<tr>
													{#each schema.fields as field}
														{#if !state.selections[index].selectedFields || state.selections[index].selectedFields.includes(field.name)}
															<th class="mds-th">{field.name}</th>
														{/if}
													{/each}
												</tr>
											</thead>
											<tbody class="mds-tbody">
												{#each state.getSampleData(schema.id, Math.min(2, selection.count), state.selections[index].selectedFields) as item, i}
													<tr>
														{#each schema.fields as field}
															{#if !state.selections[index].selectedFields || state.selections[index].selectedFields.includes(field.name)}
																<td class="mds-td">{item[field.name]?.toString()}</td>
															{/if}
														{/each}
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class={state.footerComputedClass}>
		<div class="mds-footer-inner">
			<div class="mds-footer-count">
				{state.selections.length} schema{state.selections.length !== 1 ? 's' : ''} selected
			</div>
			<button type="button" class="mds-btn mds-btn--primary" onclick={state.loadMockData}>
				<BaseIcon name={state.Download} style="width:1rem;height:1rem;margin-right:0.25rem" />
				Generate Mock Data
			</button>
		</div>
	</div>
</div>

<style>
	.mds-header-inner {
		display: flex;
		align-items: center;
	}
	.mds-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: #111827;
	}
	.mds-desc {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: #6b7280;
	}
	.mds-body {
		padding: 1.5rem;
	}
	.mds-controls {
		margin-bottom: 1.5rem;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
	@media (min-width: 768px) {
		.mds-controls {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.mds-label {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}
	.mds-search-wrap {
		position: relative;
	}
	.mds-search-icon-wrap {
		pointer-events: none;
		position: absolute;
		inset-block: 0;
		left: 0;
		display: flex;
		align-items: center;
		padding-left: 0.75rem;
	}
	.mds-search-input {
		display: block;
		width: 100%;
		border-radius: 0.375rem;
		border: 1px solid #d1d5db;
		padding: 0.5rem 0.75rem 0.5rem 2.5rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		font-size: 0.875rem;
	}
	.mds-search-input:focus {
		border-color: #3b82f6;
		outline: none;
		box-shadow: 0 0 0 1px #3b82f6;
	}
	.mds-fieldset {
		margin: 0;
		border: 0;
		padding: 0;
	}
	.mds-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.mds-tag {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		padding: 0.125rem 0.625rem;
		font-size: 0.75rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
	}
	.mds-tag--active {
		background: #dbeafe;
		color: #1e40af;
	}
	.mds-tag--inactive {
		background: #f3f4f6;
		color: #1f2937;
	}
	.mds-tag--inactive:hover {
		background: #e5e7eb;
	}
	.mds-actions {
		display: flex;
		gap: 0.5rem;
	}
	.mds-btn {
		display: inline-flex;
		align-items: center;
		border-radius: 0.375rem;
		border: 1px solid transparent;
		font-size: 0.875rem;
		font-weight: 500;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
		cursor: pointer;
	}
	.mds-btn:focus {
		outline: none;
	}
	.mds-btn--primary {
		padding: 0.5rem 0.75rem;
		background: #2563eb;
		color: white;
	}
	.mds-btn--primary:hover {
		background: #1d4ed8;
	}
	.mds-schemas-section {
		margin-bottom: 2rem;
	}
	.mds-section-title {
		margin-bottom: 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #111827;
	}
	.mds-schema-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}
	@media (min-width: 768px) {
		.mds-schema-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1024px) {
		.mds-schema-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.mds-schema-card {
		border-radius: 0.5rem;
		border: 1px solid var(--color-border-primary);
		padding: 1rem;
		transition: box-shadow 0.2s ease;
	}
	.mds-schema-card:hover {
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	.mds-card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}
	.mds-card-name {
		font-weight: 500;
		color: #111827;
	}
	.mds-card-desc {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: #6b7280;
	}
	.mds-add-btn {
		border-radius: 9999px;
		padding: 0.375rem;
		color: #6b7280;
		background: none;
		border: none;
		cursor: pointer;
	}
	.mds-add-btn:hover {
		background: #f3f4f6;
	}
	.mds-card-tags {
		margin-top: 0.75rem;
	}
	.mds-card-tags-inner {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}
	.mds-tag-chip {
		display: inline-flex;
		align-items: center;
		border-radius: 0.25rem;
		background: #f3f4f6;
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #1f2937;
	}
	.mds-card-meta {
		margin-top: 0.75rem;
		font-size: 0.75rem;
		color: #6b7280;
	}
	.mds-selections {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.mds-selection-card {
		border-radius: 0.5rem;
		border: 1px solid var(--color-border-primary);
		padding: 1rem;
	}
	.mds-selection-name-row {
		display: flex;
		align-items: center;
	}
	.mds-count-badge {
		margin-left: 0.5rem;
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		background: #dbeafe;
		padding: 0.125rem 0.625rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #1e40af;
	}
	.mds-remove-btn {
		border-radius: 9999px;
		padding: 0.375rem;
		color: #ef4444;
		background: none;
		border: none;
		cursor: pointer;
	}
	.mds-remove-btn:hover {
		background: #fee2e2;
	}
	.mds-count-section {
		margin-top: 1rem;
	}
	.mds-count-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.mds-count-input {
		height: 2rem;
		width: 6rem;
		border-radius: 0.375rem;
		border: 1px solid #d1d5db;
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
	.mds-count-input:focus {
		border-color: #3b82f6;
		outline: none;
		box-shadow: 0 0 0 1px #3b82f6;
	}
	.mds-field-section {
		margin-top: 1rem;
	}
	.mds-field-title {
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #111827;
	}
	.mds-fields-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.mds-field-chip {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		background: #f3f4f6;
		color: #1f2937;
	}
	.mds-field-chip--active {
		background: #dbeafe;
		color: #1e40af;
	}
	.mds-checkbox {
		width: 1rem;
		height: 1rem;
		border-radius: 0.25rem;
		border: 1px solid #d1d5db;
	}
	.mds-field-name {
		margin-left: 0.25rem;
	}
	.mds-preview-section {
		margin-top: 1rem;
	}
	.mds-table-wrap {
		overflow-x: auto;
	}
	.mds-table {
		min-width: 100%;
		border-collapse: collapse;
	}
	.mds-table thead tr,
	.mds-table tbody tr {
		border-bottom: 1px solid #e5e7eb;
	}
	.mds-th {
		padding: 0.5rem 0.75rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		color: #6b7280;
		text-transform: uppercase;
	}
	.mds-tbody tr {
		border-bottom: 1px solid #e5e7eb;
	}
	.mds-td {
		max-width: 20rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		color: #6b7280;
	}
	.mds-footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.mds-footer-count {
		font-size: 0.875rem;
		color: #6b7280;
	}
	.mds-btn--primary.mds-btn {
		padding: 0.5rem 1rem;
	}
</style>
