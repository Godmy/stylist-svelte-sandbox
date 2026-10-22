<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeContentEditorStateProps } from '$stylist/development/interface/recipe/content-editor-state-props';
	import createContentEditorState from '$stylist/development/component/organism/content-editor/state.svelte';

	const Bold = 'bold';
	const Italic = 'italic';
	const Underline = 'underline';
	const AlignLeft = 'align-left';
	const AlignCenter = 'align-center';
	const AlignRight = 'align-right';
	const List = 'list';
	const ListOrdered = 'list-ordered';
	const Link = 'link';
	const Image = 'image';
	const Save = 'save';
	const Eye = 'eye';

	let props: RecipeContentEditorStateProps & HTMLAttributes<HTMLDivElement> = $props();
	const state = createContentEditorState(() => props);
</script>

<div class={state.rootClasses} {...props}>
	{#if props.showToolbar ?? true}
		<div class={state.toolbarClasses}>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('bold')}
				title="Bold"
			>
				<BaseIcon name={Bold} style="width: 1rem; height: 1rem;" />
			</button>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('italic')}
				title="Italic"
			>
				<BaseIcon name={Italic} style="width: 1rem; height: 1rem;" />
			</button>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('underline')}
				title="Underline"
			>
				<BaseIcon name={Underline} style="width: 1rem; height: 1rem;" />
			</button>
			<div class={state.dividerClasses}></div>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('justifyLeft')}
				title="Align Left"
			>
				<BaseIcon name={AlignLeft} style="width: 1rem; height: 1rem;" />
			</button>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('justifyCenter')}
				title="Align Center"
			>
				<BaseIcon name={AlignCenter} style="width: 1rem; height: 1rem;" />
			</button>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('justifyRight')}
				title="Align Right"
			>
				<BaseIcon name={AlignRight} style="width: 1rem; height: 1rem;" />
			</button>
			<div class={state.dividerClasses}></div>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('insertUnorderedList')}
				title="Bullet List"
			>
				<BaseIcon name={List} style="width: 1rem; height: 1rem;" />
			</button>
			<button
				type="button"
				class={state.buttonClasses}
				onclick={() => state.formatText('insertOrderedList')}
				title="Numbered List"
			>
				<BaseIcon name={ListOrdered} style="width: 1rem; height: 1rem;" />
			</button>
			<div class={state.dividerClasses}></div>
			<button type="button" class={state.buttonClasses} title="Add Image">
				<BaseIcon name={Image} style="width: 1rem; height: 1rem;" />
			</button>
			<button type="button" class={state.buttonClasses} title="Add Link">
				<BaseIcon name={Link} style="width: 1rem; height: 1rem;" />
			</button>

			<div class="c-content-editor__spacer"></div>

			<button
				type="button"
				class={state.buttonClasses}
				onclick={state.togglePreview}
				title="Preview"
			>
				<BaseIcon name={Eye} style="width: 1rem; height: 1rem;" />
			</button>
			<button type="button" class={state.buttonClasses} onclick={state.handleSave} title="Save">
				<BaseIcon name={Save} style="width: 1rem; height: 1rem;" />
			</button>
		</div>
	{/if}

	<div class={state.editorClasses}>
		{#if state.isPreviewMode}
			<div class={state.previewClasses}>
				{#each state.contentElements as element}
					{#if element.type === 'text'}
						<p class="c-content-editor__preview-p">
							{element.content || props.placeholder || 'Start writing here...'}
						</p>
					{:else if element.type === 'header'}
						<h2 class={state.headingClasses}>{element.content}</h2>
					{:else if element.type === 'quote'}
						<blockquote class={state.quoteClasses}>{element.content}</blockquote>
					{:else if element.type === 'list'}
						<ul class={state.listClasses}>
							<li>{element.content}</li>
						</ul>
					{/if}
				{/each}
			</div>
		{:else}
			{#each state.contentElements as element, index}
				<div
					class={`${state.contentClasses} ${state.activeElementId === element.id ? state.activeElementClasses : state.inactiveElementClasses}`}
					role="button"
					tabindex="0"
					onclick={() => state.setActiveElementId(element.id)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							state.setActiveElementId(element.id);
						}
					}}
				>
					{#if element.type === 'text'}
						<textarea
							class={state.textareaClasses}
							placeholder={index === 0 ? props.placeholder || 'Start writing here...' : ''}
							bind:value={element.content}
							oninput={() => state.updateContent(element.id, element.content)}
							rows={3}></textarea>
					{:else if element.type === 'header'}
						<input
							type="text"
							class={state.headingInputClasses}
							bind:value={element.content}
							oninput={() => state.updateContent(element.id, element.content)}
							placeholder="Heading..."
						/>
					{:else if element.type === 'quote'}
						<textarea
							class={state.quoteTextareaClasses}
							bind:value={element.content}
							oninput={() => state.updateContent(element.id, element.content)}
							placeholder="Quote..."
							rows={2}></textarea>
					{:else if element.type === 'image'}
						<div class={state.imagePlaceholderClasses}>
							<BaseIcon
								name={Image}
								style="width: 2.5rem; height: 2.5rem; color: var(--color-text-tertiary); margin-bottom: 0.5rem;"
							/>
							<p class={state.imagePlaceholderTextClasses}>
								Image: {element.content || 'No image selected'}
							</p>
							<p class={state.imagePlaceholderHintClasses}>Click to add image</p>
						</div>
					{/if}

					<div class="c-content-editor__element-actions">
						<button
							type="button"
							class={state.moveButtonClasses}
							onclick={() => state.moveElement(element.id, 'up')}
							disabled={index === 0}
							title="Move up"
						>
							<svg
								class="c-content-editor__icon"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 15l7-7 7 7"
								/>
							</svg>
						</button>
						<button
							type="button"
							class={state.moveButtonClasses}
							onclick={() => state.moveElement(element.id, 'down')}
							disabled={index === state.contentElements.length - 1}
							title="Move down"
						>
							<svg
								class="c-content-editor__icon"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
						<button
							type="button"
							class={state.deleteButtonClasses}
							onclick={() => state.deleteElement(element.id)}
							disabled={state.contentElements.length <= 1}
							title="Delete"
						>
							<svg
								class="c-content-editor__icon"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div class="c-content-editor__add-row">
					<button
						type="button"
						class={state.addButtonTextClasses}
						onclick={() => state.addNewElement(index)}
					>
						<svg class={state.addIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Add
					</button>
				</div>
			{/each}

			<div class="c-content-editor__add-end">
				<button
					type="button"
					class={state.addButtonTextClasses}
					onclick={() => state.addNewElement(state.contentElements.length - 1)}
				>
					<svg class={state.addIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					Add new block
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.c-content-editor {
		border: 1px solid var(--color-border-primary);
		border-radius: var(--border-radius-large, 0.5rem);
		overflow: hidden;
	}

	.c-content-editor__toolbar {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		gap: 0.25rem;
		border-block-end: 1px solid var(--color-border-primary);
		background-color: var(--color-background-secondary);
	}

	.c-content-editor__spacer {
		flex: 1;
	}

	.c-content-editor__editor {
		padding: 1rem;
	}

	.c-content-editor__content {
		margin-block-end: 1rem;
		padding: 0.5rem;
		border: 1px solid transparent;
		border-radius: var(--border-radius-sm, 0.25rem);
	}

	.c-content-editor__content--active {
		border-color: var(--color-primary-500);
	}

	.c-content-editor__btn {
		padding: 0.5rem;
		border-radius: var(--border-radius-sm, 0.25rem);
		background: none;
		border: none;
		cursor: pointer;
	}

	.c-content-editor__btn:hover {
		background-color: var(--color-background-tertiary);
	}

	.c-content-editor__divider {
		width: 1px;
		height: 1.5rem;
		background-color: var(--color-background-tertiary);
		margin-inline: 0.25rem;
	}

	.c-content-editor__icon {
		width: 1rem;
		height: 1rem;
	}

	.c-content-editor__element-actions {
		margin-block-start: 0.25rem;
		display: flex;
		justify-content: flex-end;
		gap: 0.25rem;
	}

	.c-content-editor__move-btn {
		padding: 0.25rem;
		color: var(--color-text-tertiary);
		background: none;
		border: none;
		cursor: pointer;
	}

	.c-content-editor__move-btn:hover {
		color: var(--color-text-secondary);
	}

	.c-content-editor__delete-btn {
		padding: 0.25rem;
		color: var(--color-text-tertiary);
		background: none;
		border: none;
		cursor: pointer;
	}

	.c-content-editor__delete-btn:hover {
		color: var(--color-danger-500);
	}

	.c-content-editor__add-row {
		margin-block: 0.5rem;
		display: flex;
		justify-content: center;
	}

	.c-content-editor__add-end {
		margin-block-start: 1rem;
		display: flex;
		justify-content: center;
	}

	.c-content-editor__add-btn {
		display: flex;
		align-items: center;
		font-size: var(--text-size-sm, 0.875rem);
		font-weight: 500;
		color: var(--color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
	}

	.c-content-editor__add-btn:hover {
		color: var(--color-text-primary);
	}

	.c-content-editor__add-icon {
		width: 1rem;
		height: 1rem;
		margin-inline-end: 0.25rem;
	}

	.c-content-editor__preview {
		max-width: none;
	}

	.c-content-editor__preview-p {
		margin-block-end: 1rem;
	}

	.c-content-editor__heading {
		font-size: var(--text-size-2xl, 1.5rem);
		font-weight: 700;
		margin-block-end: 1rem;
	}

	.c-content-editor__quote {
		border-inline-start: 4px solid var(--color-border-primary);
		padding-inline-start: 1rem;
		font-style: italic;
		margin-block: 1rem;
	}

	.c-content-editor__list {
		list-style: disc;
		padding-inline-start: 1.25rem;
		margin-block: 1rem;
	}

	.c-content-editor__textarea {
		width: 100%;
		outline: none;
		background: none;
		border: none;
		resize: vertical;
		font: inherit;
	}

	.c-content-editor__heading-input {
		width: 100%;
		font-size: var(--text-size-2xl, 1.5rem);
		font-weight: 700;
		outline: none;
		background: none;
		border: none;
		font: inherit;
	}

	.c-content-editor__quote-textarea {
		width: 100%;
		font-style: italic;
		outline: none;
		border-inline-start: 4px solid var(--color-border-primary);
		padding-inline-start: 1rem;
		background: none;
		border-block: none;
		border-inline-end: none;
		resize: vertical;
		font: inherit;
	}

	.c-content-editor__image-placeholder {
		border: 2px dashed var(--color-border-primary);
		border-radius: var(--border-radius-base, 0.375rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.c-content-editor__image-text {
		color: var(--color-text-secondary);
	}

	.c-content-editor__image-hint {
		font-size: var(--text-size-sm, 0.875rem);
		color: var(--color-text-tertiary);
		margin-block-start: 0.25rem;
	}
</style>
