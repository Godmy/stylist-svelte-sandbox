<script lang="ts">
	import { onMount } from 'svelte';
	import DomainDescriptorPanel from '$stylist/token/component/molecule/domain-descriptor-panel/index.svelte';
	import DomainSidebar from '$stylist/domain/component/organism/domain-sidebar/index.svelte';
	import type { TypeDomainComponentDescriptor } from '$stylist/domain/type/object/domain-component-descriptor';

	type BuilderFile = {
		name: string;
		path: string;
	};

	type BuilderEntity = {
		name: string;
		path: string;
		files: BuilderFile[];
	};

	type BuilderJoint = {
		name: string;
		entities: BuilderEntity[];
	};

	type BuilderCluster = {
		name: string;
		joints: BuilderJoint[];
	};

	type BuilderDomain = {
		name: string;
		clusters: BuilderCluster[];
	};

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
	const COMPONENT_PREVIEW_TIMEOUT_MS = 4000;

	const componentModules = import.meta.glob([
		'../../../../../design-system/theme/component/**/index.svelte',
		'../../../../../design-system/typography/component/**/index.svelte',
		'../../../../../design-system/layout/component/**/index.svelte',
		'../../../../../design-system/localization/component/**/index.svelte',
		'../../../../../design-system/svg/component/**/index.svelte',
		'../../../../../interaction/animation/component/**/index.svelte',
		'../../../../../interaction/button/component/**/index.svelte',
		'../../../../../interaction/control/component/**/index.svelte',
		'../../../../../interaction/input/component/**/index.svelte',
		'../../../../../interaction/form/component/**/index.svelte',
		'../../../../../interaction/calendar/component/**/index.svelte',
		'../../../../../interaction/file/component/**/index.svelte',
		'../../../../../interaction/search/component/**/index.svelte',
		'../../../../../interaction/menu/component/**/index.svelte',
		'../../../../../interaction/navigation/component/**/index.svelte',
		'../../../../../interaction/dialog/component/**/index.svelte',
		'../../../../../information/list/component/**/index.svelte',
		'../../../../../information/tree/component/**/index.svelte',
		'../../../../../information/table/component/**/index.svelte',
		'../../../../../information/chart/component/**/index.svelte',
		'../../../../../information/image/component/**/index.svelte',
		'../../../../../information/audio/component/**/index.svelte',
		'../../../../../information/video/component/**/index.svelte',
		'../../../../../information/notification/component/**/index.svelte',
		'../../../../../architecture/graph/component/**/index.svelte',
		'../../../../../architecture/erd/component/**/index.svelte',
		'../../../../../architecture/idef-zero/component/**/index.svelte',
		'../../../../../architecture/workspace/component/**/index.svelte',
		'../../../../../architecture/canvas/component/**/index.svelte',
		'../../../../../architecture/webgl/component/**/index.svelte',
		'../../../../../sandbox/domain/component/**/index.svelte',
		'../../../../../sandbox/token/component/**/index.svelte',
		'../../../../../sandbox/development/component/**/index.svelte'
	]) as Record<string, () => Promise<SvelteModule>>;

	const availableComponentJoints = ['atom', 'molecule', 'organism'] as const;

	let {
		tree = [],
		descriptors = [],
		class: className = ''
	}: {
		tree?: BuilderDomain[];
		descriptors?: TypeDomainComponentDescriptor[];
		class?: string;
	} = $props();

	const componentDomains = tree.filter((domain: BuilderDomain) =>
		domain.clusters.some((cluster: BuilderCluster) => cluster.name === 'component')
	) as BuilderDomain[];

	let activeDomain = $state(componentDomains[0]?.name ?? 'domain');
	let activeCluster = $state('component');
	let activeJoint = $state<(typeof availableComponentJoints)[number]>('molecule');
	let activeEntityPath = $state('');
	let selectedInstanceId = $state<string | null>(null);
	let selectedSectionId = $state<string | null>(null);
	let selectedColumnIndex = $state(0);
	let sections = $state<BuilderSection[]>([]);
	let instances = $state<BuilderInstance[]>([]);
	let hoverCanvas = $state(false);
	let activeDropTarget = $state<BuilderDropTarget | null>(null);
	let hasLoadedLayout = $state(false);

	const SLUG_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
	let templateDomain = $state(componentDomains[0]?.name ?? '');
	let templateFamily = $state('');
	let exportState = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let exportMessage = $state('');

	const activeDomainNode = $derived(
		componentDomains.find((domain) => domain.name === activeDomain)
	);
	const activeClusterNode = $derived(
		activeDomainNode?.clusters.find((cluster) => cluster.name === activeCluster) ?? null
	);
	const availableDomainNames = $derived(
		componentDomains.map((domain) => domain.name).sort((a, b) => a.localeCompare(b))
	);
	const availableJointNames = $derived(
		activeClusterNode?.joints
			.map((joint) => joint.name)
			.filter((joint): joint is (typeof availableComponentJoints)[number] =>
				availableComponentJoints.includes(joint as (typeof availableComponentJoints)[number])
			) ?? []
	);
	const entities = $derived(
		activeClusterNode?.joints.find((joint) => joint.name === activeJoint)?.entities ?? []
	);
	const activeEntity = $derived(
		entities.find((entity) => entity.path === activeEntityPath) ?? entities[0] ?? null
	);
	const selectedInstance = $derived(
		instances.find((instance) => instance.id === selectedInstanceId) ?? null
	);
	const selectedSection = $derived(
		sections.find((section) => section.id === selectedSectionId) ?? null
	);
	const selectedDescriptor = $derived(
		selectedInstance
			? (descriptors.find((descriptor) => descriptor.entityPath === selectedInstance.entity.path) ??
					null)
			: activeEntity
				? (descriptors.find((descriptor) => descriptor.entityPath === activeEntity.path) ?? null)
				: null
	);
	const entityDirectory = $derived.by(() => {
		const directory = new Map<string, BuilderEntity>();

		for (const domain of componentDomains) {
			for (const cluster of domain.clusters) {
				if (cluster.name !== 'component') {
					continue;
				}

				for (const joint of cluster.joints) {
					for (const entity of joint.entities) {
						directory.set(entity.path, entity);
					}
				}
			}
		}

		return directory;
	});

	$effect(() => {
		if (!activeDomainNode && componentDomains.length > 0) {
			activeDomain = componentDomains[0].name;
		}
	});

	$effect(() => {
		if (!availableJointNames.length) {
			activeEntityPath = '';
			return;
		}
		if (!availableJointNames.includes(activeJoint)) {
			activeJoint = availableJointNames[0];
		}
	});

	$effect(() => {
		if (!entities.length) {
			activeEntityPath = '';
			return;
		}
		if (!activeEntityPath || !entities.some((entity) => entity.path === activeEntityPath)) {
			activeEntityPath = entities[0].path;
		}
	});

	$effect(() => {
		if (selectedInstanceId && !instances.some((instance) => instance.id === selectedInstanceId)) {
			selectedInstanceId = null;
		}
		if (selectedSectionId && !sections.some((section) => section.id === selectedSectionId)) {
			selectedSectionId = sections[0]?.id ?? null;
			selectedColumnIndex = 0;
		}
	});

	$effect(() => {
		if (!hasLoadedLayout) {
			return;
		}

		const snapshot = JSON.stringify({
			version: 1,
			sections,
			instances: instances.map((instance) => ({
				id: instance.id,
				descriptorEntityPath: instance.descriptorEntityPath,
				config: instance.config
			}))
		} satisfies BuilderStoredLayout);

		const timeoutId = window.setTimeout(async () => {
			try {
				await fetch('/api/builder', {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: snapshot
				});
			} catch {
				return;
			}
		}, 250);

		return () => {
			window.clearTimeout(timeoutId);
		};
	});

	onMount(async () => {
		try {
			const response = await fetch('/api/builder');
			if (!response.ok) {
				hasLoadedLayout = true;
				return;
			}

			const payload = (await response.json()) as BuilderStoredLayout;
			const nextInstances: BuilderInstance[] = [];
			const instanceIds = new Set<string>();

			for (const entry of payload.instances) {
				const descriptorEntityPath =
					(entry as BuilderStoredInstance).descriptorEntityPath ??
					(entry as BuilderStoredInstance & { entityPath?: string }).entityPath ??
					null;
				if (!descriptorEntityPath) {
					continue;
				}

				const entity = entityDirectory.get(descriptorEntityPath);
				if (!entity) {
					continue;
				}

				const instance = createInstance(entity);
				instance.id = entry.id;
				instance.descriptorEntityPath = descriptorEntityPath;
				instance.config = entry.config ?? getDefaultInstanceConfig(descriptorEntityPath);
				nextInstances.push(instance);
				instanceIds.add(entry.id);
			}

			instances = nextInstances;
			sections = payload.sections
				.filter((section) => section.columns >= 1 && section.columns <= 3)
				.map((section) => ({
					id: section.id,
					columns: section.columns,
					items: section.items
						.slice(0, section.columns)
						.map((columnItems) => columnItems.filter((instanceId) => instanceIds.has(instanceId)))
				}))
				.filter((section) => section.items.length > 0);

			for (const instance of nextInstances) {
				if (instance.componentPath) {
					void loadComponent(instance.id);
				}
			}
		} catch {
			return;
		} finally {
			hasLoadedLayout = true;
		}
	});

	function createSection(columns: BuilderColumnCount): BuilderSection {
		return {
			id: `section-${crypto.randomUUID()}`,
			columns,
			items: Array.from({ length: columns }, () => [])
		};
	}

	function createInstance(entity: BuilderEntity): BuilderInstance {
		const componentPath = entity.files.find((file) => file.name === 'index.svelte')?.path ?? null;
		const descriptorEntityPath = entity.path;

		return {
			id: `builder-${crypto.randomUUID()}`,
			entity,
			descriptorEntityPath,
			componentPath,
			componentModule: null,
			componentLoading: false,
			componentError: '',
			config: getDefaultInstanceConfig(entity.path)
		};
	}

	function getDefaultInstanceConfig(entityPath: string): Record<string, unknown> {
		const familyName = entityPath.split('/').at(-1) ?? '';

		if (entityPath.startsWith('input/component/atom/input-')) {
			const fieldLabel = familyName
				.replace(/^input-/, '')
				.split('-')
				.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
				.join(' ');

			return {
				label: fieldLabel,
				value: '',
				placeholder: fieldLabel
			};
		}

		return {};
	}

	async function loadComponent(id: string): Promise<void> {
		const instance = instances.find((entry) => entry.id === id);
		if (!instance?.componentPath) return;
		const modulePath = Object.keys(componentModules).find((path) =>
			path.endsWith(`/${instance.componentPath}`)
		);
		const loadModule = modulePath ? componentModules[modulePath] : undefined;

		if (!loadModule) {
			updateInstance(id, { componentError: 'Component module not found for this entity.' });
			return;
		}

		updateInstance(id, { componentLoading: true, componentError: '' });

		try {
			const module = await Promise.race([
				loadModule(),
				new Promise<never>((_, reject) => {
					window.setTimeout(() => {
						reject(
							new Error(
								'Component preview timed out. This component likely needs explicit props or a different runtime context.'
							)
						);
					}, COMPONENT_PREVIEW_TIMEOUT_MS);
				})
			]);
			updateInstance(id, {
				componentModule: module.default ?? null,
				componentLoading: false,
				componentError: module.default ? '' : 'Component module has no default export.'
			});
		} catch (error) {
			updateInstance(id, {
				componentLoading: false,
				componentError: error instanceof Error ? error.message : String(error)
			});
		}
	}

	function updateInstance(id: string, updates: Partial<BuilderInstance>): void {
		instances = instances.map((instance) =>
			instance.id === id ? { ...instance, ...updates } : instance
		);
	}

	function updateSection(
		sectionId: string,
		recipe: (section: BuilderSection) => BuilderSection
	): void {
		sections = sections.map((section) => (section.id === sectionId ? recipe(section) : section));
	}

	function createSectionAndSelect(columns: BuilderColumnCount): void {
		const section = createSection(columns);
		sections = [...sections, section];
		selectedSectionId = section.id;
		selectedColumnIndex = 0;
		selectedInstanceId = null;
	}

	function insertSectionAfter(afterSectionId: string | null, columns: BuilderColumnCount): void {
		const section = createSection(columns);
		if (afterSectionId == null) {
			sections = [section, ...sections];
		} else {
			const index = sections.findIndex((entry) => entry.id === afterSectionId);
			if (index < 0) {
				sections = [...sections, section];
			} else {
				sections = [...sections.slice(0, index + 1), section, ...sections.slice(index + 1)];
			}
		}
		selectedSectionId = section.id;
		selectedColumnIndex = 0;
		selectedInstanceId = null;
	}

	function setSectionColumns(sectionId: string, columns: BuilderColumnCount): void {
		updateSection(sectionId, (section) => {
			const nextItems = Array.from({ length: columns }, (_, index) => section.items[index] ?? []);
			for (let index = columns; index < section.items.length; index += 1) {
				nextItems[columns - 1] = [...nextItems[columns - 1], ...section.items[index]];
			}

			return {
				...section,
				columns,
				items: nextItems
			};
		});

		selectedSectionId = sectionId;
		selectedColumnIndex = Math.min(selectedColumnIndex, columns - 1);
	}

	function removeSection(sectionId: string): void {
		const section = sections.find((entry) => entry.id === sectionId);
		if (!section) return;

		const idsToRemove = new Set(section.items.flat());
		sections = sections.filter((entry) => entry.id !== sectionId);
		instances = instances.filter((instance) => !idsToRemove.has(instance.id));
		if (selectedSectionId === sectionId) {
			selectedSectionId = sections.find((entry) => entry.id !== sectionId)?.id ?? null;
			selectedColumnIndex = 0;
		}
		if (selectedInstanceId && idsToRemove.has(selectedInstanceId)) {
			selectedInstanceId = null;
		}
	}

	function appendEntityToTarget(
		entity: BuilderEntity,
		targetSectionId: string | null = selectedSectionId,
		targetColumnIndex = selectedColumnIndex
	): void {
		if (!targetSectionId) {
			const section = createSection(1);
			const instance = createInstance(entity);
			sections = [...sections, { ...section, items: [[instance.id]] }];
			instances = [...instances, instance];
			selectedSectionId = section.id;
			selectedColumnIndex = 0;
			selectedInstanceId = instance.id;
			if (instance.componentPath) {
				void loadComponent(instance.id);
			}
			return;
		}

		const section = sections.find((entry) => entry.id === targetSectionId);
		if (!section) return;

		const nextColumnIndex = Math.max(0, Math.min(targetColumnIndex, section.columns - 1));
		const instance = createInstance(entity);

		updateSection(targetSectionId, (current) => ({
			...current,
			items: current.items.map((columnItems, index) =>
				index === nextColumnIndex ? [...columnItems, instance.id] : columnItems
			)
		}));

		instances = [...instances, instance];
		selectedSectionId = targetSectionId;
		selectedColumnIndex = nextColumnIndex;
		selectedInstanceId = instance.id;
		if (instance.componentPath) {
			void loadComponent(instance.id);
		}
	}

	function duplicateSelectedInstance(): void {
		if (!selectedInstance || !selectedSectionId) return;
		appendEntityToTarget(selectedInstance.entity, selectedSectionId, selectedColumnIndex);
	}

	function removeSelectedInstance(): void {
		if (!selectedInstanceId) return;

		sections = sections.map((section) => ({
			...section,
			items: section.items.map((columnItems) =>
				columnItems.filter((instanceId) => instanceId !== selectedInstanceId)
			)
		}));
		instances = instances.filter((instance) => instance.id !== selectedInstanceId);
		selectedInstanceId = null;
	}

	function moveSelectedInstance(direction: -1 | 1): void {
		const currentInstanceId = selectedInstanceId;
		if (!selectedSectionId || !currentInstanceId) return;

		updateSection(selectedSectionId, (section) => ({
			...section,
			items: section.items.map((columnItems) => {
				const index = columnItems.indexOf(currentInstanceId);
				if (index < 0) return columnItems;
				const nextIndex = index + direction;
				if (nextIndex < 0 || nextIndex >= columnItems.length) return columnItems;
				const nextItems = [...columnItems];
				[nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
				return nextItems;
			})
		}));
	}

	function moveSection(sectionId: string, direction: -1 | 1): void {
		const index = sections.findIndex((section) => section.id === sectionId);
		if (index < 0) return;
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= sections.length) return;

		const nextSections = [...sections];
		[nextSections[index], nextSections[nextIndex]] = [nextSections[nextIndex], nextSections[index]];
		sections = nextSections;
	}

	async function exportTemplate(): Promise<void> {
		if (!SLUG_PATTERN.test(templateDomain) || !SLUG_PATTERN.test(templateFamily)) {
			exportState = 'error';
			exportMessage = 'Domain and family must be lowercase kebab-case, e.g. "hero-banner".';
			return;
		}

		if (instances.length === 0) {
			exportState = 'error';
			exportMessage = 'Add at least one component to the canvas first.';
			return;
		}

		const targetPath = `${templateDomain}/component/template/${templateFamily}/index.svelte`;
		const alreadyExists = entityDirectory.has(targetPath.replace('/index.svelte', ''));
		if (
			alreadyExists &&
			!window.confirm(`${targetPath} already exists. Overwrite it with the current canvas?`)
		) {
			return;
		}

		exportState = 'saving';
		exportMessage = '';

		try {
			const response = await fetch('/api/template-export', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					domain: templateDomain,
					family: templateFamily,
					sections,
					instances: instances.map((instance) => ({
						id: instance.id,
						componentPath: instance.componentPath,
						config: instance.config
					}))
				})
			});
			const payload = await response.json();
			if (!response.ok) throw new Error(payload.error ?? 'Export failed');

			exportState = 'saved';
			exportMessage = `Saved to ${payload.path}. Run indexation to refresh barrel exports.`;
		} catch (error) {
			exportState = 'error';
			exportMessage = error instanceof Error ? error.message : String(error);
		}
	}

	function handleEntityDragStart(
		entity: { name: string; path: string; files: { path: string }[] },
		event: DragEvent
	): void {
		const fullEntity = entities.find((entry) => entry.path === entity.path);
		if (!fullEntity) return;
		activeEntityPath = fullEntity.path;
		event.dataTransfer?.setData('application/stylist-builder-entity', JSON.stringify(fullEntity));
		event.dataTransfer?.setData('text/plain', fullEntity.path);
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'copy';
		}
	}

	function handleCanvasDrop(event: DragEvent): void {
		event.preventDefault();
		hoverCanvas = false;
		const payload = event.dataTransfer?.getData('application/stylist-builder-entity');
		if (!payload) return;
		const entity = JSON.parse(payload) as BuilderEntity;
		const target = activeDropTarget;
		appendEntityToTarget(entity, target?.sectionId ?? null, target?.columnIndex ?? 0);
		activeDropTarget = null;
	}

	function handleCanvasDragOver(event: DragEvent): void {
		event.preventDefault();
		hoverCanvas = true;
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'copy';
		}
	}

	function handleCanvasDragLeave(): void {
		hoverCanvas = false;
		activeDropTarget = null;
	}

	function handleDomainSelect(name: string): void {
		activeDomain = name;
		activeEntityPath = '';
	}

	function handleJointSelect(name: string): void {
		activeJoint = name as (typeof availableComponentJoints)[number];
		activeEntityPath = '';
	}

	function handleEntityAdd(path: string): void {
		const entity = entities.find((entry) => entry.path === path);
		if (!entity) return;
		activeEntityPath = entity.path;
		appendEntityToTarget(entity);
	}

	function selectSection(sectionId: string, columnIndex = 0): void {
		selectedSectionId = sectionId;
		selectedColumnIndex = columnIndex;
		selectedInstanceId = null;
	}

	function selectInstance(sectionId: string, columnIndex: number, instanceId: string): void {
		selectedSectionId = sectionId;
		selectedColumnIndex = columnIndex;
		selectedInstanceId = instanceId;
	}

	function getInstance(instanceId: string): BuilderInstance | null {
		return instances.find((instance) => instance.id === instanceId) ?? null;
	}

	function handleKeyboardShortcut(event: KeyboardEvent): void {
		const target = event.target;
		const isTextInput =
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement ||
			(target instanceof HTMLElement && target.isContentEditable);

		if (isTextInput) return;

		if (event.key === 'Enter' && activeEntity) {
			event.preventDefault();
			appendEntityToTarget(activeEntity);
			return;
		}

		if ((event.key === 'Backspace' || event.key === 'Delete') && selectedInstance) {
			event.preventDefault();
			removeSelectedInstance();
			return;
		}

		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd' && selectedInstance) {
			event.preventDefault();
			duplicateSelectedInstance();
			return;
		}

		if (event.altKey && event.key === 'ArrowUp' && selectedInstance) {
			event.preventDefault();
			moveSelectedInstance(-1);
		}

		if (event.altKey && event.key === 'ArrowDown' && selectedInstance) {
			event.preventDefault();
			moveSelectedInstance(1);
		}
	}
