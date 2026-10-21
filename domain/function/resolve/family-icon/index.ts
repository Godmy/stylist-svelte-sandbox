import { FAMILY_ICON } from '$stylist/domain/const/record/family-icon';

/** Role suffixes that describe the entity kind, not its subject (`file-item-type` -> `file-item`). */
const ROLE_SUFFIX =
	/-(type|props|state|status|options|config|item|items|kind|mode|variant|recipe|slot|contract|behavior|events?)$/;

/** Words too generic to stand for a family on their own. */
const GENERIC_WORDS = new Set([
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
	'default'
]);

/**
 * Picks a fitting registry icon for a family, or `null` when none fits:
 * the hand-picked table, the exact name, the name without a role suffix, then its
 * trailing words — the head of an English compound (`range-input` -> `input`).
 */
export function resolveFamilyIcon(
	family: string,
	hasIcon: (name: string) => boolean
): string | null {
	const name = family
		.trim()
		.replace(/[_\s]+/g, '-')
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase();
	if (!name) return null;
	const picked = FAMILY_ICON[name];
	if (picked && hasIcon(picked)) return picked;
	if (hasIcon(name)) return name;
	const base = name.replace(ROLE_SUFFIX, '');
	if (base !== name && hasIcon(base)) return base;
	const words = base.split('-').filter(Boolean);
	for (let count = words.length - 1; count >= 1; count--) {
		const tail = words.slice(-count).join('-');
		if (!GENERIC_WORDS.has(tail) && hasIcon(tail)) return tail;
	}
	return null;
}
