import { onMount, untrack } from 'svelte';

import type { RecipeDomainBuilder } from '$stylist/token/interface/recipe/domain-builder';
/** Reactive behavior of domain-builder; props are read lazily when needed. */
export function createDomainBuilderComponentState(
	getProps: () => Pick<RecipeDomainBuilder, 'tree' | 'descriptors'> & {
		tree: Exclude<RecipeDomainBuilder['tree'], undefined>;
		descriptors: Exclude<RecipeDomainBuilder['descriptors'], undefined>;
	}
) {
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

	const props = $derived(getProps());
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
	const componentDomains = $derived(
		props['tree'].filter((domain: BuilderDomain) =>
			domain.clusters.some((cluster: BuilderCluster) => cluster.name === 'component')
		) as BuilderDomain[]
	);
	let activeDomain = $state(untrack(() => componentDomains[0]?.name ?? 'domain'));
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
	let templateDomain = $state(untrack(() => componentDomains[0]?.name ?? ''));
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
			? (props['descriptors'].find(
					(descriptor) => descriptor.entityPath === selectedInstance.entity.path
				) ?? null)
			: activeEntity
				? (props['descriptors'].find((descriptor) => descriptor.entityPath === activeEntity.path) ??
					null)
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
	return {
		get componentDomains(): typeof componentDomains {
			return componentDomains;
		},
		get activeDomain(): typeof activeDomain {
			return activeDomain;
		},
		set activeDomain(__nextValue: typeof activeDomain) {
			activeDomain = __nextValue;
		},
		get activeCluster(): typeof activeCluster {
			return activeCluster;
		},
		set activeCluster(__nextValue: typeof activeCluster) {
			activeCluster = __nextValue;
		},
		get activeJoint(): typeof activeJoint {
			return activeJoint;
		},
		set activeJoint(__nextValue: typeof activeJoint) {
			activeJoint = __nextValue;
		},
		get activeEntityPath(): typeof activeEntityPath {
			return activeEntityPath;
		},
		set activeEntityPath(__nextValue: typeof activeEntityPath) {
			activeEntityPath = __nextValue;
		},
		get selectedInstanceId(): typeof selectedInstanceId {
			return selectedInstanceId;
		},
		set selectedInstanceId(__nextValue: typeof selectedInstanceId) {
			selectedInstanceId = __nextValue;
		},
		get selectedSectionId(): typeof selectedSectionId {
			return selectedSectionId;
		},
		set selectedSectionId(__nextValue: typeof selectedSectionId) {
			selectedSectionId = __nextValue;
		},
		get selectedColumnIndex(): typeof selectedColumnIndex {
			return selectedColumnIndex;
		},
		set selectedColumnIndex(__nextValue: typeof selectedColumnIndex) {
			selectedColumnIndex = __nextValue;
		},
		get sections(): typeof sections {
			return sections;
		},
		set sections(__nextValue: typeof sections) {
			sections = __nextValue;
		},
		get hoverCanvas(): typeof hoverCanvas {
			return hoverCanvas;
		},
		set hoverCanvas(__nextValue: typeof hoverCanvas) {
			hoverCanvas = __nextValue;
		},
		get activeDropTarget(): typeof activeDropTarget {
			return activeDropTarget;
		},
		set activeDropTarget(__nextValue: typeof activeDropTarget) {
			activeDropTarget = __nextValue;
		},
		get templateDomain(): typeof templateDomain {
			return templateDomain;
		},
		set templateDomain(__nextValue: typeof templateDomain) {
			templateDomain = __nextValue;
		},
		get templateFamily(): typeof templateFamily {
			return templateFamily;
		},
		set templateFamily(__nextValue: typeof templateFamily) {
			templateFamily = __nextValue;
		},
		get exportState(): typeof exportState {
			return exportState;
		},
		set exportState(__nextValue: typeof exportState) {
			exportState = __nextValue;
		},
		get exportMessage(): typeof exportMessage {
			return exportMessage;
		},
		set exportMessage(__nextValue: typeof exportMessage) {
			exportMessage = __nextValue;
		},
		get availableDomainNames(): typeof availableDomainNames {
			return availableDomainNames;
		},
		get availableJointNames(): typeof availableJointNames {
			return availableJointNames;
		},
		get entities(): typeof entities {
			return entities;
		},
		get activeEntity(): typeof activeEntity {
			return activeEntity;
		},
		get selectedDescriptor(): typeof selectedDescriptor {
			return selectedDescriptor;
		},
		get createSectionAndSelect(): typeof createSectionAndSelect {
			return createSectionAndSelect;
		},
		get insertSectionAfter(): typeof insertSectionAfter {
			return insertSectionAfter;
		},
		get setSectionColumns(): typeof setSectionColumns {
			return setSectionColumns;
		},
		get removeSection(): typeof removeSection {
			return removeSection;
		},
		get appendEntityToTarget(): typeof appendEntityToTarget {
			return appendEntityToTarget;
		},
		get duplicateSelectedInstance(): typeof duplicateSelectedInstance {
			return duplicateSelectedInstance;
		},
		get removeSelectedInstance(): typeof removeSelectedInstance {
			return removeSelectedInstance;
		},
		get moveSelectedInstance(): typeof moveSelectedInstance {
			return moveSelectedInstance;
		},
		get moveSection(): typeof moveSection {
			return moveSection;
		},
		get exportTemplate(): typeof exportTemplate {
			return exportTemplate;
		},
		get handleEntityDragStart(): typeof handleEntityDragStart {
			return handleEntityDragStart;
		},
		get handleCanvasDrop(): typeof handleCanvasDrop {
			return handleCanvasDrop;
		},
		get handleCanvasDragOver(): typeof handleCanvasDragOver {
			return handleCanvasDragOver;
		},
		get handleCanvasDragLeave(): typeof handleCanvasDragLeave {
			return handleCanvasDragLeave;
		},
		get handleDomainSelect(): typeof handleDomainSelect {
			return handleDomainSelect;
		},
		get handleJointSelect(): typeof handleJointSelect {
			return handleJointSelect;
		},
		get handleEntityAdd(): typeof handleEntityAdd {
			return handleEntityAdd;
		},
		get selectSection(): typeof selectSection {
			return selectSection;
		},
		get selectInstance(): typeof selectInstance {
			return selectInstance;
		},
		get getInstance(): typeof getInstance {
			return getInstance;
		},
		get handleKeyboardShortcut(): typeof handleKeyboardShortcut {
			return handleKeyboardShortcut;
		}
	};
}
export default createDomainBuilderComponentState;
