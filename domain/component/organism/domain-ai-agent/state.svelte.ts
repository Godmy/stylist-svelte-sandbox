import type { RecipeDomainAiAgent } from '$stylist/domain/interface/recipe/domain-ai-agent';
import type { SlotTranscriptionResult } from '$stylist/audio/interface/slot/transcription-result';

const OWN_FILE_NAMES = ['index.svelte', 'index.story.svelte', 'index.ts'];
const DEPENDENCY_ATTACH_LIMIT = 20;

export function createDomainAiAgentState(getProps: () => RecipeDomainAiAgent) {
	const props = $derived(getProps());
	let messages = $state<
		{
			role: 'user' | 'assistant';
			text: string;
			createdAt: Date;
		}[]
	>([]);
	let draftText = $state('');
	let isSending = $state(false);
	let errorMessage = $state('');
	let attachments = $state<{ id: string; label: string; content: string }[]>([]);
	let isAttachingComponent = $state(false);
	let isAttachingDependencies = $state(false);

	const endpoint = $derived(props.endpoint ?? '/api/chat');
	const entityLabel = $derived(
		props.selectedEntity
			? [
					props.selectedEntity.domain,
					props.selectedEntity.cluster,
					props.selectedEntity.joint,
					props.selectedEntity.family
				]
					.filter(Boolean)
					.join('\\')
			: ''
	);

	function handleTranscribed(result: SlotTranscriptionResult) {
		const text = result.text.trim();
		if (!text) return;
		draftText = draftText.trim() ? `${draftText}\n${text}` : text;
	}

	function setDraftText(text: string) {
		draftText = text;
	}

	function clearDraft() {
		draftText = '';
	}

	function upsertAttachment(attachment: { id: string; label: string; content: string }) {
		const index = attachments.findIndex((item) => item.id === attachment.id);
		attachments =
			index === -1
				? [...attachments, attachment]
				: attachments.map((item, i) => (i === index ? attachment : item));
	}

	function removeAttachment(id: string) {
		attachments = attachments.filter((item) => item.id !== id);
	}

	async function fetchFileContent(path: string): Promise<string> {
		try {
			const response = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
			const payload = await response.json();
			if (!response.ok) return `<failed to load: ${payload.error ?? response.status}>`;
			return String(payload.content ?? '');
		} catch (error) {
			return `<failed to load: ${error instanceof Error ? error.message : String(error)}>`;
		}
	}

	async function attachComponent() {
		const entity = props.selectedEntity;
		if (!entity || isAttachingComponent) return;

		isAttachingComponent = true;
		try {
			const ownFiles = entity.files.filter((file) => OWN_FILE_NAMES.includes(file.name));
			const sections = await Promise.all(
				ownFiles.map(async (file) => {
					const content = await fetchFileContent(file.path);
					return `### ${file.name}\n\`\`\`\n${content}\n\`\`\``;
				})
			);

			upsertAttachment({
				id: 'component',
				label: `Component: ${entityLabel}`,
				content: `Component path: ${entityLabel}\n\n${sections.join('\n\n')}`
			});
		} finally {
			isAttachingComponent = false;
		}
	}

	async function attachDependencies() {
		const entity = props.selectedEntity;
		if (!entity?.entityPath || isAttachingDependencies) return;

		isAttachingDependencies = true;
		errorMessage = '';
		try {
			const listResponse = await fetch(
				`/api/di?component=${encodeURIComponent(entity.entityPath)}`
			);
			const listPayload = await listResponse.json();
			if (!listResponse.ok) {
				throw new Error(listPayload.error ?? 'DI request failed');
			}

			const dependencyKeys: string[] = Array.isArray(listPayload.dependencies)
				? listPayload.dependencies.map((dependency: { key: string }) => dependency.key)
				: [];
			const capped = dependencyKeys.slice(0, DEPENDENCY_ATTACH_LIMIT);

			const sections = await Promise.all(
				capped.map(async (key) => {
					const response = await fetch(
						`/api/di?component=${encodeURIComponent(entity.entityPath)}&dependency=${encodeURIComponent(key)}`
					);
					const payload = await response.json();
					const files: { name: string; content: string }[] =
						response.ok && Array.isArray(payload.selectedDependencyFiles)
							? payload.selectedDependencyFiles
							: [];
					const body = files
						.map((file) => `#### ${file.name}\n\`\`\`\n${file.content}\n\`\`\``)
						.join('\n\n');
					return `### ${key}\n\n${body || '_no source found_'}`;
				})
			);

			const truncatedNote =
				dependencyKeys.length > capped.length
					? `\n\n…and ${dependencyKeys.length - capped.length} more dependencies not included (limit ${DEPENDENCY_ATTACH_LIMIT}).`
					: '';

			upsertAttachment({
				id: 'dependencies',
				label: `Dependencies: ${entityLabel} (${capped.length}${dependencyKeys.length > capped.length ? `/${dependencyKeys.length}` : ''})`,
				content: `Dependency tree for ${entityLabel}:\n\n${sections.join('\n\n') || '_no dependencies found_'}${truncatedNote}`
			});
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : String(error);
		} finally {
			isAttachingDependencies = false;
		}
	}

	async function sendDraft() {
		const trimmed = draftText.trim();
		if (!trimmed || isSending) return;

		errorMessage = '';
		messages = [...messages, { role: 'user', text: trimmed, createdAt: new Date() }];
		isSending = true;

		const context = attachments.length
			? attachments
					.map((attachment) => `## ${attachment.label}\n\n${attachment.content}`)
					.join('\n\n---\n\n')
			: undefined;

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: trimmed, systemMessage: props.systemMessage, context })
			});
			const payload = await response.json();
			if (!response.ok) {
				throw new Error(payload.error ?? 'AI request failed');
			}
			messages = [
				...messages,
				{ role: 'assistant', text: String(payload.reply ?? ''), createdAt: new Date() }
			];
			draftText = '';
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : String(error);
		} finally {
			isSending = false;
		}
	}

	return {
		get messages() {
			return messages;
		},
		get draftText() {
			return draftText;
		},
		get isSending() {
			return isSending;
		},
		get errorMessage() {
			return errorMessage;
		},
		get attachments() {
			return attachments;
		},
		get isAttachingComponent() {
			return isAttachingComponent;
		},
		get isAttachingDependencies() {
			return isAttachingDependencies;
		},
		get canAttachComponent() {
			return Boolean(props.selectedEntity);
		},
		get entityLabel() {
			return entityLabel;
		},
		setDraftText,
		clearDraft,
		handleTranscribed,
		removeAttachment,
		attachComponent,
		attachDependencies,
		sendDraft
	};
}
