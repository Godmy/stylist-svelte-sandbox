/** Visual design-system domains whose components inherit the html skin. */
const SKINNED_DOMAIN = /(^|\/)(typography|svg|mathml|layout|theme|localization)\/component\//;

/** Whether a story has visual HTML content that can use the shared skin and appearance panel. */
export function resolvePreviewSkin(path: string): boolean {
	if (SKINNED_DOMAIN.test(path)) return true;
	if (!/(^|\/)html\/component\//.test(path)) return false;
	const family = path.split('/').at(-2);
	return ![
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
	].includes(family ?? '');
}
