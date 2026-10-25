import { describe, expect, it } from 'vitest';
import { resolvePreviewSkin } from '$stylist/domain/function/resolve/preview-skin';

describe('resolvePreviewSkin', () => {
	it('enables the skin for visual html stories and keeps metadata out', () => {
		expect(resolvePreviewSkin('/src/lib/html/component/organism/section/index.story.ts')).toBe(
			true
		);
		for (const family of ['meta', 'base', 'style', 'svg', 'math'])
			expect(resolvePreviewSkin(`/src/lib/html/component/atom/${family}/index.story.ts`)).toBe(
				false
			);
	});

	it('enables it for every visual design-system domain', () => {
		for (const domain of ['typography', 'svg', 'mathml', 'layout', 'theme', 'localization'])
			expect(resolvePreviewSkin(`/src/lib/${domain}/component/atom/x/index.story.ts`), domain).toBe(
				true
			);
		expect(resolvePreviewSkin('/src/lib/layout/component/page/landing/index.story.ts')).toBe(true);
	});

	it('keeps other domains out, including names that merely end in a domain name', () => {
		expect(resolvePreviewSkin('/src/lib/button/component/atom/button/index.story.ts')).toBe(false);
		expect(resolvePreviewSkin('/src/lib/page-layout/component/atom/x/index.story.ts')).toBe(false);
		expect(resolvePreviewSkin('/src/lib/mythemes/component/atom/x/index.story.ts')).toBe(false);
	});
});
