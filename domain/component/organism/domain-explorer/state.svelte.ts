import type { TreeNode } from '$stylist/tree/type/object/tree-node';
import { expandComponentTree } from '$stylist/domain/function/transform/expand-component-tree';
import type { RecipeDomainExplorer } from '$stylist/domain/interface/recipe/domain-explorer';

type PreviewMode = 'file' | 'markdown' | 'story' | 'json-tree' | 'di';
type StoryModule = { default: unknown };

interface DomainPageInput extends Pick<
	RecipeDomainExplorer,
	'tree' | 'initialDomain' | 'initialCluster' | 'initialJoint' | 'initialPreviewMode'
> {
	storyModules: Record<string, () => Promise<StoryModule>>;
}

interface SearchDomainEntry {
	id: string;
	domain: string;
	cluster: string;
	joint: string;
	family: string;
	entityPath: string;
	filePath: string;
	searchText: string;
}

interface DomainDependency {
	key: string;
	depth: number;
}

interface DomainDependencyFile {
	name: string;
	content: string;
}

export function createDomainPageState(input: DomainPageInput) {
	const { storyModules, initialDomain, initialCluster, initialJoint, initialPreviewMode } = input;
	const tree = expandComponentTree(input.tree);

	let activeDomain = $state(
		tree.some((domainNode) => domainNode.name === initialDomain)
			? (initialDomain ?? '')
			: (tree[0]?.name ?? '')
	);
	let activeCluster = $state(initialCluster ?? '');
	let activeJoint = $state(initialJoint ?? '');
	let activeEntityPath = $state('');
	let activeFilePath = $state('');
	let fileContent = $state('');
	let fileError = $state('');
	let fileLoading = $state(false);
	let previewMode = $state<PreviewMode>(initialPreviewMode ?? 'file');
	let storyPreviewComponent = $state<unknown>(null);
	let storyPreviewLoading = $state(false);
	let storyPreviewError = $state('');
	// Plain cache, not reactive state: the story effect reads it without subscribing.
	const loadedStories: Record<string, unknown> = {};
	let dependencyLoading = $state(false);
	let dependencyError = $state('');
	let dependencyItems = $state<DomainDependency[]>([]);
	let dependencyTreeNodes = $state<TreeNode[]>([]);
	let selectedDependencyKey = $state('');
	let selectedDependencyFiles = $state<DomainDependencyFile[]>([]);

	const activeDomainNode = $derived(tree.find((d) => d.name === activeDomain));
	const availableDomainNames = $derived(
		tree.map((domainNode) => domainNode.name).sort((a, b) => a.localeCompare(b))
	);
	const availableClusterNames = $derived(activeDomainNode?.clusters.map((c) => c.name) ?? []);
	const activeClusterNode = $derived(
		activeDomainNode?.clusters.find((c) => c.name === activeCluster)
	);
	const activeJointNode = $derived(activeClusterNode?.joints.find((j) => j.name === activeJoint));
	const availableJointNames = $derived(activeClusterNode?.joints.map((j) => j.name) ?? []);
	const entities = $derived(activeJointNode?.entities ?? []);
	const activeEntity = $derived(entities.find((e) => e.path === activeEntityPath));
	const markdownFile = $derived(
		activeEntity?.files.find((f) => f.name === 'readme.md') ??
			activeEntity?.files.find((f) => f.name === 'index.md') ??
			null
	);
	// `index.story.ts` describes the story; a sibling `index.story.svelte` is then only its render.
	const storyFile = $derived(
		activeEntity?.files.find((f) => f.name === 'index.story.ts') ??
			activeEntity?.files.find((f) => f.name === 'index.story.svelte') ??
			null
	);
	const activeFamily = $derived(activeEntity?.name.split('/').at(-1) ?? '');
	const activeFamilyName = $derived(activeEntity?.name ?? '');
	const breadcrumbFile = $derived(activeFilePath ? (activeFilePath.split('/').pop() ?? '') : '');
	const activeEntityDependencyKey = $derived(activeEntity?.path.replace(/\//g, '\\') ?? '');
	const hasDependencyPreview = $derived(
		activeCluster === 'component' &&
			(activeJoint === 'atom' ||
				activeJoint === 'molecule' ||
				activeJoint === 'organism' ||
				activeJoint === 'template')
	);
	function toStoryModulePath(path: string): string {
		const normalized = path.replace(/\\/g, '/').replace(/^\/+/, '');
		const libPath = normalized.startsWith('src/lib/')
			? normalized.slice('src/lib/'.length)
			: normalized;

		return `/src/lib/${libPath}`;
	}

	const storyModulePath = $derived(storyFile ? toStoryModulePath(storyFile.path) : null);
	const previewKind = $derived.by(() => {
		if (activeFilePath.endsWith('.svg')) return 'svg';
		if (activeFilePath.endsWith('.json')) return 'json';
		return 'text';
	});
	const searchEntries = $derived.by<SearchDomainEntry[]>(() =>
		tree.flatMap((domainNode) =>
			domainNode.clusters.flatMap((clusterNode) =>
				clusterNode.joints.flatMap((jointNode) =>
					jointNode.entities.map((entity) => ({
						id: `${domainNode.name}/${clusterNode.name}/${jointNode.name}/${entity.path}`,
						domain: domainNode.name,
						cluster: clusterNode.name,
						joint: jointNode.name,
						family: entity.name,
						entityPath: entity.path,
						filePath: entity.files[0]?.path ?? '',
						searchText: [
							domainNode.name,
							clusterNode.name,
							jointNode.name,
							entity.name,
							entity.path,
							...entity.files.map((file) => file.name),
							...entity.files.map((file) => file.path)
						]
							.join(' ')
							.toLowerCase()
					}))
				)
			)
		)
	);

	$effect(() => {
		if (activeDomainNode) return;
		activeDomain = availableDomainNames[0] ?? '';
	});

	$effect(() => {
		if (!activeDomainNode) return;
		if (!activeCluster || !activeDomainNode.clusters.some((c) => c.name === activeCluster)) {
			activeCluster = activeDomainNode.clusters[0]?.name ?? '';
		}
	});

	$effect(() => {
		if (!activeClusterNode) {
			activeJoint = '';
			return;
		}
		if (!activeJoint || !activeClusterNode.joints.some((j) => j.name === activeJoint)) {
			activeJoint = activeClusterNode.joints[0]?.name ?? '';
		}
	});

	$effect(() => {
		if (entities.length === 0) {
			activeEntityPath = '';
			activeFilePath = '';
			previewMode = 'file';
			return;
		}
		if (!activeEntityPath || !entities.some((e) => e.path === activeEntityPath)) {
			const first = entities[0];
			handleEntitySelect(first.path, first.files);
		}
	});

	$effect(() => {
		if (!activeEntity) return;
		if (!activeFilePath || !activeEntity.files.some((f) => f.path === activeFilePath)) {
			activeFilePath = activeEntity.files[0]?.path ?? '';
		}
	});

	$effect(() => {
		if (previewMode !== 'file' && previewMode !== 'json-tree') return;
		const path = activeFilePath;
		if (!path) {
			fileContent = '';
			fileError = '';
			fileLoading = false;
			return;
		}
		fileLoading = true;
		fileError = '';
		fetch(`/api/content?path=${encodeURIComponent(path)}`)
			.then(async (r) => {
				const p = await r.json();
				if (!r.ok) throw new Error(p.error ?? 'Preview failed');
				if (activeFilePath !== path || (previewMode !== 'file' && previewMode !== 'json-tree'))
					return;
				fileContent = p.content ?? '';
			})
			.catch((e: Error) => {
				if (activeFilePath !== path || (previewMode !== 'file' && previewMode !== 'json-tree'))
					return;
				fileContent = '';
				fileError = e.message;
			})
			.finally(() => {
				if (activeFilePath === path) fileLoading = false;
			});
	});

	$effect(() => {
		if (previewMode !== 'markdown') return;
		const path = markdownFile?.path ?? '';
		if (!path) {
			fileContent = '';
			fileError = 'Markdown file is not available for this entity.';
			fileLoading = false;
			return;
		}
		fileLoading = true;
		fileError = '';
		fetch(`/api/content?path=${encodeURIComponent(path)}`)
			.then(async (r) => {
				const p = await r.json();
				if (!r.ok) throw new Error(p.error ?? 'Preview failed');
				if (previewMode !== 'markdown' || markdownFile?.path !== path) return;
				fileContent = p.content ?? '';
			})
			.catch((e: Error) => {
				if (previewMode !== 'markdown' || markdownFile?.path !== path) return;
				fileContent = '';
				fileError = e.message;
			})
			.finally(() => {
				if (previewMode === 'markdown' && markdownFile?.path === path) fileLoading = false;
			});
	});

	$effect(() => {
		if (previewMode !== 'story') return;
		const modulePath = storyModulePath;
		const loadStory = modulePath ? storyModules[modulePath] : null;
		storyPreviewError = '';
		if (!modulePath || !loadStory) {
			storyPreviewComponent = null;
			storyPreviewLoading = false;
			storyPreviewError = 'Story playground is not available for this entity.';
			return;
		}
		// A story loaded before is shown at once: no loading frame when switching back to it.
		const loaded = loadedStories[modulePath];
		if (loaded) {
			storyPreviewComponent = loaded;
			storyPreviewLoading = false;
			return;
		}
		storyPreviewComponent = null;
		storyPreviewLoading = true;
		loadStory()
			.then((m) => {
				if (m.default) loadedStories[modulePath] = m.default;
				if (storyModulePath !== modulePath || previewMode !== 'story') return;
				storyPreviewComponent = m.default ?? null;
				if (!storyPreviewComponent)
					storyPreviewError = 'Story module does not expose a default export.';
			})
			.catch((e: Error) => {
				if (storyModulePath !== modulePath || previewMode !== 'story') return;
				storyPreviewError = e.message;
			})
			.finally(() => {
				if (storyModulePath === modulePath && previewMode === 'story') storyPreviewLoading = false;
			});
	});

	$effect(() => {
		if (previewMode !== 'di') return;
		if (!hasDependencyPreview || !activeEntityDependencyKey) {
			dependencyItems = [];
			dependencyTreeNodes = [];
			selectedDependencyKey = '';
			selectedDependencyFiles = [];
			dependencyError = 'DI preview is available for components only.';
			dependencyLoading = false;
			return;
		}

		const componentKey = activeEntityDependencyKey;
		const dependencyKey = selectedDependencyKey;
		dependencyLoading = true;
		dependencyError = '';
		fetch(
			`/api/di?component=${encodeURIComponent(componentKey)}&dependency=${encodeURIComponent(dependencyKey)}`
		)
			.then(async (r) => {
				const p = await r.json();
				if (!r.ok) throw new Error(p.error ?? 'DI preview failed');
				if (activeEntityDependencyKey !== componentKey || previewMode !== 'di') return;
				dependencyItems = Array.isArray(p.dependencies) ? p.dependencies : [];
				dependencyTreeNodes = Array.isArray(p.dependencyTreeNodes) ? p.dependencyTreeNodes : [];
				selectedDependencyKey = p.selectedDependencyKey ?? '';
				selectedDependencyFiles = Array.isArray(p.selectedDependencyFiles)
					? p.selectedDependencyFiles
					: [];
			})
			.catch((e: Error) => {
				if (activeEntityDependencyKey !== componentKey || previewMode !== 'di') return;
				dependencyItems = [];
				dependencyTreeNodes = [];
				selectedDependencyFiles = [];
				dependencyError = e.message;
			})
			.finally(() => {
				if (activeEntityDependencyKey === componentKey && previewMode === 'di') {
					dependencyLoading = false;
				}
			});
	});

	function handleDomainSelect(name: string) {
		activeDomain = name;
		activeEntityPath = '';
		activeFilePath = '';
	}

	function handleClusterSelect(name: string) {
		activeCluster = name;
		activeEntityPath = '';
		activeFilePath = '';
	}

	function handleJointSelect(name: string) {
		activeJoint = name;
		activeEntityPath = '';
		activeFilePath = '';
	}

	function handleEntitySelect(
		path: string,
		files = entities.find((e) => e.path === path)?.files ?? []
	) {
		activeEntityPath = path;
		const md =
			files.find((f) => f.name === 'readme.md') ?? files.find((f) => f.name === 'index.md');

		if (previewMode === 'markdown') {
			if (md) {
				activeFilePath = md.path;
				return;
			}
		}

		const story =
			files.find((f) => f.name === 'index.story.ts') ??
			files.find((f) => f.name === 'index.story.svelte');
		if (story) {
			activeFilePath = story.path;
			previewMode = 'story';
			return;
		}
		if (md) {
			activeFilePath = md.path;
			previewMode = 'markdown';
			return;
		}

		const currentName = activeFilePath.split('/').pop();
		const same = currentName ? files.find((f) => f.name === currentName) : null;
		activeFilePath =
			same?.path ??
			files.find((f) => f.name === 'index.svelte')?.path ??
			files.find((f) => f.name === 'index.ts')?.path ??
			files[0]?.path ??
			'';
		previewMode = 'file';
	}

	function handleFileSelect(path: string) {
		activeFilePath = path;
		previewMode = 'file';
	}

	function handleMarkdownSelect() {
		if (!markdownFile) return;
		activeFilePath = markdownFile.path;
		previewMode = 'markdown';
	}

	function handleStorySelect() {
		if (!storyFile) return;
		activeFilePath = storyFile.path;
		previewMode = 'story';
	}

	function handleJsonTreeSelect() {
		previewMode = 'json-tree';
	}

	function handleDependencySelect(key?: string) {
		if (!hasDependencyPreview) return;
		if (key) {
			selectedDependencyKey = key;
		}
		previewMode = 'di';
	}

	function selectSearchEntry(entryId: string) {
		const entry = searchEntries.find((candidate) => candidate.id === entryId);
		if (!entry) return;

		activeDomain = entry.domain;
		activeCluster = entry.cluster;
		activeJoint = entry.joint;
		// Resolve the family from the search destination, including a different domain or joint.
		const next = tree
			.find((d) => d.name === entry.domain)
			?.clusters.find((c) => c.name === entry.cluster)
			?.joints.find((j) => j.name === entry.joint)
			?.entities.find((e) => e.path === entry.entityPath);
		handleEntitySelect(entry.entityPath, next?.files ?? []);
	}

	return {
		get activeDomain() {
			return activeDomain;
		},
		get activeCluster() {
			return activeCluster;
		},
		get activeJoint() {
			return activeJoint;
		},
		get activeEntityPath() {
			return activeEntityPath;
		},
		get activeFilePath() {
			return activeFilePath;
		},
		get fileContent() {
			return fileContent;
		},
		get fileError() {
			return fileError;
		},
		get fileLoading() {
			return fileLoading;
		},
		get previewMode() {
			return previewMode;
		},
		get storyPreviewComponent() {
			return storyPreviewComponent;
		},
		get storyPreviewLoading() {
			return storyPreviewLoading;
		},
		get storyPreviewError() {
			return storyPreviewError;
		},
		get dependencyLoading() {
			return dependencyLoading;
		},
		get dependencyError() {
			return dependencyError;
		},
		get dependencyItems() {
			return dependencyItems;
		},
		get dependencyTreeNodes() {
			return dependencyTreeNodes;
		},
		get selectedDependencyKey() {
			return selectedDependencyKey;
		},
		get selectedDependencyFiles() {
			return selectedDependencyFiles;
		},
		get availableJointNames() {
			return availableJointNames;
		},
		get availableClusterNames() {
			return availableClusterNames;
		},
		get availableDomainNames() {
			return availableDomainNames;
		},
		get entities() {
			return entities;
		},
		get activeEntity() {
			return activeEntity;
		},
		get markdownFile() {
			return markdownFile;
		},
		get storyFile() {
			return storyFile;
		},
		get activeFamily() {
			return activeFamily;
		},
		get activeFamilyName() {
			return activeFamilyName;
		},
		get breadcrumbFile() {
			return breadcrumbFile;
		},
		get previewKind() {
			return previewKind;
		},
		get hasDependencyPreview() {
			return hasDependencyPreview;
		},
		get searchEntries() {
			return searchEntries;
		},
		handleDomainSelect,
		handleClusterSelect,
		handleJointSelect,
		handleEntitySelect,
		handleFileSelect,
		handleMarkdownSelect,
		handleStorySelect,
		handleJsonTreeSelect,
		handleDependencySelect,
		selectSearchEntry
	};
}

export default createDomainPageState;
