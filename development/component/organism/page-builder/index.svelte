<script lang="ts">
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { PageBuilderTextAttributes as SlotPageBuilderTextAttributes } from '$stylist/development/interface/slot/page-builder-text-attributes';
	import type { PageBuilderHeadingAttributes as SlotPageBuilderHeadingAttributes } from '$stylist/development/interface/slot/page-builder-heading-attributes';
	import type { PageBuilderButtonAttributes as SlotPageBuilderButtonAttributes } from '$stylist/development/interface/slot/page-builder-button-attributes';
	import type { PageBuilderImageAttributes as SlotPageBuilderImageAttributes } from '$stylist/development/interface/slot/page-builder-image-attributes';
	import { PAGE_BUILDER_TOOLBAR_ITEMS } from '$stylist/development/const/record/page-builder-toolbar-items';
	import { PAGE_BUILDER_ICON } from '$stylist/development/const/map/page-builder-icons';
	import { PageBuilderManager } from '$stylist/development/class/manager/page-builder';
	import createPageBuilderState from '$stylist/development/component/organism/page-builder/state.svelte';
	import type { RecipePageBuilder } from '$stylist/development/interface/recipe/page-builder';
	import { isIconName } from '$stylist/svg/function/check/icon-name';

	let props: RecipePageBuilder = $props();
	const state = createPageBuilderState(() => props);
</script>

<div
	class="c-page-builder{state.className ? ` ${state.className}` : ''}"
	data-preview={state.isPreviewMode || undefined}
	data-editable={state.editable || undefined}
	{...state.restProps}
