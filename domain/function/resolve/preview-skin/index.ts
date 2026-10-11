/** Whether a story has visual HTML content that can use the shared skin. */
export function resolvePreviewSkin(path: string): boolean {
	if (!path.includes('html/component/')) return false;
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
