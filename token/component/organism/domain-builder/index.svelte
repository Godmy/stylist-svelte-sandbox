<script lang="ts">
	import { type Component } from 'svelte';
	import DomainDescriptorPanel from '$stylist/token/component/molecule/domain-descriptor-panel/index.svelte';
	import DomainSidebar from '$stylist/domain/component/organism/domain-sidebar/index.svelte';
	import type { RecipeDomainBuilder } from '$stylist/token/interface/recipe/domain-builder';

	import createDomainBuilderComponentState from '$stylist/token/component/organism/domain-builder/state.svelte';
	type BuilderDomain = NonNullable<RecipeDomainBuilder['tree']>[number];
	type BuilderCluster = BuilderDomain['clusters'][number];
	type BuilderEntity = BuilderCluster['joints'][number]['entities'][number];
	type BuilderColumnCount = 1 | 2 | 3;
	type BuilderInstance = {
		id: string;
		entity: BuilderEntity;
		descriptorEntityPath: string;
		componentPath: string | null;
		componentModule: unknown;
		componentLoading: boolean;
		componentError: string;
		config: Record<string, unknown>;
	};
	type BuilderSection = {
		id: string;
		columns: BuilderColumnCount;
		items: string[][];
	};
	type BuilderStoredInstance = {
		id: string;
		descriptorEntityPath: string;
		config: Record<string, unknown>;
	};
	type BuilderStoredLayout = {
		version: number;
		sections: BuilderSection[];
		instances: BuilderStoredInstance[];
	};
	type BuilderDropTarget = {
		sectionId: string | null;
		columnIndex: number;
	};
	type SvelteModule = { default: unknown };
	let { tree = [], descriptors = [], class: className = '' }: RecipeDomainBuilder = $props();

	const state = createDomainBuilderComponentState(() => ({ tree: tree, descriptors: descriptors }));
</script>

<svelte:window onkeydown={state.handleKeyboardShortcut} />

