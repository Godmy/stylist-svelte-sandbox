import { describe, expect, it } from 'vitest';
import { resolveStoryControls } from '$stylist/domain/function/resolve/story-controls';
import type { ContractStory } from '$stylist/html/interface/contract/story';

const component = (() => {}) as unknown as ContractStory['component'];

describe('resolveStoryControls', () => {
	it('infers a control from the value of every arg without one', () => {
		const items = [{ id: 'a' }];
		const nav = { brand: 'Acme', links: [] };
		expect(
			resolveStoryControls({
				component,
				args: { label: 'Go', count: 2, open: true, items, nav }
			})
		).toEqual([
			{ name: 'label', control: { type: 'text' }, auto: true },
			{ name: 'count', control: { type: 'number' }, auto: true },
			{ name: 'open', control: { type: 'boolean' }, auto: true },
			{ name: 'items', control: { type: 'json', example: items }, auto: true },
			{ name: 'nav', control: { type: 'json', example: nav }, auto: true }
		]);
	});

	it('keeps the story controls first and over the inferred ones', () => {
		const controls = resolveStoryControls({
			component,
			args: { size: 'md', label: 'Go' },
			controls: { size: { type: 'select', options: ['sm', 'md'] } }
		});
		expect(controls.map(({ name, control, auto }) => [name, control.type, auto])).toEqual([
			['size', 'select', false],
			['label', 'text', true]
		]);
	});

	it('skips functions, snippets, class instances, nullish values and hidden args', () => {
		expect(
			resolveStoryControls({
				component,
				args: {
					onClick: () => {},
					children: (() => {}) as unknown,
					date: new Date(0),
					empty: null,
					missing: undefined,
					hidden: 'x'
				} as Record<string, unknown>,
				controls: { hidden: undefined }
			})
		).toEqual([]);
	});

	it('takes args that only presets set', () => {
		expect(
			resolveStoryControls({ component, args: {}, presets: { Error: { error: 'Required' } } })
		).toEqual([{ name: 'error', control: { type: 'text' }, auto: true }]);
	});
});
