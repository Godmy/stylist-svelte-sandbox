/** Local feedback selection. Its caller is guarded by import.meta.env.DEV. */
export function createComponentFeedbackState() {
	type Entry = { id: string; path: string; sourcePath: string };
	let available = $state(false);
	let selected = $state<string[]>([]);
	let catalog = $state<Record<string, Entry>>({});
	let kind = $state('components');
	let note = $state('');
	let expanded = $state(true);
	let status = $state('');
	let error = $state('');
	let ready = $state(false);
	let revision = 0;
	let queue = Promise.resolve();
	const endpoint = '/__stylist-debug/component-feedback';
	$effect(() => {
		if (!import.meta.env.DEV) return;
		const controller = new AbortController();
		void fetch(endpoint, { signal: controller.signal })
			.then(async (response) => {
				if (!response.ok) return;
				const data = await response.json();
				if (controller.signal.aborted) return;
				catalog = Object.fromEntries(data.catalog.map((entry: Entry) => [entry.id, entry]));
				selected = data.selection.components.map((entry: Entry) => entry.id);
				kind = data.selection.kind;
				note = data.selection.note;
				available = true;
				ready = true;
				status = 'Автосохранение в .tmp/component-feedback.json';
			})
			.catch(() => {});
		return () => controller.abort();
	});
	$effect(() => {
		if (!import.meta.env.DEV || !ready) return;
		const body = JSON.stringify({ ids: selected, kind, note });
		const current = ++revision;
		const timer = setTimeout(() => {
			status = 'Сохранение…';
			queue = queue.then(async () => {
				try {
					const response = await fetch(endpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body
					});
					if (!response.ok) throw new Error('save');
					if (current === revision) {
						status = 'Сохранено в .tmp/component-feedback.json';
						error = '';
					}
				} catch {
					if (current === revision) {
						status = '';
						error = 'Не удалось сохранить JSON. Проверьте локальный сервер.';
					}
				}
			});
		}, 250);
		return () => clearTimeout(timer);
	});
	return {
		get available() {
			return available;
		},
		get count() {
			return selected.length;
		},
		get paths() {
			return selected.map((id) => catalog[id]?.path ?? id).join('\n');
		},
		get expanded() {
			return expanded;
		},
		get kind() {
			return kind;
		},
		get note() {
			return note;
		},
		get status() {
			return status;
		},
		get error() {
			return error;
		},
		isSelected(id: string) {
			return selected.includes(id);
		},
		canSelect(id: string) {
			return Object.hasOwn(catalog, id);
		},
		toggle(id: string) {
			if (!available || !Object.hasOwn(catalog, id)) return;
			selected = selected.includes(id)
				? selected.filter((entry) => entry !== id)
				: [...selected, id];
			expanded = true;
		},
		togglePanel() {
			expanded = !expanded;
		},
		setKind(value: string) {
			if (['components', 'icons', 'other'].includes(value)) kind = value;
		},
		setNote(value: string) {
			note = value.slice(0, 8000);
		},
		clear() {
			selected = [];
		},
		async copy() {
			try {
				await navigator.clipboard.writeText(
					selected.map((id) => catalog[id]?.path ?? id).join('\n')
				);
			} catch {
				error = 'Не удалось скопировать. Выделите список и скопируйте вручную.';
			}
		}
	};
}
