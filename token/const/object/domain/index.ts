import type { Token } from '$stylist/token/type/object/token';
import { TOKEN_STYLIST_PREVIEW_SORT_BY } from '$stylist/domain/const/array/stylist-preview-sort-by';
import { TOKEN_STYLIST_PREVIEW_VIEW_MODE } from '$stylist/domain/const/array/stylist-preview-view-mode';

export const TOKEN_DOMAIN_SETTING = [
	{
		key: 'stylist-preview-sort-by',
		label: 'Stylist Preview Sort By',
		domain: 'domain',
		controlKind: 'radio',
		values: TOKEN_STYLIST_PREVIEW_SORT_BY
	},
	{
		key: 'stylist-preview-view-mode',
		label: 'Stylist Preview View Mode',
		domain: 'domain',
		controlKind: 'radio',
		values: TOKEN_STYLIST_PREVIEW_VIEW_MODE
	}
] satisfies readonly Token[];
