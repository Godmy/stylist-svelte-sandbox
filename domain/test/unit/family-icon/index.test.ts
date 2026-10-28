import { describe, expect, it } from 'vitest';
import { resolveFamilyIcon } from '$stylist/domain/function/resolve/family-icon';
import { FAMILY_ICON } from '$stylist/domain/const/record/family-icon';
import { isIconName } from '$stylist/svg/function/check/icon-name';

describe('resolveFamilyIcon', () => {
	const icons = new Set(['button', 'input', 'file-item', 'card', 'idef-zero', 'html', 'type']);
	const hasIcon = (name: string) => icons.has(name);

	it('prefers the hand-picked table, then the exact name', () => {
		expect(resolveFamilyIcon('idef0', hasIcon)).toBe('idef-zero');
		expect(resolveFamilyIcon('button', hasIcon)).toBe('button');
		expect(resolveFamilyIcon('SplitButton', hasIcon)).toBe('button');
	});

	it('drops a role suffix, then uses the trailing head word', () => {
		expect(resolveFamilyIcon('file-item-type', hasIcon)).toBe('file-item');
		expect(resolveFamilyIcon('range-input', hasIcon)).toBe('input');
		expect(resolveFamilyIcon('round-summary-card', hasIcon)).toBe('card');
	});

	it('finds meaningful leading and interior phrases', () => {
		expect(resolveFamilyIcon('button-composed', hasIcon)).toBe('button');
		expect(resolveFamilyIcon('compact-file-item-toolbar', hasIcon)).toBe('file-item');
		expect(resolveFamilyIcon('idef0-decomposition', hasIcon)).toBe('idef-zero');
		expect(resolveFamilyIcon('button-state-options', hasIcon)).toBe('button');
	});

	it('uses only whole words and keeps unknown or generic names empty', () => {
		expect(resolveFamilyIcon('line-type', hasIcon)).toBeNull();
		expect(resolveFamilyIcon('html-node', hasIcon)).toBeNull();
		expect(resolveFamilyIcon('cardinal', hasIcon)).toBeNull();
		expect(resolveFamilyIcon('unmapped-widget', hasIcon)).toBeNull();
		expect(resolveFamilyIcon('constructor', hasIcon)).toBeNull();
		expect(resolveFamilyIcon('', hasIcon)).toBeNull();
	});

	it('does not return an alias whose SVG is unavailable', () => {
		expect(resolveFamilyIcon('a', () => false)).toBeNull();
		expect(resolveFamilyIcon('date-picker', (name) => name === 'date-picker')).toBe('date-picker');
	});

	it('keeps exact names and longer phrases ahead of individual words', () => {
		const has = (name: string) => new Set(['file', 'file-browser', 'browser', 'button']).has(name);
		expect(resolveFamilyIcon('file-browser-button', has)).toBe('file-browser');
		expect(resolveFamilyIcon('file-browser', has)).toBe('file-browser');
	});

	it.each([
		['a', 'link'],
		['HTMLInputElement', 'input'],
		['button-composed', 'button'],
		['input-checkbox', 'check-circle'],
		['file-explorer', 'file-browser'],
		['chart-legend-band', 'legend-item'],
		['date-time-range-picker', 'calendar'],
		['idef0-decomposition', 'idef-zero'],
		['tea-cart-items', 'cart-summary'],
		['mathml-mfrac', 'mathml']
	])('resolves %s to an existing SVG (%s)', (family, icon) => {
		expect(resolveFamilyIcon(family, isIconName)).toBe(icon);
	});

	it('references an existing SVG for every semantic alias', () => {
		for (const [family, icon] of Object.entries(FAMILY_ICON)) {
			expect(isIconName(icon), `${family} -> ${icon}`).toBe(true);
		}
	});
});
