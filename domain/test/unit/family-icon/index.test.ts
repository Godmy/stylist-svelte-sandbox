import { describe, expect, it } from 'vitest';
import { resolveFamilyIcon } from '$stylist/domain/function/resolve/family-icon';

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

	it('leaves the slot empty instead of using generic or leading words', () => {
		expect(resolveFamilyIcon('line-type', hasIcon)).toBeNull();
		expect(resolveFamilyIcon('html-node', hasIcon)).toBeNull();
		expect(resolveFamilyIcon('', hasIcon)).toBeNull();
	});
});
