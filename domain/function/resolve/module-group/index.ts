/**
 * Groups `modules.json` entries under their top-level module (by `path`): nested
 * repositories such as `prototype/presentation` or `business/travel` add their domains
 * to the container instead of becoming separate modules. Only available domains are
 * kept; groups without them are dropped. Registry order is preserved.
 */
export function resolveModuleGroup(
	registry: Record<string, { path?: string; domains: string[] }>,
	availableDomains: readonly string[]
): { name: string; domains: string[] }[] {
	const entries = Object.entries(registry);
	const root = (path = '') =>
		entries
			.filter(([, entry]) => entry.path && path.startsWith(`${entry.path}/`))
			.sort(([, a], [, b]) => (a.path ?? '').length - (b.path ?? '').length)[0]?.[0];
	// Containers first with their own domains, then nested entries append theirs.
	const groups = new Map<string, string[]>(
		entries.filter(([, entry]) => !root(entry.path)).map(([name, entry]) => [name, entry.domains])
	);
	for (const [, entry] of entries) {
		const group = root(entry.path);
		if (group) groups.set(group, [...(groups.get(group) ?? []), ...entry.domains]);
	}
	return [...groups]
		.map(([name, domains]) => ({
			name,
			domains: domains.filter((domain) => availableDomains.includes(domain))
		}))
		.filter((group) => group.domains.length > 0);
}
