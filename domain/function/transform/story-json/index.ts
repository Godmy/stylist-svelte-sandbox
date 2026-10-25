const kind = (value: unknown) =>
	value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

/**
 * Text of a `json` story control → arg value. Empty text clears the arg. With an
 * `example`, the value must have its kind (array, object, …), and for an array example
 * every item must have the kind of one of its items: `['', { title: '' }]` allows both.
 */
export function transformStoryJson(
	text: string,
	example?: unknown
): { ok: true; value: unknown } | { ok: false; error: string } {
	if (!text.trim()) return { ok: true, value: undefined };
	let value: unknown;
	try {
		value = JSON.parse(text);
	} catch (error) {
		return { ok: false, error: error instanceof Error ? error.message : String(error) };
	}
	if (example === undefined) return { ok: true, value };
	if (kind(value) !== kind(example))
		return { ok: false, error: `Expected ${kind(example)}, got ${kind(value)}` };
	if (Array.isArray(example) && Array.isArray(value) && example.length) {
		const kinds = [...new Set(example.map(kind))];
		const index = value.findIndex((item) => !kinds.includes(kind(item)));
		if (index !== -1)
			return {
				ok: false,
				error: `Item ${index}: expected ${kinds.join(' or ')}, got ${kind(value[index])}`
			};
	}
	return { ok: true, value };
}