>
	{#if state.showToolbar}
		<div class="c-page-builder__toolbar">
			<div class="c-page-builder__toolbar-left">
				{#each PAGE_BUILDER_TOOLBAR_ITEMS as item}
					<button
						type="button"
						class="c-page-builder__toolbar-btn"
						onclick={() => state.addElement(item.type)}
						title={item.label}
					>
						<BaseIcon
							name={isIconName(item.icon) ? item.icon : 'box'}
							style="width:1rem;height:1rem;"
						/>
					</button>
				{/each}
			</div>

			<div class="c-page-builder__toolbar-spacer"></div>

			<div class="c-page-builder__toolbar-right">
				<button
					type="button"
					class="c-page-builder__toolbar-btn"
					onclick={() => (state.isPreviewMode = !state.isPreviewMode)}
					title="Preview"
				>
					<BaseIcon name={PAGE_BUILDER_ICON.EYE} style="width:1rem;height:1rem;" />
				</button>
				<button
					type="button"
					class="c-page-builder__toolbar-btn"
					onclick={state.handleSave}
					title="Save"
				>
					<BaseIcon name={PAGE_BUILDER_ICON.SAVE} style="width:1rem;height:1rem;" />
				</button>
			</div>
		</div>
	{/if}

	<div class="c-page-builder__main">
		<div class="c-page-builder__canvas" data-preview={state.isPreviewMode || undefined}>
			{#if state.isPreviewMode || !state.editable}
				<div class="c-page-builder__canvas-inner">
					{#each state.elements as element}
						<div>{@html PageBuilderManager.renderElement(element)}</div>
					{/each}
				</div>
			{:else}
				<div class="c-page-builder__canvas-inner">
					{#if state.elements.length === 0}
						<div class="c-page-builder__empty-canvas">
							<div class="c-page-builder__empty-icon">
								<BaseIcon name={PAGE_BUILDER_ICON.SQUARE} style="width:3rem;height:3rem;" />
							</div>
							<p>Drag elements here to start building your page</p>
							<p>Or use the toolbar to add elements</p>
						</div>
					{:else}
						<div class="c-page-builder__elements">
							{#each state.elements as element, index}
								<div
									class="c-page-builder__element"
									data-selected={state.selectedElementId === element.id || undefined}
									role="button"
									tabindex="0"
									draggable={state.editable}
									ondragstart={() => (state.dragIndex = index)}
									ondragover={(event) => state.handleDragOver(event, index)}
									ondragend={() => (state.dragIndex = null)}
									onclick={() => state.selectElement(element.id)}
									onkeydown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											event.preventDefault();
											state.selectElement(element.id);
										}
									}}
								>
									<div class="c-page-builder__element-handle">
										<BaseIcon
											name={PAGE_BUILDER_ICON.GRIP_VERTICAL}
											style="width:1rem;height:1rem;"
										/>
									</div>

									{#if element.type === 'text'}
										{@const attrs = element.attributes as SlotPageBuilderTextAttributes | undefined}
										<p
											style={`font-size:${attrs?.FONT_SIZE ?? 'var(--font-size-4)'};color:${attrs?.color ?? 'var(--color-text-primary)'};`}
										>
											{element.content}
										</p>
									{:else if element.type === 'heading'}
										{@const attrs = element.attributes as
											SlotPageBuilderHeadingAttributes | undefined}
										<h2
											style={`font-size:${attrs?.FONT_SIZE ?? 'var(--font-size-8)'};color:${attrs?.color ?? 'var(--color-text-primary)'};`}
										>
											{element.content}
										</h2>
									{:else if element.type === 'button'}
										{@const attrs = element.attributes as
											SlotPageBuilderButtonAttributes | undefined}
										<button
											style={`background-color:${attrs?.backgroundColor ?? 'var(--color-primary-500)'};color:${attrs?.color ?? 'var(--color-background-primary)'};padding:${attrs?.padding ?? 'var(--space-2) var(--space-4)'};`}
											class="c-page-builder__btn-element"
										>
											{element.content}
										</button>
									{:else if element.type === 'divider'}
										<hr class="c-page-builder__divider" />
									{:else if element.type === 'image'}
										{@const attrs = element.attributes as
											SlotPageBuilderImageAttributes | undefined}
										<div class="c-page-builder__img-placeholder">
											<BaseIcon name={PAGE_BUILDER_ICON.IMAGE} style="width:2rem;height:2rem;" />
											<span>Image: {attrs?.alt ?? 'Placeholder'}</span>
										</div>
									{/if}

									<div class="c-page-builder__element-controls">
										<button
											type="button"
											class="c-page-builder__element-ctrl-btn"
											onclick={(event) => {
												event.stopPropagation();
												state.duplicateElement(element.id);
											}}
											title="Duplicate"
										>
											<BaseIcon name={PAGE_BUILDER_ICON.COPY} style="width:1rem;height:1rem;" />
										</button>
										<button
											type="button"
											class="c-page-builder__element-ctrl-btn"
											data-danger
											onclick={(event) => {
												event.stopPropagation();
												state.deleteElement(element.id);
											}}
											title="Delete"
										>
											<BaseIcon name={PAGE_BUILDER_ICON.TRASH_2} style="width:1rem;height:1rem;" />
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<button
						type="button"
						class="c-page-builder__add-btn"
						onclick={() => state.addElement('text', state.elements.length)}
					>
						<BaseIcon name={PAGE_BUILDER_ICON.PLUS} style="width:1rem;height:1rem;" />
						Add Element
					</button>
				</div>
			{/if}
		</div>

		{#if state.selectedElement && !state.isPreviewMode && state.editable}
			<div class="c-page-builder__props-panel">
				<div class="c-page-builder__props-header">
					<h3>Properties</h3>
					<button
						type="button"
						class="c-page-builder__props-close"
						onclick={() => (state.selectedElementId = null)}
						title="Close"
					>
						<BaseIcon name={PAGE_BUILDER_ICON.X} style="width:1.25rem;height:1.25rem;" />
					</button>
				</div>

				<div class="c-page-builder__props-content">
					<div class="c-page-builder__field">
						<span class="c-page-builder__field-label">Type</span>
						<span style="font-size:0.875rem;text-transform:capitalize;"
							>{state.selectedElement?.type}</span
						>
					</div>

					{#if state.selectedElement?.type === 'text' || state.selectedElement?.type === 'heading'}
						<div class="c-page-builder__field">
							<label for="textContent" class="c-page-builder__field-label">Content</label>
							<input
								id="textContent"
								type="text"
								class="c-page-builder__field-input"
								value={state.selectedElement?.content ?? ''}
								oninput={(event) =>
									state.selectedElement &&
									state.updateElement(state.selectedElement.id, {
										content: (event.target as HTMLInputElement).value
									})}
							/>
						</div>
					{/if}

					{#if state.selectedElement?.type === 'button'}
						<div class="c-page-builder__field">
							<label for="buttonText" class="c-page-builder__field-label">Button Text</label>
							<input
								id="buttonText"
								type="text"
								class="c-page-builder__field-input"
								value={state.selectedElement?.content ?? ''}
								oninput={(event) =>
									state.selectedElement &&
									state.updateElement(state.selectedElement.id, {
										content: (event.target as HTMLInputElement).value
									})}
							/>
						</div>
					{/if}

					<div class="c-page-builder__field">
						<label for="FONT_SIZE" class="c-page-builder__field-label">Font Size</label>
						<input
							id="FONT_SIZE"
							type="range"
							class="c-page-builder__field-slider"
							min="8"
							max="72"
							value={(
								state.selectedElement?.attributes as SlotPageBuilderTextAttributes | undefined
							)?.FONT_SIZE?.replace('px', '') ?? '16'}
							oninput={(event) => {
								const FONT_SIZE = `${(event.target as HTMLInputElement).value}px`;
								if (state.selectedElement) {
									state.updateElement(state.selectedElement.id, {
										attributes: { ...(state.selectedElement.attributes ?? {}), FONT_SIZE } as any
									});
								}
							}}
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.c-page-builder {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.c-page-builder__toolbar {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		border-bottom: 1px solid var(--color-border-primary);
		background: var(--color-background-secondary);
		gap: 0.25rem;
	}
	.c-page-builder__toolbar-left,
	.c-page-builder__toolbar-right {
		display: flex;
		gap: 0.25rem;
	}
	.c-page-builder__toolbar-spacer {
		flex: 1;
	}
	.c-page-builder__toolbar-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.375rem;
		border: none;
		background: transparent;
		border-radius: 0.375rem;
		cursor: pointer;
		color: var(--color-text-secondary);
		transition: background-color var(--duration-120, 120ms);
	}
	.c-page-builder__toolbar-btn:hover {
		background: var(--color-background-tertiary, var(--color-background-primary));
		color: var(--color-text-primary);
	}
	.c-page-builder__main {
		display: flex;
	}
	.c-page-builder__canvas {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
	}
	.c-page-builder__canvas-inner {
		margin: 0 auto;
		max-width: 56rem;
	}
	.c-page-builder__empty-canvas {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 25rem;
		border: 2px dashed var(--color-border-primary);
		border-radius: 0.5rem;
		padding: 1rem;
		color: var(--color-text-secondary);
	}
	.c-page-builder__empty-icon {
		margin-bottom: 1rem;
	}
	.c-page-builder__elements {
		display: flex;
		flex-direction: column;
		gap: 0;
		min-height: 25rem;
		border: 2px dashed var(--color-border-primary);
		border-radius: 0.5rem;
		padding: 1rem;
	}
	.c-page-builder__element {
		position: relative;
		padding: 0.5rem;
		border: 2px solid transparent;
		border-radius: 0.25rem;
		transition: border-color var(--duration-120, 120ms);
		margin-bottom: 0;
		cursor: pointer;
	}
	.c-page-builder__element[data-selected] {
		border-color: var(--color-primary-500);
	}
	.c-page-builder__element:hover .c-page-builder__element-controls {
		opacity: 1;
	}
	.c-page-builder__element-handle {
		display: inline-flex;
		color: var(--color-text-tertiary);
		cursor: grab;
		position: absolute;
		left: -1.25rem;
		top: 50%;
		transform: translateY(-50%);
	}
	.c-page-builder__element-controls {
		position: absolute;
		top: 0;
		right: -1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity var(--duration-120, 120ms);
	}
	.c-page-builder__element-ctrl-btn {
		display: inline-flex;
		padding: 0.25rem;
		border: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
		border-radius: 0.25rem;
		cursor: pointer;
		color: var(--color-text-secondary);
	}
	.c-page-builder__element-ctrl-btn[data-danger] {
		color: var(--color-danger-600);
	}
	.c-page-builder__add-btn {
		margin-top: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		padding: 0.5rem 1rem;
		border: 1px dashed var(--color-border-primary);
		border-radius: 0.375rem;
		background: transparent;
		cursor: pointer;
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		width: 100%;
		transition: background-color var(--duration-120, 120ms);
	}
	.c-page-builder__add-btn:hover {
		background: var(--color-background-secondary);
	}
	.c-page-builder__props-panel {
		width: 16rem;
		flex-shrink: 0;
		border-left: 1px solid var(--color-border-primary);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.c-page-builder__props-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.c-page-builder__props-close {
		background: none;
		border: none;
		padding: 0.25rem;
		border-radius: 0.25rem;
		cursor: pointer;
		color: var(--color-text-secondary);
	}
	.c-page-builder__props-close:hover {
		background: var(--color-background-tertiary, var(--color-background-secondary));
	}
	.c-page-builder__props-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.c-page-builder__field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.c-page-builder__field-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-primary);
	}
	.c-page-builder__field-input {
		width: 100%;
		padding: 0.375rem 0.5rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
	}
	.c-page-builder__field-input:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}
	.c-page-builder__field-slider {
		width: 100%;
	}
	.c-page-builder__divider {
		border-top: 1px solid var(--color-border-primary);
		margin: 0.5rem 0;
	}
	.c-page-builder__img-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 8rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.375rem;
		background: var(--color-background-secondary);
		color: var(--color-text-tertiary);
	}
	.c-page-builder__btn-element {
		border-radius: 0.25rem;
		border: none;
		cursor: pointer;
	}
</style>
