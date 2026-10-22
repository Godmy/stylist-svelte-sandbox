import { tick, type Component } from 'svelte';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { RecipeStoryRunner } from '$stylist/domain/interface/recipe/story-runner';

type StoryModule = {
	default: unknown;
};

type StoryEntry = {
	id: string;
	path: string;
	title: string;
	domain: string;
	level: string;
	section: string;
	family: string;
	load: () => Promise<StoryModule>;
	/** `index.story.ts` only: sibling `index.story.svelte` used as its custom render. */
	loadRender?: () => Promise<StoryModule>;
};

type DiagnosticError = {
	source: 'import' | 'mount' | 'window.error' | 'unhandledrejection';
	message: string;
};

type DiagnosticResult = {
	id: string;
	path: string;
	title: string;
	domain: string;
	status: 'passed' | 'failed';
	errors: DiagnosticError[];
	importMs: number;
	mountMs: number;
	totalMs: number;
};

function toWords(value: string): string {
	return value
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function formatDuration(value: number): string {
	return `${Math.round(value)} ms`;
}

export function getTimingTone(totalMs: number): 'fast' | 'medium' | 'slow' {
	if (totalMs >= 1000) {
		return 'slow';
	}

	if (totalMs >= 300) {
		return 'medium';
	}

	return 'fast';
}

export function createStoryRunnerState(getProps: () => RecipeStoryRunner) {
	const compact = $derived(getProps().compact ?? false);
	const storyModules = import.meta.glob([
		'/src/lib/**/component/**/*.story.{svelte,ts}',
		'/modules/*/*/component/**/*.story.{svelte,ts}',
		'/modules/*/component/**/*.story.{svelte,ts}',
		// The runner's own story would mount the runner inside itself.
		'!/modules/sandbox/domain/component/page/story-runner/**'
	]) as Record<string, () => Promise<StoryModule>>;

	const allStories: StoryEntry[] = Object.entries(storyModules)
		// A `.story.svelte` next to a `.story.ts` is that story's render, not a story of its own.
		.filter(
			([path]) => !(path.endsWith('.svelte') && storyModules[path.replace(/\.svelte$/, '.ts')])
		)
		.map(([path, load]) => {
			const normalizedPath = path
				.replace(/\\/g, '/')
				.replace(/^\/modules\/([^/]+)\/component\//, '/src/lib/$1/component/')
				.replace(/^\/modules\/[^/]+\//, '/src/lib/');
			const parts = normalizedPath.split('/');
			const libIndex = parts.findIndex((part) => part === 'lib');
			const componentIndex = parts.findIndex((part) => part === 'component');
			const domain = parts[libIndex + 1] ?? 'unknown';
			const level = parts[componentIndex + 1] ?? 'component';
			const section = parts[componentIndex + 2] ?? 'misc';
			const family = parts[parts.length - 2] ?? 'story';

			return {
				id: normalizedPath,
				path: normalizedPath.split('/src/lib/').at(-1) ?? normalizedPath,
				title: toWords(family),
				domain,
				level,
				section,
				family,
				load,
				loadRender: path.endsWith('.ts')
					? storyModules[path.replace(/\.ts$/, '.svelte')]
					: undefined
			};
		})
		.sort(
			(left, right) =>
				left.domain.localeCompare(right.domain) ||
				left.level.localeCompare(right.level) ||
				left.section.localeCompare(right.section) ||
				left.title.localeCompare(right.title)
		);

	const domainOptions = ['all', ...new Set(allStories.map((entry) => entry.domain))];

	let searchQuery = $state('');
	let selectedDomain = $state('all');
	let diagnosticsRunning = $state(false);
	let diagnosticsComponent = $state<any>(null);
	let diagnosticsStory = $state<{ story: ContractStory; render: Component | null } | null>(null);
	let diagnosticsResults = $state<DiagnosticResult[]>([]);
	let diagnosticsProgress = $state(0);
	let diagnosticsActiveEntryId = $state<string | null>(null);
	let diagnosticsActivePath = $state<string | null>(null);
	let failedOnly = $state(false);
	let pendingErrors: DiagnosticError[] = [];

	const filteredStories = $derived.by(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		return allStories.filter((entry) => {
			const matchesDomain = selectedDomain === 'all' || entry.domain === selectedDomain;
			const matchesQuery =
				normalizedQuery.length === 0 ||
				entry.title.toLowerCase().includes(normalizedQuery) ||
				entry.path.toLowerCase().includes(normalizedQuery) ||
				entry.family.toLowerCase().includes(normalizedQuery);

			return matchesDomain && matchesQuery;
		});
	});

	const summary = $derived.by(() => ({
		total: diagnosticsResults.length,
		passed: diagnosticsResults.filter((entry) => entry.status === 'passed').length,
		failed: diagnosticsResults.filter((entry) => entry.status === 'failed').length,
		slowest: diagnosticsResults.reduce((max, entry) => Math.max(max, entry.totalMs), 0)
	}));

	const visibleResults = $derived.by(() => {
		const entries = failedOnly
			? diagnosticsResults.filter((entry) => entry.status === 'failed')
			: diagnosticsResults;

		return [...entries].sort((left, right) => right.totalMs - left.totalMs);
	});

	function clearFilters(): void {
		searchQuery = '';
		selectedDomain = 'all';
		failedOnly = false;
	}

	function recordError(source: DiagnosticError['source'], value: unknown): void {
		const message = value instanceof Error ? value.message : String(value);
		pendingErrors = [...pendingErrors, { source, message }];
	}

	async function runDiagnostics(): Promise<void> {
		if (diagnosticsRunning) {
			return;
		}

		const entries = [...filteredStories];
		diagnosticsRunning = true;
		diagnosticsResults = [];
		diagnosticsProgress = 0;
		diagnosticsComponent = null;
		diagnosticsStory = null;

		for (const entry of entries) {
			pendingErrors = [];
			diagnosticsActiveEntryId = entry.id;
			diagnosticsActivePath = entry.path;
			diagnosticsComponent = null;
			diagnosticsStory = null;
			let importMs = 0;
			let mountMs = 0;
			await tick();

			try {
				const importStart = performance.now();
				const module = await entry.load();
				importMs = performance.now() - importStart;
				const component = module.default;

				if (!component) {
					recordError('import', 'Story module has no default export.');
				} else {
					try {
						const mountStart = performance.now();
						if (entry.path.endsWith('.story.ts'))
							diagnosticsStory = {
								story: component as ContractStory,
								render: entry.loadRender ? ((await entry.loadRender()).default as Component) : null
							};
						else diagnosticsComponent = component;
						await tick();
						await new Promise((resolve) => setTimeout(resolve, 250));
						mountMs = performance.now() - mountStart;
					} catch (error) {
						recordError('mount', error);
					}
				}
			} catch (error) {
				recordError('import', error);
			}

			const result: DiagnosticResult = {
				id: entry.id,
				path: entry.path,
				title: entry.title,
				domain: entry.domain,
				status: pendingErrors.length === 0 ? 'passed' : 'failed',
				errors: [...pendingErrors],
				importMs,
				mountMs,
				totalMs: importMs + mountMs
			};

			diagnosticsResults = [...diagnosticsResults, result];
			console[result.status === 'failed' ? 'error' : 'log']('[story runner]', result);

			diagnosticsComponent = null;
			diagnosticsStory = null;
			diagnosticsProgress += 1;
			await tick();
			await new Promise((resolve) => setTimeout(resolve, 20));
		}

		diagnosticsActiveEntryId = null;
		diagnosticsActivePath = null;
		diagnosticsRunning = false;
	}

	$effect(() => {
		const handleWindowError = (event: ErrorEvent) => {
			if (!diagnosticsRunning || !diagnosticsActiveEntryId) {
				return;
			}

			recordError('window.error', event.error ?? event.message);
		};

		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			if (!diagnosticsRunning || !diagnosticsActiveEntryId) {
				return;
			}

			recordError('unhandledrejection', event.reason);
		};

		window.addEventListener('error', handleWindowError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		return () => {
			window.removeEventListener('error', handleWindowError);
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		};
	});

	return {
		get compact() {
			return compact;
		},
		get allStories() {
			return allStories;
		},
		get domainOptions() {
			return domainOptions;
		},
		get searchQuery() {
			return searchQuery;
		},
		set searchQuery(value: string) {
			searchQuery = value;
		},
		get selectedDomain() {
			return selectedDomain;
		},
		set selectedDomain(value: string) {
			selectedDomain = value;
		},
		get diagnosticsRunning() {
			return diagnosticsRunning;
		},
		get diagnosticsComponent() {
			return diagnosticsComponent;
		},
		get diagnosticsStory() {
			return diagnosticsStory;
		},
		get diagnosticsProgress() {
			return diagnosticsProgress;
		},
		get diagnosticsActivePath() {
			return diagnosticsActivePath;
		},
		get diagnosticsResultsCount() {
			return diagnosticsResults.length;
		},
		get failedOnly() {
			return failedOnly;
		},
		set failedOnly(value: boolean) {
			failedOnly = value;
		},
		get filteredStories() {
			return filteredStories;
		},
		get summary() {
			return summary;
		},
		get visibleResults() {
			return visibleResults;
		},
		clearFilters,
		runDiagnostics
	};
}

export default createStoryRunnerState;