</script>

<svelte:window onkeydown={handleKeyboardShortcut} />

<div class="c-domain-builder {className}">
	<aside class="builder-sidebar">
		<DomainSidebar
			{activeDomain}
			{activeCluster}
			{activeJoint}
			availableDomains={availableDomainNames}
			availableJoints={availableJointNames}
			{entities}
			{activeEntityPath}
			draggableEntities={true}
			onDomainSelect={handleDomainSelect}
			onClusterSelect={() => undefined}
			onJointSelect={handleJointSelect}
			onEntitySelect={(path) => {
				activeEntityPath = path;
			}}
			onEntityAdd={handleEntityAdd}
			onEntityDragStart={handleEntityDragStart}
		/>
	</aside>

	<section
		class:hovered={hoverCanvas}
		class="builder-canvas"
		aria-label="Constructor canvas"
		ondragover={handleCanvasDragOver}
		ondragleave={handleCanvasDragLeave}
		ondrop={handleCanvasDrop}
		onpointerdown={() => {
			selectedInstanceId = null;
		}}
	>
		<div class="builder-stage">
			<div class="export-bar" onpointerdown={(event) => event.stopPropagation()}>
				<select class="export-input" bind:value={templateDomain} aria-label="Template domain">
					{#each componentDomains as domain (domain.name)}
						<option value={domain.name}>{domain.name}</option>
					{/each}
				</select>
				<input
					class="export-input"
					type="text"
					placeholder="template-family-name"
					bind:value={templateFamily}
				/>
				<button
					type="button"
					class="section-create"
					disabled={exportState === 'saving'}
					onclick={() => void exportTemplate()}
				>
					{exportState === 'saving' ? 'Exporting...' : 'Export as template'}
				</button>
				{#if exportMessage}
					<span class:export-message--error={exportState === 'error'} class="export-message">
						{exportMessage}
					</span>
				{/if}
			</div>

			{#if sections.length === 0}
				<div class="empty-canvas">
					<h2>Start with a section</h2>
					<p>
						Build the page top-to-bottom. Pick a section layout, then add components into columns.
					</p>
					<div class="empty-actions">
						<button type="button" class="section-create" onclick={() => createSectionAndSelect(1)}>
							1 column
						</button>
						<button type="button" class="section-create" onclick={() => createSectionAndSelect(2)}>
							2 columns
						</button>
						<button type="button" class="section-create" onclick={() => createSectionAndSelect(3)}>
							3 columns
						</button>
					</div>
				</div>
			{/if}

			{#each sections as section, sectionIndex (section.id)}
				<div class="section-insert-rail">
					<button
						type="button"
						class="section-insert"
						onclick={() =>
							insertSectionAfter(sectionIndex === 0 ? null : sections[sectionIndex - 1].id, 1)}
					>
						+ 1
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() =>
							insertSectionAfter(sectionIndex === 0 ? null : sections[sectionIndex - 1].id, 2)}
					>
						+ 2
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() =>
							insertSectionAfter(sectionIndex === 0 ? null : sections[sectionIndex - 1].id, 3)}
					>
						+ 3
					</button>
				</div>

				<div
					class:selected={selectedSectionId === section.id}
					class={`page-section columns-${section.columns}`}
					role="button"
					tabindex="0"
					aria-label={`Section ${sectionIndex + 1}`}
					onclick={() => selectSection(section.id)}
					onkeydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							event.preventDefault();
							selectSection(section.id);
						}
					}}
				>
					<div class="section-toolbar" onpointerdown={(event) => event.stopPropagation()}>
						<button
							type="button"
							class="section-action"
							disabled={sectionIndex === 0}
							onclick={() => moveSection(section.id, -1)}
						>
							Section up
						</button>
						<button
							type="button"
							class="section-action"
							disabled={sectionIndex === sections.length - 1}
							onclick={() => moveSection(section.id, 1)}
						>
							Section down
						</button>
						<button
							type="button"
							class="section-action"
							onclick={() => setSectionColumns(section.id, 1)}
						>
							1 col
						</button>
						<button
							type="button"
							class="section-action"
							onclick={() => setSectionColumns(section.id, 2)}
						>
							2 col
						</button>
						<button
							type="button"
							class="section-action"
							onclick={() => setSectionColumns(section.id, 3)}
						>
							3 col
						</button>
						<button
							type="button"
							class="section-action danger"
							onclick={() => removeSection(section.id)}
						>
							Remove section
						</button>
					</div>

					<div class="section-grid">
						{#each section.items as columnItems, columnIndex}
							<div
								class:selected={selectedSectionId === section.id &&
									selectedColumnIndex === columnIndex}
								class:drop-target={activeDropTarget?.sectionId === section.id &&
									activeDropTarget?.columnIndex === columnIndex}
								class="section-column"
								role="button"
								tabindex="0"
								aria-label={`Section ${sectionIndex + 1}, column ${columnIndex + 1}`}
								onclick={(event) => {
									event.stopPropagation();
									selectSection(section.id, columnIndex);
								}}
								onkeydown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										selectSection(section.id, columnIndex);
									}
								}}
								ondragenter={() => {
									activeDropTarget = { sectionId: section.id, columnIndex };
								}}
								ondragover={(event) => {
									event.preventDefault();
									activeDropTarget = { sectionId: section.id, columnIndex };
								}}
							>
								{#if columnItems.length === 0}
									<button
										type="button"
										class="column-placeholder"
										onclick={(event) => {
											event.stopPropagation();
											selectSection(section.id, columnIndex);
											if (activeEntity) {
												appendEntityToTarget(activeEntity, section.id, columnIndex);
											}
										}}
									>
										Drop here or add selected component
									</button>
								{/if}

								{#each columnItems as instanceId (instanceId)}
									{@const instance = getInstance(instanceId)}
									{#if instance}
										<div
											class:selected={selectedInstanceId === instance.id}
											class="component-block"
											role="button"
											tabindex="0"
											aria-label={`Select ${instance.entity.name}`}
											onclick={(event) => {
												event.stopPropagation();
												selectInstance(section.id, columnIndex, instance.id);
											}}
											onkeydown={(event) => {
												if (event.key === 'Enter' || event.key === ' ') {
													event.preventDefault();
													selectInstance(section.id, columnIndex, instance.id);
												}
											}}
										>
											{#if selectedInstanceId === instance.id}
												<div
													class="component-toolbar"
													onpointerdown={(event) => event.stopPropagation()}
												>
													<button
														type="button"
														class="component-action"
														onclick={() => moveSelectedInstance(-1)}
													>
														Up
													</button>
													<button
														type="button"
														class="component-action"
														onclick={() => moveSelectedInstance(1)}
													>
														Down
													</button>
													<button
														type="button"
														class="component-action"
														onclick={duplicateSelectedInstance}
													>
														Duplicate
													</button>
													<button
														type="button"
														class="component-action danger"
														onclick={removeSelectedInstance}
													>
														Remove
													</button>
												</div>
											{/if}

											<div class="component-surface">
												{#if instance.componentLoading}
													<div class="component-placeholder">Loading component...</div>
												{:else if instance.componentModule}
													{@const PreviewComponent = instance.componentModule as any}
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

			{#if sections.length > 0}
				<div class="section-insert-rail section-insert-rail--tail">
					<button
						type="button"
						class="section-insert"
						onclick={() => insertSectionAfter(sections.at(-1)?.id ?? null, 1)}
					>
						+ 1
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() => insertSectionAfter(sections.at(-1)?.id ?? null, 2)}
					>
						+ 2
					</button>
					<button
						type="button"
						class="section-insert"
						onclick={() => insertSectionAfter(sections.at(-1)?.id ?? null, 3)}
					>
						+ 3
					</button>
				</div>
			{/if}

			{#if selectedDescriptor}
				<DomainDescriptorPanel descriptor={selectedDescriptor} />
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
