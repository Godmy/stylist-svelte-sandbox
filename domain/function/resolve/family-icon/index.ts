import { FAMILY_ICON } from '$stylist/domain/const/record/family-icon';

/**
 * Uses explicit semantic aliases and registry names, then progressively shorter
 * phrases anywhere in a compound name. Longer matches win; equal-length matches
 * prefer the trailing phrase. Unknown names still return null.
 */
export function resolveFamilyIcon(
	family: string,
	hasIcon: (name: string) => boolean
): string | null {
	const name = family
		.trim()
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
		.replace(/[_\s]+/g, '-')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase();
	if (!name) return null;
	const roleSuffix =
		/-(type|props|state|status|options|config|item|items|kind|mode|variant|recipe|slot|contract|behavior|events?)$/;
	const genericWords = new Set([
		'html',
		'type',
		'types',
		'item',
		'items',
		'state',
		'props',
		'base',
		'config',
		'options',
		'data',
		'value',
		'values',
		'status',
		'mode',
		'kind',
		'style',
		'variant',
		'size',
		'default',
		'node'
	]);
	function pick(candidate: string) {
		const alias = Object.hasOwn(FAMILY_ICON, candidate) ? FAMILY_ICON[candidate] : undefined;
		if (alias && hasIcon(alias)) return alias;
		return hasIcon(candidate) ? candidate : null;
	}
	const exact = pick(name);
	if (exact) return exact;
	let base = name;
	while (roleSuffix.test(base)) {
		base = base.replace(roleSuffix, '');
		const icon = pick(base);
		if (icon) return icon;
	}
	const words = base.split('-').filter(Boolean);
	for (let count = words.length - 1; count >= 1; count--) {
		for (let start = words.length - count; start >= 0; start--) {
			const phrase = words.slice(start, start + count).join('-');
			if (genericWords.has(phrase)) continue;
			const icon = pick(phrase);
			if (icon) return icon;
		}
	}
	return null;
}
