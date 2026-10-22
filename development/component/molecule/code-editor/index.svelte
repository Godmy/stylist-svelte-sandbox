<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { PresetCodeEditor } from '$stylist/development/const/preset/code-editor';
	import Icon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeCodeEditor } from '$stylist/development/interface/recipe/code-editor';
	import { createCodeEditorState } from '$stylist/development/component/molecule/code-editor/state.svelte';

	let {
		code = '',
		language = 'javascript',
		height = 300,
		width,
		readOnly = false,
		showLineNumbers = true,
		FONT_SIZE = 14,
		showCopyButton = true,
		class: className = '',
		onCodeChange,
		...restProps
	}: RecipeCodeEditor & HTMLAttributes<HTMLDivElement> = $props();

	const state = createCodeEditorState(() => ({
		code,
		language,
		height,
		width,
		readOnly,
		showLineNumbers,
		FONT_SIZE,
		showCopyButton,
		class: className as any,
		onCodeChange,
		...restProps
	}));
</script>

<div class={state.containerClass}>
	<div class="ce-toolbar">
		<span class="ce-lang-label">{language}</span>
		<div class="ce-toolbar-btns">
			{#if showCopyButton}<button type="button" onclick={state.handleCopy}
					><Icon
						name={PresetCodeEditor.Copy}
						style="width:0.75rem;height:0.75rem;margin-right:0.25rem;display:inline"
					/>Copy</button
				>{/if}
			<button type="button" onclick={state.handleDownload}
				><Icon
					name={PresetCodeEditor.Download}
					style="width:0.75rem;height:0.75rem;margin-right:0.25rem;display:inline"
				/>Download</button
			>
			<button type="button" onclick={() => state.handleCodeChange(code)} disabled={readOnly}
				><Icon
					name={PresetCodeEditor.RefreshCw}
					style="width:0.75rem;height:0.75rem;margin-right:0.25rem;display:inline"
				/>Reset</button
			>
		</div>
	</div>
	<textarea
		class="ce-textarea"
		style={`height:${height}px;${width == null ? 'width:100%;' : `width:${width}px;`}font-size:${FONT_SIZE}px;${showLineNumbers ? 'padding-left: var(--spacing-10);' : ''}`}
		bind:value={state.internalCode}
		oninput={(e) => state.handleCodeChange((e.target as HTMLTextAreaElement).value)}
		readonly={readOnly}></textarea>
</div>

<style>
	.c-code-editor {
		overflow: hidden;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
	}

	.ce-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-border-primary);
		padding: 0.5rem;
	}
	.ce-lang-label {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
	}
	.ce-toolbar-btns {
		display: flex;
		gap: 0.5rem;
	}
	.ce-textarea {
		width: 100%;
		resize: none;
		padding: 0.75rem;
		font-family: monospace;
		outline: none;
	}
</style>
