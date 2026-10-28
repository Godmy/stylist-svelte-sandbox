import { describe, expect, it } from 'vitest';
import { createStylistPreviewCatalogState } from '$stylist/domain/function/state/stylist-preview-catalog/state.svelte';

describe('manifest component catalog', () => {
	it('includes component stories, combines filters and restores the full catalog', () => {
		const catalog = createStylistPreviewCatalogState(() => ({
			button: { component: { atom: { primary: 'STORY_COMPONENT' } } },
			layout: {
				component: { organism: { shell: 'STORY_COMPONENT' } },
				data: { icon: { logo: 'INDEX_SVG' } }
			}
		}));
		expect(catalog.stats).toEqual({ total: 2, filtered: 2 });
		expect(catalog.stories.map((story) => story.id)).toEqual([
			'button/component/atom/primary',
			'layout/component/organism/shell'
		]);
		catalog.onToggleCategory('Organisms');
		expect(catalog.stories.map((story) => story.componentName)).toEqual(['Shell']);
		catalog.onToggleTag('button');
		expect(catalog.stories).toEqual([]);
		catalog.onClearFilters();
		catalog.onSearchQueryChange('primary');
		expect(catalog.stats).toEqual({ total: 2, filtered: 1 });
		catalog.onClearFilters();
		expect(catalog.stats.filtered).toBe(2);
	});
});
