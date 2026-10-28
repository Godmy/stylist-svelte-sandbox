import { render, fireEvent, waitFor, cleanup } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import StylistPreview from '$stylist/domain/component/page/stylist-preview/index.svelte';
import type { RecipeStylistPreview } from '$stylist/domain/interface/recipe/stylist-preview';
import type { HTMLAttributes } from 'svelte/elements';

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe('local component feedback', () => {
	it('selects multiple cards without navigation, toggles off and saves canonical paths', async () => {
		const onOpenStory = vi.fn();
		const catalog = [
			{
				id: 'html/component/atom/a',
				path: 'design-system\\html\\component\\atom\\a',
				sourcePath: 'modules/design-system/html/component/atom/a'
			},
			{
				id: 'button/component/atom/button',
				path: 'interaction\\button\\component\\atom\\button',
				sourcePath: 'modules/interaction/button/component/atom/button'
			}
		];
		const fetchMock = vi.fn(async (_url: string, options?: RequestInit) => ({
			ok: true,
			json: async () =>
				options?.method === 'POST'
					? { savedAt: 'now' }
					: { catalog, selection: { components: [], kind: 'components', note: '' } }
		}));
		vi.stubGlobal('fetch', fetchMock);
		const props: RecipeStylistPreview & HTMLAttributes<HTMLDivElement> = {
			stories: [
				{ id: catalog[0].id, componentName: 'A', category: 'Atoms', subcategory: 'html' },
				{ id: catalog[1].id, componentName: 'Button', category: 'Atoms', subcategory: 'button' }
			],
			categories: [],
			categoryCounts: {},
			tags: [],
			searchQuery: '',
			selectedCategories: new Set(),
			selectedTags: new Set(),
			viewMode: 'grid',
			sortBy: 'name',
			showFilters: false,
			stats: { total: 2, filtered: 2 },
			onSearchQueryChange() {},
			onToggleCategory() {},
			onToggleTag() {},
			onViewModeChange() {},
			onSortByChange() {},
			onToggleFilters() {},
			onClearFilters() {},
			onOpenStory
		};
		const view = render(StylistPreview, props);
		const a = await view.findByRole(
			'button',
			{ name: 'Выбрать для доработки: A' },
			{ timeout: 10000 }
		);
		const b = view.getByRole('button', { name: 'Выбрать для доработки: Button' });
		await fireEvent.click(a);
		await fireEvent.click(b);
		expect(onOpenStory).not.toHaveBeenCalled();
		expect(a.getAttribute('aria-pressed')).toBe('true');
		expect(
			(view.getByRole('textbox', { name: 'Пути выбранных компонентов' }) as HTMLTextAreaElement)
				.value
		).toBe(catalog.map((entry) => entry.path).join('\n'));
		await waitFor(() =>
			expect(
				fetchMock.mock.calls.some(
					([, options]) =>
						options?.method === 'POST' && JSON.parse(String(options.body)).ids.length === 2
				)
			).toBe(true)
		);
		await fireEvent.click(a);
		expect(a.getAttribute('aria-pressed')).toBe('false');
		await fireEvent.click(view.getByRole('button', { name: 'Для доработки · 1' }));
		expect(
			view.getByRole('button', { name: 'Для доработки · 1' }).getAttribute('aria-expanded')
		).toBe('false');
		await view.rerender({ ...props, viewMode: 'list' });
		expect(view.queryByRole('button', { name: 'Выбрать для доработки: A' })).toBeNull();
		await fireEvent.click(view.container.querySelector('.pcc-card')!);
		expect(onOpenStory).toHaveBeenCalledWith(catalog[0].id);
	});
});