<div class="c-domain-builder {className}">
	<aside class="builder-sidebar">
		<DomainSidebar
			activeDomain={state.activeDomain}
			activeCluster={state.activeCluster}
			activeJoint={state.activeJoint}
			availableDomains={state.availableDomainNames}
			availableJoints={state.availableJointNames}
			entities={state.entities}
			activeEntityPath={state.activeEntityPath}
			draggableEntities={true}
			onDomainSelect={state.handleDomainSelect}
			onClusterSelect={() => undefined}
			onJointSelect={state.handleJointSelect}
			onEntitySelect={(path) => {
				state.activeEntityPath = path;
			}}
			onEntityAdd={state.handleEntityAdd}
			onEntityDragStart={state.handleEntityDragStart}
		/>
	</aside>

	<section
		class:hovered={state.hoverCanvas}
		class="builder-canvas"
		aria-label="Constructor canvas"
		ondragover={state.handleCanvasDragOver}
		ondragleave={state.handleCanvasDragLeave}
		ondrop={state.handleCanvasDrop}
		onpointerdown={() => {
			state.selectedInstanceId = null;
		}}
	>
		<div class="builder-stage">
			<div
				class="export-bar"
				role="presentation"
				onpointerdown={(event) => event.stopPropagation()}
			>
				<select class="export-input" bind:value={state.templateDomain} aria-label="Template domain">
					{#each state.componentDomains as domain (domain.name)}
						<option value={domain.name}>{domain.name}</option>
					{/each}
				</select>
				<input
					class="export-input"
					type="text"
					placeholder="template-family-name"
					bind:value={state.templateFamily}
				/>
				<button
					type="button"
					class="section-create"
					disabled={state.exportState === 'saving'}
					onclick={() => void state.exportTemplate()}
				>
					{state.exportState === 'saving' ? 'Exporting...' : 'Export as template'}
				</button>
				{#if state.exportMessage}
					<span class:export-message--error={state.exportState === 'error'} class="export-message">
						{state.exportMessage}
					</span>
				{/if}
			</div>

			{#if state.sections.length === 0}
				<div class="empty-canvas">
					<h2>Start with a section</h2>
					<p>
						Build the page top-to-bottom. Pick a section layout, then add components into columns.
					</p>
					<div class="empty-actions">
						<button
							type="button"
							class="section-create"
							onclick={() => state.createSectionAndSelect(1)}
						>
							1 column
						</button>
						<button
							type="button"
							class="section-create"
							onclick={() => state.createSectionAndSelect(2)}
						>
							2 columns
						</button>
						<button
							type="button"
							class="section-create"
							onclick={() => state.createSectionAndSelect(3)}
						>
							3 columns
						</button>
					</div>
				</div>
			{/if}

			{#each state.sections as section, sectionIndex (section.id)}
				<div class="section-insert-rail">
					<button
						type="button"
						class="section-insert"
						onclick={() =>
							state.insertSectionAfter(
								sectionIndex === 0 ? null : state.sections[sectionIndex - 1].id,
								1
							)}
					>
						+ 1
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() =>
							state.insertSectionAfter(
								sectionIndex === 0 ? null : state.sections[sectionIndex - 1].id,
								2
							)}
					>
						+ 2
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() =>
							state.insertSectionAfter(
								sectionIndex === 0 ? null : state.sections[sectionIndex - 1].id,
								3
							)}
					>
						+ 3
					</button>
				</div>

				<div
					class:selected={state.selectedSectionId === section.id}
					class={`page-section columns-${section.columns}`}
					role="button"
					tabindex="0"
					aria-label={`Section ${sectionIndex + 1}`}
					onclick={() => state.selectSection(section.id)}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							state.selectSection(section.id);
						}
					}}
				>
					<div
						class="section-toolbar"
						role="presentation"
						onpointerdown={(event) => event.stopPropagation()}
					>
						<button
							type="button"
							class="section-action"
							disabled={sectionIndex === 0}
							onclick={() => state.moveSection(section.id, -1)}
						>
							Section up
						</button>
						<button
							type="button"
							class="section-action"
							disabled={sectionIndex === state.sections.length - 1}
							onclick={() => state.moveSection(section.id, 1)}
						>
							Section down
						</button>
						<button
							type="button"
							class="section-action"
							onclick={() => state.setSectionColumns(section.id, 1)}
						>
							1 col
						</button>
						<button
							type="button"
							class="section-action"
							onclick={() => state.setSectionColumns(section.id, 2)}
						>
							2 col
						</button>
						<button
							type="button"
							class="section-action"
							onclick={() => state.setSectionColumns(section.id, 3)}
						>
							3 col
						</button>
						<button
							type="button"
							class="section-action danger"
							onclick={() => state.removeSection(section.id)}
						>
							Remove section
						</button>
					</div>

					<div class="section-grid">
						{#each section.items as columnItems, columnIndex (columnIndex)}
							<div
								class:selected={state.selectedSectionId === section.id &&
									state.selectedColumnIndex === columnIndex}
								class:drop-target={state.activeDropTarget?.sectionId === section.id &&
									state.activeDropTarget?.columnIndex === columnIndex}
								class="section-column"
								role="button"
								tabindex="0"
								aria-label={`Section ${sectionIndex + 1}, column ${columnIndex + 1}`}
								onclick={(event) => {
									event.stopPropagation();
									state.selectSection(section.id, columnIndex);
								}}
								onkeydown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										state.selectSection(section.id, columnIndex);
									}
								}}
								ondragenter={() => {
									state.activeDropTarget = { sectionId: section.id, columnIndex };
								}}
								ondragover={(event) => {
									event.preventDefault();
									state.activeDropTarget = { sectionId: section.id, columnIndex };
								}}
							>
								{#if columnItems.length === 0}
									<button
										type="button"
										class="column-placeholder"
										onclick={(event) => {
											event.stopPropagation();
											state.selectSection(section.id, columnIndex);
											if (state.activeEntity) {
												state.appendEntityToTarget(state.activeEntity, section.id, columnIndex);
											}
										}}
									>
										Drop here or add selected component
									</button>
								{/if}

								{#each columnItems as instanceId (instanceId)}
									{@const instance = state.getInstance(instanceId)}
									{#if instance}
										<div
											class:selected={state.selectedInstanceId === instance.id}
											class="component-block"
											role="button"
											tabindex="0"
											aria-label={`Select ${instance.entity.name}`}
											onclick={(event) => {
												event.stopPropagation();
												state.selectInstance(section.id, columnIndex, instance.id);
											}}
											onkeydown={(event) => {
												if (event.key === 'Enter' || event.key === ' ') {
													event.preventDefault();
													state.selectInstance(section.id, columnIndex, instance.id);
												}
											}}
										>
											{#if state.selectedInstanceId === instance.id}
												<div
													class="component-toolbar"
													role="presentation"
													onpointerdown={(event) => event.stopPropagation()}
												>
													<button
														type="button"
														class="component-action"
														onclick={() => state.moveSelectedInstance(-1)}
													>
														Up
													</button>
													<button
														type="button"
														class="component-action"
														onclick={() => state.moveSelectedInstance(1)}
													>
														Down
													</button>
													<button
														type="button"
														class="component-action"
														onclick={state.duplicateSelectedInstance}
													>
														Duplicate
													</button>
													<button
														type="button"
														class="component-action danger"
														onclick={state.removeSelectedInstance}
													>
														Remove
													</button>
												</div>
											{/if}

											<div class="component-surface">
												{#if instance.componentLoading}
													<div class="component-placeholder">Loading component...</div>
												{:else if instance.componentModule}
													{@const PreviewComponent = instance.componentModule as Component<
														Record<string, unknown>
													>}
													<PreviewComponent {...instance.config} />
												{:else if instance.componentError}
													<div class="component-placeholder component-placeholder--error">
														{instance.componentError}
													</div>
												{:else}
													<div class="component-placeholder">
														No component module found for {instance.entity.name}.
													</div>
												{/if}
											</div>
										</div>
									{/if}
								{/each}
							</div>
						{/each}
					</div>
				</div>
			{/each}

			{#if state.sections.length > 0}
				<div class="section-insert-rail section-insert-rail--tail">
					<button
						type="button"
						class="section-insert"
						onclick={() => state.insertSectionAfter(state.sections.at(-1)?.id ?? null, 1)}
					>
						+ 1
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() => state.insertSectionAfter(state.sections.at(-1)?.id ?? null, 2)}
					>
						+ 2
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() => state.insertSectionAfter(state.sections.at(-1)?.id ?? null, 3)}
					>
						+ 3
					</button>
				</div>
			{/if}

			{#if state.selectedDescriptor}
				<DomainDescriptorPanel descriptor={state.selectedDescriptor} />
			{/if}
		</div>
	</section>
</div>

<style>
	.c-domain-builder {
		display: grid;
		grid-template-columns: 249px minmax(0, 1fr);
		min-height: 100vh;
		background:
			radial-gradient(
				circle at top left,
				color-mix(in srgb, var(--color-primary-500) 16%, transparent),
				transparent 26%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--color-background-secondary) 88%, white 12%),
				var(--color-background-primary)
			);
		color: var(--color-text-primary);
	}

	.builder-sidebar {
		min-height: 0;
		border-right: 1px solid var(--color-border-primary);
		background: color-mix(in srgb, var(--color-background-primary) 92%, black 8%);
	}

	.builder-canvas {
		overflow: auto;
		padding: 5.5rem 1.5rem 1.5rem;
		background:
			linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
			linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
			color-mix(in srgb, var(--color-background-secondary) 94%, white 6%);
		background-size:
			24px 24px,
			24px 24px,
			auto;
		background-position:
			-1px -1px,
			-1px -1px,
			0 0;
	}

	.builder-canvas.hovered {
		box-shadow: inset 0 0 0 4px color-mix(in srgb, var(--color-primary-500) 14%, transparent);
	}

	.builder-stage {
		display: grid;
		gap: 1rem;
		min-height: calc(100vh - 7rem);
		padding: 2rem;
		background: rgba(255, 255, 255, 0.96);
		border-radius: 32px;
		box-shadow:
			0 22px 60px rgba(15, 23, 42, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.empty-canvas {
		display: grid;
		place-items: center;
		gap: 1rem;
		min-height: 100%;
		padding: 6rem 2rem;
		text-align: center;
		color: var(--color-text-secondary);
	}

	.empty-canvas h2,
	.empty-canvas p {
		margin: 0;
	}

	.empty-canvas h2 {
		font-size: 1.6rem;
		color: var(--color-text-primary);
	}

	.empty-actions,
	.section-insert-rail {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.section-create,
	.section-insert,
	.section-action,
	.component-action,
	.column-placeholder {
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 82%, transparent);
		border-radius: 999px;
		padding: 0.55rem 0.8rem;
		background: rgba(255, 255, 255, 0.92);
		color: var(--color-text-primary);
		font: inherit;
		cursor: pointer;
	}

	.section-action:disabled,
	.section-create:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.export-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 1rem;
		padding: 0.85rem 1rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 78%, transparent);
		border-radius: 20px;
		background: color-mix(in srgb, var(--color-primary-500) 6%, white 94%);
	}

	.export-input {
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 82%, transparent);
		border-radius: 10px;
		padding: 0.5rem 0.7rem;
		background: rgba(255, 255, 255, 0.95);
		color: var(--color-text-primary);
		font: inherit;
	}

	.export-message {
		font-size: 0.82rem;
		color: var(--color-text-secondary);
	}

	.export-message--error {
		color: color-mix(in srgb, var(--color-danger-500) 72%, var(--color-text-primary));
	}

	.page-section {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 72%, transparent);
		border-radius: 28px;
		background: color-mix(in srgb, var(--color-background-primary) 96%, white 4%);
	}

	.page-section.selected {
		border-color: color-mix(in srgb, var(--color-primary-500) 46%, var(--color-border-primary) 54%);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-500) 12%, transparent);
	}

	.section-toolbar,
	.component-toolbar {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: center;
	}

	.section-grid {
		display: grid;
		gap: 1rem;
	}

	.columns-1 .section-grid {
		grid-template-columns: minmax(0, 1fr);
	}

	.columns-2 .section-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.columns-3 .section-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.section-column {
		display: grid;
		gap: 0.85rem;
		align-content: start;
		min-height: 10rem;
		padding: 0.85rem;
		border: 1px dashed color-mix(in srgb, var(--color-border-primary) 72%, transparent);
		border-radius: 22px;
		background: color-mix(in srgb, var(--color-background-secondary) 86%, white 14%);
	}

	.section-column.selected,
	.section-column.drop-target {
		border-color: color-mix(in srgb, var(--color-primary-500) 50%, var(--color-border-primary) 50%);
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-primary-500) 12%, transparent);
	}

	.column-placeholder {
		width: 100%;
		min-height: 7rem;
		border-style: dashed;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.72);
	}

	.component-block {
		display: grid;
		gap: 0.6rem;
		padding: 0.65rem;
		border: 1px solid transparent;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.72);
	}

	.component-block.selected {
		border-color: color-mix(in srgb, var(--color-primary-500) 46%, var(--color-border-primary) 54%);
		box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
	}

	.component-surface {
		min-height: 4rem;
	}

	.component-placeholder {
		display: grid;
		place-items: center;
		min-height: 5rem;
		padding: 1rem;
		border: 1px dashed color-mix(in srgb, var(--color-border-primary) 72%, transparent);
		border-radius: 16px;
		background: color-mix(in srgb, var(--color-background-primary) 92%, white 8%);
		color: var(--color-text-secondary);
		text-align: center;
	}

	.component-placeholder--error,
	.section-action.danger,
	.component-action.danger {
		color: color-mix(in srgb, var(--color-danger-500) 72%, var(--color-text-primary));
	}

	@media (max-width: 960px) {
		.columns-2 .section-grid,
		.columns-3 .section-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 840px) {
		.c-domain-builder {
			grid-template-columns: 1fr;
		}

		.builder-sidebar {
			min-height: 22rem;
			border-right: none;
			border-bottom: 1px solid var(--color-border-primary);
		}

		.builder-canvas {
			padding: calc(env(safe-area-inset-top, 0px) + 6rem) 0.75rem 0.75rem;
		}

		.builder-stage {
			padding: 1rem;
		}
	}
</style>
