import { describe, expect, it } from 'vitest';
import { highlightCode } from '$stylist/development/function/transform/code-highlight';

describe('highlightCode', () => {
	const sourceText = (html: string) =>
		html
			.replace(/<span style="[^"]*">|<\/span>/g, '')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&');

	it('preserves source text, whitespace and incomplete markup', () => {
		for (const language of ['svelte', 'html', 'css', 'unknown']) {
			for (const code of [
				'',
				'<',
				'{',
				'<input title="',
				'&lt; & < >\r\n\t',
				'<button onclick={() => count++}>{count}</button>',
				'{#if value > 0}<p>{"}"}</p>{/if}',
				'<!-- comment -->\n<style>p { color: #fff; }</style>',
				'<script lang="ts">let count = $state(0); // comment\n</script>',
				'/* unfinished comment',
				'{ /* } */ value }'
			]) {
				expect(sourceText(highlightCode(code, language))).toBe(code);
			}
		}
	});

	it('escapes executable HTML and existing entities in every language', () => {
		const code = '<img src=x onerror="alert(1)"><script>alert(1)</script>&lt;';
		for (const language of ['svelte', 'html', 'css', 'unknown']) {
			const html = highlightCode(code, language);
			expect(html).not.toMatch(/<(?:img|script)\b/);
			expect(html).toContain('&amp;lt;');
			expect(sourceText(html)).toBe(code);
		}
	});

	it('highlights embedded scripts, styles, Svelte blocks and runes', () => {
		const html = highlightCode(
			'<script>let count = $state(0);</script>\n' +
				'{#if count}<button class="active">{count}</button>{/if}\n' +
				'<style>button { color: #fff; }</style>'
		);
		for (const kind of ['tag', 'attribute', 'string', 'keyword', 'number']) {
			expect(html).toContain(`--code-${kind}`);
		}
		expect(html).toMatch(/--code-keyword[^>]*>\$state<\/span>/);
	});

	it('highlights CSS comments and properties and leaves unsupported languages as text', () => {
		const css = highlightCode('/* color */ .card { padding: 12px; color: #fff; }', 'CSS');
		expect(css).toContain('--code-comment');
		expect(css).toMatch(/--code-attribute[^>]*>padding<\/span>/);
		expect(css).toMatch(/--code-number[^>]*>12px<\/span>/);
		expect(highlightCode('<div>&', 'unknown')).toBe('&lt;div&gt;&amp;');
	});
});
