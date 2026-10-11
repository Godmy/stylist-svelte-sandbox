import type { Token } from '$stylist/token/type/object/token';
import { TOKEN_FLOW } from '$stylist/calendar/const/array/flow';
import { TOKEN_INTERACTION } from '$stylist/workspace/const/array/interaction';
import { INTERACTION_FEEDBACK } from '$stylist/animation/const/array/interaction-feedback';
import { TOKEN_LOADING } from '$stylist/animation/const/array/loading';
import { TOKEN_SEVERITY } from '$stylist/workspace/const/array/sevetity';
import { TOKEN_SORT_DIRECTION } from '$stylist/table/const/array/sort-direction';
import { TOKEN_TRIGGER } from '$stylist/layout/const/array/trigger';
import { TOKEN_COLOR_TONE } from '$stylist/design-token/const/array/color-tone';

export const TOKEN_INTERACTION_SETTING = [
	{
		key: 'appearance',
		label: 'Appearance',
		domain: 'theme',
		controlKind: 'radio',
		values: TOKEN_COLOR_TONE
	},
	{ key: 'flow', label: 'Flow', domain: 'calendar', controlKind: 'radio', values: TOKEN_FLOW },
	{
		key: 'interaction',
		label: 'Interaction',
		domain: 'workspace',
		controlKind: 'radio',
		values: TOKEN_INTERACTION
	},
	{
		key: 'interaction-feedback',
		label: 'Interaction Feedback',
		domain: 'animation',
		controlKind: 'radio',
		values: INTERACTION_FEEDBACK
	},
	{
		key: 'loading',
		label: 'Loading',
		domain: 'animation',
		controlKind: 'radio',
		values: TOKEN_LOADING
	},
	{
		key: 'sevetity',
		label: 'Sevetity',
		domain: 'workspace',
		controlKind: 'radio',
		values: TOKEN_SEVERITY
	},
	{
		key: 'sort-direction',
		label: 'Sort Direction',
		domain: 'table',
		controlKind: 'radio',
		values: TOKEN_SORT_DIRECTION
	},
	{
		key: 'trigger',
		label: 'Trigger',
		domain: 'layout',
		controlKind: 'radio',
		values: TOKEN_TRIGGER
	}
] satisfies readonly Token[];
