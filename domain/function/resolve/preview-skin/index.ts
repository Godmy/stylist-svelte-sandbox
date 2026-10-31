/** Visual domains whose components inherit the html skin: the design system and search. */
const SKINNED_DOMAIN =
	/(^|\/)(typography|svg|mathml|layout|theme|localization|search)\/component\//;

/** Families without a visual part of their own: context providers, sandbox chrome, svg primitives. */
const UNSKINNED_FAMILY = new Set([
	'theme/theme-provider',
	'theme/theme-consumer',
	'theme/theme-context',
	'theme/story',
	...['circle', 'group', 'line', 'path', 'polygon', 'polyline', 'rect', 'text'].map(
		(shape) => `svg/svg-${shape}`
	)
]);

/** Html families that are metadata or embed their own markup language. */
const UNSKINNED_HTML = [
	'base',
	'head',
	'title',
	'meta',
	'link',
	'script',
	'style',
	'raw-text',
	'svg',
	'math'
];

/** Whether a story has visual HTML content that can use the shared skin and appearance panel. */
export function resolvePreviewSkin(path: string): boolean {
	const family = path.split('/').at(-2) ?? '';
	const domain = SKINNED_DOMAIN.exec(path)?.[2];
	if (domain) return !UNSKINNED_FAMILY.has(`${domain}/${family}`);
	if (!/(^|\/)html\/component\//.test(path)) return false;
	return !UNSKINNED_HTML.includes(family);
}
