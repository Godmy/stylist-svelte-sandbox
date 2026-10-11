import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveModuleGroup } from '../../../function/resolve/module-group';

describe('resolveModuleGroup', () => {
	/** Vitest runs from the package root. */
	const registry = JSON.parse(readFileSync(resolve('modules.json'), 'utf8')) as Record<
		string,
		{ path?: string; domains: string[] }
	>;
	const all = Object.values(registry).flatMap((entry) => entry.domains);

	it('puts nested repositories inside their top-level module', () => {
		const groups = resolveModuleGroup(registry, all);
		const byName = Object.fromEntries(groups.map((group) => [group.name, group.domains]));
		expect(groups.map((group) => group.name)).toEqual([
			'design-system',
			'interaction',
			'information',
			'business',
			'customer',
			'architecture',
			'sandbox',
			'management',
			'global',
			'prototype'
		]);
		expect(byName.prototype).toEqual(['presentation', 'scratch']);
		expect(byName.global).toEqual(['commerce', 'product', 'geo']);
		expect(byName.business).toEqual(
			expect.arrayContaining(['booking', 'tea-commerce', 'wbd', 'spanish', 'farm'])
		);
	});

	it('drops modules without available domains', () => {
		const groups = resolveModuleGroup(registry, ['button', 'theme']);
		expect(groups).toEqual([
			{ name: 'design-system', domains: ['theme'] },
			{ name: 'interaction', domains: ['button'] }
		]);
	});
});
