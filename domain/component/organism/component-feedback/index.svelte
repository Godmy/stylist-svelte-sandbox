<script lang="ts">
	import type { RecipeComponentFeedback } from '$stylist/domain/interface/recipe/component-feedback';
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	let props: RecipeComponentFeedback = $props();
</script>

{#if import.meta.env.DEV && props.mode === 'card'}
	<button
		type="button"
		class="pcc-debug-select"
		class:pcc-debug-select--selected={props.feedback.isSelected(props.storyId ?? '')}
		aria-label={`Выбрать для доработки: ${props.componentName ?? ''}`}
		aria-pressed={props.feedback.isSelected(props.storyId ?? '')}
		title="Выбрать для доработки"
		onclick={() => props.feedback?.toggle(props.storyId ?? '')}
	>
		<BaseIcon name={props.feedback.isSelected(props.storyId ?? '') ? 'check' : 'plus'} size={16} />
	</button>
{:else if import.meta.env.DEV && (props.feedback.count > 0 || props.feedback.error)}
	<aside class="pcc-debug-panel" aria-label="Компоненты для доработки">
		<button
			type="button"
			class="pcc-debug-handle"
			aria-expanded={props.feedback.expanded}
			aria-controls="component-feedback-content"
			onclick={props.feedback.togglePanel}
		>
			<span>Для доработки · {props.feedback.count}</span>
			<BaseIcon name={props.feedback.expanded ? 'chevron-down' : 'chevron-up'} size={18} />
		</button>
		<div
			id="component-feedback-content"
			class="pcc-debug-content"
			class:pcc-debug-content--collapsed={!props.feedback.expanded}
			inert={!props.feedback.expanded}
		>
			<div class="pcc-debug-fields">
				<label
					>Что исправить
					<select
						aria-label="Что исправить"
						value={props.feedback.kind}
						onchange={(event) => props.feedback?.setKind(event.currentTarget.value)}
					>
						<option value="components">Компоненты</option>
						<option value="icons">Иконки</option>
						<option value="other">Другое</option>
					</select>
				</label>
				<label
					>Комментарий
					<textarea
						rows="2"
						maxlength="8000"
						value={props.feedback.note}
						oninput={(event) => props.feedback?.setNote(event.currentTarget.value)}
						placeholder="Что нужно исправить в выбранных компонентах"></textarea>
				</label>
			</div>
			<label class="pcc-debug-paths"
				>Выбранные компоненты
				<textarea
					readonly
					rows="5"
					value={props.feedback.paths}
					aria-label="Пути выбранных компонентов"></textarea>
			</label>
			<div class="pcc-debug-actions">
				<button type="button" onclick={props.feedback.copy}>Скопировать список</button>
				<button type="button" onclick={props.feedback.clear}>Снять выбор</button>
				<p role="status">{props.feedback.error || props.feedback.status}</p>
			</div>
		</div>
	</aside>
{/if}

<style>
	.pcc-debug-select {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		border: 1px solid var(--pcc-line);
		border-radius: 0.4rem;
		background: var(--pcc-surface);
		color: var(--pcc-secondary);
	}
	.pcc-debug-select--selected {
		border-color: var(--pcc-brand);
		background: var(--pcc-brand);
		color: white;
	}
	.pcc-debug-panel {
		position: fixed;
		inset: auto 0 0;
		z-index: 2000;
		border-top: 1px solid var(--pcc-line);
		background: var(--pcc-surface);
		box-shadow: 0 -0.5rem 2rem #0002;
		font-size: 0.8rem;
	}
	.pcc-debug-handle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0.85rem 1rem;
		border: 0;
		background: transparent;
		color: var(--pcc-text);
		font-weight: 600;
	}
	.pcc-debug-content {
		max-height: 55dvh;
		overflow: auto;
		padding: 0 1rem 1rem;
		transition:
			max-height 0.2s,
			padding 0.2s;
	}
	.pcc-debug-content--collapsed {
		max-height: 0;
		padding-bottom: 0;
	}
	.pcc-debug-fields {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.pcc-debug-panel label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
	}
	.pcc-debug-fields label:last-child {
		flex: 1 1 16rem;
	}
	.pcc-debug-paths {
		margin-top: 0.75rem;
	}
	.pcc-debug-panel select,
	.pcc-debug-panel textarea {
		box-sizing: border-box;
		padding: 0.5rem;
		border: 1px solid var(--pcc-line);
		border-radius: 0.35rem;
		background: var(--pcc-muted);
		color: var(--pcc-text);
		font: inherit;
	}
	.pcc-debug-paths textarea {
		font-family: monospace;
		white-space: pre;
	}
	.pcc-debug-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin-top: 0.6rem;
	}
	.pcc-debug-actions button {
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--pcc-line);
		border-radius: 0.35rem;
		background: var(--pcc-muted);
		color: var(--pcc-text);
	}
	.pcc-debug-actions p {
		margin: 0;
		color: var(--pcc-secondary);
	}

	button {
		font: inherit;
		box-sizing: border-box;
		cursor: pointer;
	}
	button:focus-visible,
	select:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--pcc-brand);
		outline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		.pcc-debug-content {
			transition: none;
		}
	}
</style>
