import type { Token } from '$stylist/token/type/object/token';

export function createTokenSettingsState(getProps: () => { settings: readonly Token[] }) {
	const props = $derived(getProps());
	let search = $state('');
	let domain = $state('all');
	let values = $state<Record<string, string>>({});

	const domains = $derived.by(() => [
		'all',
		...Array.from(new Set(props.settings.map((setting) => setting.domain))).sort()
	]);

	const filteredSettings = $derived.by(() => {
		const query = search.trim().toLowerCase();
		return props.settings.filter((setting) => {
			const matchesDomain = domain === 'all' || setting.domain === domain;
			const matchesQuery =
				query.length === 0 ||
				setting.key.toLowerCase().includes(query) ||
				setting.label.toLowerCase().includes(query) ||
				setting.values.some((value) => String(value).toLowerCase().includes(query));
			return matchesDomain && matchesQuery;
		});
	});

	function getValue(key: string, fallback: string | number | boolean) {
		return values[key] ?? String(fallback);
	}

	function setValue(key: string, value: string | number | boolean) {
		values = { ...values, [key]: String(value) };
	}

	return {
		get search() {
			return search;
		},
		set search(value: string) {
			search = value;
		},
		get domain() {
			return domain;
		},
		set domain(value: string) {
			domain = value;
		},
		get domains() {
			return domains;
		},
		get filteredSettings() {
			return filteredSettings;
		},
		get values() {
			return values;
		},
		getValue,
		setValue
	};
}
