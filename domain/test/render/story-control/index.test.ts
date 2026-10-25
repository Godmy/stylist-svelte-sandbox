import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ChartLegend from '$stylist/chart/component/molecule/chart-legend/index.svelte';
import ChartLegendStory from '$stylist/chart/component/molecule/chart-legend/index.story';
import StoryControl from '$stylist/domain/component/atom/story-control/index.svelte';
import StoryControls from '$stylist/domain/component/molecule/story-controls/index.svelte';

const control = { type: 'json', label: 'Items', example: [{ id: '' }] } as const;

describe('json story control', () => {
	it('applies valid JSON and keeps an invalid draft with its error', async () => {
		const onChange = vi.fn();
		render(StoryControl, { name: 'items', control, value: [{ id: 'a' }], onChange });
		const field = screen.getByLabelText('Items') as HTMLTextAreaElement;
		expect(JSON.parse(field.value)).toEqual([{ id: 'a' }]);

		await fireEvent.input(field, { target: { value: '[{"id": ' } });
		expect(onChange).not.toHaveBeenCalled();
		expect(field.getAttribute('aria-invalid')).toBe('true');
		expect(
			document.getElementById(field.getAttribute('aria-describedby')!)?.textContent
		).toBeTruthy();
		expect(field.value).toBe('[{"id": ');

		await fireEvent.input(field, { target: { value: '{"id": "b"}' } });
		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByText('Expected array, got object')).toBeTruthy();

		await fireEvent.input(field, { target: { value: '[{"id": "b"}]' } });
		expect(onChange).toHaveBeenLastCalledWith([{ id: 'b' }]);
		expect(field.hasAttribute('aria-invalid')).toBe(false);
	});

	it('replaces the draft when the value changes outside', async () => {
		const { rerender } = render(StoryControl, { name: 'items', control, value: [{ id: 'a' }] });
		const field = screen.getByLabelText('Items') as HTMLTextAreaElement;
		await fireEvent.input(field, { target: { value: 'oops' } });
		await rerender({ name: 'items', control, value: [{ id: 'reset' }] });
		expect(JSON.parse(field.value)).toEqual([{ id: 'reset' }]);
		expect(field.hasAttribute('aria-invalid')).toBe(false);
	});

	it('updates the component args of a story', async () => {
		const onChange = vi.fn();
		render(StoryControls, { story: ChartLegendStory, onChange });
		const items = [{ id: 'g', name: 'Edited series', color: '#000000' }];
		await fireEvent.input(screen.getByLabelText('items'), {
			target: { value: JSON.stringify(items) }
		});
		const [args] = onChange.mock.calls.at(-1)!;
		expect(args.items).toEqual(items);
		expect(() => structuredClone(args)).not.toThrow();

		render(ChartLegend, { items: args.items });
		expect(screen.getByText('Edited series')).toBeTruthy();
	});
});
