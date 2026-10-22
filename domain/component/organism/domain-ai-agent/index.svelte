<script lang="ts">
	import Transcriber from '$stylist/audio/component/organism/transcriber/index.svelte';
	import Button from '$stylist/button/component/atom/button/index.svelte';
	import type { RecipeDomainAiAgent } from '$stylist/domain/interface/recipe/domain-ai-agent';
	import { createDomainAiAgentState } from '$stylist/domain/component/organism/domain-ai-agent/state.svelte';

	let props: RecipeDomainAiAgent = $props();
	const state = createDomainAiAgentState(() => props);
</script>

{#if props.open}
	<aside class="c-domain-ai-agent {props.class ?? ''}" aria-label="AI agent">
		<header class="panel-head">
			<div>
				<p class="eyebrow">AI</p>
				<h2>AI agent</h2>
			</div>
			<button
				type="button"
				class="close-button"
				onclick={props.onClose}
				aria-label="Close AI agent panel"
			>
				Close
			</button>
		</header>

		<div class="panel-body">
			<div class="c-domain-ai-agent__transcriber-wrap">
				<Transcriber
					class="c-domain-ai-agent__transcriber"
					recordLabel="Record"
					stopLabel="Stop"
					copyLabel="Copy"
					onTranscribed={state.handleTranscribed}
				/>
			</div>

			<div class="c-domain-ai-agent__context">
				<Button
					variant="outline"
					size="sm"
					disabled={!state.canAttachComponent || state.isAttachingComponent}
					onclick={() => void state.attachComponent()}
				>
					{state.isAttachingComponent
						? 'Attaching…'
						: `Attach component${state.entityLabel ? `: ${state.entityLabel}` : ''}`}
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={!state.canAttachComponent || state.isAttachingDependencies}
					onclick={() => void state.attachDependencies()}
				>
					{state.isAttachingDependencies ? 'Loading…' : '+ Dependencies'}
				</Button>
			</div>

			{#if state.attachments.length}
				<div class="c-domain-ai-agent__attachments">
					{#each state.attachments as attachment (attachment.id)}
						<details class="attachment">
							<summary>
								<span class="attachment__label">{attachment.label}</span>
								<button
									type="button"
									class="attachment__remove"
									aria-label={`Remove ${attachment.label}`}
									onclick={(event) => {
										event.preventDefault();
										event.stopPropagation();
										state.removeAttachment(attachment.id);
									}}
								>
									×
								</button>
							</summary>
							<pre class="attachment__content">{attachment.content}</pre>
						</details>
					{/each}
				</div>
			{/if}

			<div class="c-domain-ai-agent__draft">
				<label class="draft-label" for="domain-ai-agent-draft">
					Transcript (review and fix before sending)
				</label>
				<textarea
					id="domain-ai-agent-draft"
					class="draft-textarea"
					rows="3"
					placeholder="Transcribed text will appear here — edit it, then send"
					value={state.draftText}
					oninput={(event) =>
						state.setDraftText((event.currentTarget as HTMLTextAreaElement).value)}
					disabled={state.isSending}></textarea>
				<div class="draft-actions">
					<Button
						variant="ghost"
						size="sm"
						disabled={!state.draftText || state.isSending}
						onclick={() => state.clearDraft()}
					>
						Clear
					</Button>
					<Button
						variant="primary"
						size="sm"
						disabled={!state.draftText.trim() || state.isSending}
						onclick={() => void state.sendDraft()}
					>
						Send
					</Button>
				</div>
			</div>

			<div class="c-domain-ai-agent__log" aria-live="polite">
				{#each state.messages as message, index (index)}
					<p class="message message--{message.role}">
						<span class="message__role">{message.role === 'user' ? 'You' : 'AI'}</span>
						{message.text}
					</p>
				{/each}
				{#if state.isSending}
					<p class="message message--pending">AI is thinking…</p>
				{/if}
				{#if state.errorMessage}
					<p class="message message--error">{state.errorMessage}</p>
				{/if}
				{#if !state.messages.length && !state.isSending && !state.errorMessage}
					<p class="empty-state">Record a voice message to start a conversation with the AI.</p>
				{/if}
			</div>
		</div>
	</aside>
{/if}

<style>
	.c-domain-ai-agent {
		position: fixed;
		top: 5.25rem;
		right: 0.7rem;
		z-index: 30;
		width: min(calc(30rem + 4px), calc(100vw - 2rem));
		max-height: calc(100vh - 6.25rem);
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 82%, transparent);
		border-radius: 24px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-background-primary) 96%, white 4%),
			color-mix(in srgb, var(--color-background-primary) 90%, var(--color-background-secondary) 10%)
		);
		box-shadow: 0 28px 80px rgba(15, 23, 42, 0.16);
		overflow: hidden;
	}

	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1rem 0.85rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-border-primary) 78%, transparent);
	}

	.eyebrow {
		margin: 0 0 0.25rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	h2 {
		margin: 0;
		font-size: 1.05rem;
	}

	.close-button {
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 80%, transparent);
		border-radius: 999px;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
		padding: 0.65rem 0.9rem;
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
	}

	.panel-body {
		min-height: 0;
		padding: 1rem;
		overflow-y: auto;
		overflow-x: hidden;
		display: grid;
		gap: 0.85rem;
		align-content: start;
	}

	.c-domain-ai-agent__transcriber-wrap :global(.c-transcriber__result) {
		display: none;
	}

	.c-domain-ai-agent__context {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.c-domain-ai-agent__attachments {
		display: grid;
		gap: 0.45rem;
	}

	.attachment {
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		background: var(--color-background-secondary);
		overflow: hidden;
	}

	.attachment summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.5rem 0.65rem;
		font-size: 12px;
		font-family: var(--font-mono, monospace);
		color: var(--color-text-primary);
		cursor: pointer;
		list-style: none;
	}

	.attachment summary::-webkit-details-marker {
		display: none;
	}

	.attachment__label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.attachment__remove {
		flex-shrink: 0;
		border: none;
		background: transparent;
		color: var(--color-text-secondary);
		font-size: 16px;
		line-height: 1;
		cursor: pointer;
		padding: 0 0.2rem;
	}

	.attachment__remove:hover {
		color: var(--color-danger-600);
	}

	.attachment__content {
		margin: 0;
		max-height: 14rem;
		overflow: auto;
		padding: 0.65rem;
		border-top: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
		font-size: 11.5px;
		line-height: 1.45;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.c-domain-ai-agent__draft {
		display: grid;
		gap: 0.4rem;
	}

	.draft-label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.draft-textarea {
		width: 100%;
		min-width: 0;
		resize: vertical;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
		font: inherit;
		font-size: 13px;
		line-height: 1.45;
	}

	.draft-textarea:disabled {
		opacity: var(--opacity-50, 0.5);
	}

	.draft-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.c-domain-ai-agent__log {
		display: grid;
		gap: 0.55rem;
	}

	.message {
		margin: 0;
		padding: 0.6rem 0.75rem;
		border-radius: 0.65rem;
		font-size: 13px;
		line-height: 1.45;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.message__role {
		display: block;
		margin-bottom: 0.2rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	.message--user {
		background: var(--color-background-secondary);
		color: var(--color-text-primary);
		justify-self: end;
		max-width: 90%;
	}

	.message--assistant {
		background: color-mix(in srgb, var(--color-primary-500) 12%, var(--color-background-primary));
		color: var(--color-text-primary);
		max-width: 90%;
	}

	.message--pending {
		color: var(--color-text-secondary);
		font-style: italic;
	}

	.message--error {
		color: var(--color-danger-600);
	}

	.empty-state {
		margin: 0;
		color: var(--color-text-secondary);
		font-size: 13px;
	}

	@media (max-width: 840px) {
		.c-domain-ai-agent {
			top: 6.5rem;
			right: 0.75rem;
			left: 0.75rem;
			width: auto;
		}
	}
</style>
