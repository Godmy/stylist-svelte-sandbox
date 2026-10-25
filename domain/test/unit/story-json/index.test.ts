import { describe, expect, it } from 'vitest';
import { transformStoryJson } from '$stylist/domain/function/transform/story-json';

describe('transformStoryJson', () => {
	it('parses arrays, objects and tuples', () => {
		expect(transformStoryJson('[{"id":"a"}]')).toEqual({ ok: true, value: [{ id: 'a' }] });
		expect(transformStoryJson('{"brand":"Acme","links":[]}')).toEqual({
			ok: true,
			value: { brand: 'Acme', links: [] }
		});
		expect(transformStoryJson('[["a","b"]]', [['', '']])).toEqual({
			ok: true,
			value: [['a', 'b']]
		});
	});

	it('clears the arg on empty text', () => {
		expect(transformStoryJson('  \n')).toEqual({ ok: true, value: undefined });
	});

	it('rejects invalid JSON with the parser message', () => {
		const result = transformStoryJson('[{"id": }]');
		expect(result.ok).toBe(false);
		expect(!result.ok && result.error).toBeTruthy();
	});

	it('checks the kind of the example and of its items', () => {
		expect(transformStoryJson('{"id":"a"}', [{ id: '' }])).toEqual({
			ok: false,
			error: 'Expected array, got object'
		});
		expect(transformStoryJson('[{"id":"a"}, "b"]', [{ id: '' }])).toEqual({
			ok: false,
			error: 'Item 1: expected object, got string'
		});
		expect(transformStoryJson('null', { brand: '' })).toEqual({
			ok: false,
			error: 'Expected object, got null'
		});
		expect(transformStoryJson('[]', [{ id: '' }])).toEqual({ ok: true, value: [] });
		expect(transformStoryJson('["a", {"title":"b"}]', ['', { title: '' }])).toEqual({
			ok: true,
			value: ['a', { title: 'b' }]
		});
		expect(transformStoryJson('[1]', ['', { title: '' }])).toEqual({
			ok: false,
			error: 'Item 0: expected string or object, got number'
		});
	});
});
