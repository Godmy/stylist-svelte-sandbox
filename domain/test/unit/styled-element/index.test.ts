import { afterEach, describe, expect, it } from 'vitest';
import { cloneStyledElement } from '../../../function/clone/styled-element';

describe('cloneStyledElement', () => {
	afterEach(() => document.body.replaceChildren());

	it('inlines computed styles and keeps form state, without scripts or styles', async () => {
		document.body.innerHTML = `
			<style>.box { color: rgb(255, 0, 0); display: flex; }</style>
			<div class="box">
				<script>window.leak = true</script>
				<input value="initial" type="text" />
				<input type="checkbox" />
				<textarea>initial</textarea>
				<select><option>one</option><option>two</option></select>
				<svg viewBox="0 0 1 1"><style>rect { fill: red }</style><rect width="1" height="1" /></svg>
			</div>`;
		const box = document.querySelector('.box') as HTMLDivElement;
		(box.querySelector('input[type="text"]') as HTMLInputElement).value = 'typed';
		(box.querySelector('input[type="checkbox"]') as HTMLInputElement).checked = true;
		(box.querySelector('textarea') as HTMLTextAreaElement).value = 'edited';
		(box.querySelector('select') as HTMLSelectElement).selectedIndex = 1;

		const clone = await cloneStyledElement(box);

		expect(clone).not.toBe(box);
		expect(clone.getAttribute('style')).toContain('color:rgb(255, 0, 0)');
		expect(clone.getAttribute('style')).toContain('display:flex');
		expect(clone.querySelector('script')).toBeNull();
		expect(clone.querySelector('style')).toBeNull();
		expect(clone.querySelector('rect')).toBeTruthy();
		expect(clone.querySelector('input[type="text"]')?.getAttribute('value')).toBe('typed');
		expect(clone.querySelector('input[type="checkbox"]')?.hasAttribute('checked')).toBe(true);
		expect(clone.querySelector('textarea')?.textContent).toBe('edited');
		expect(clone.querySelectorAll('option')[1].hasAttribute('selected')).toBe(true);
		expect(clone.querySelectorAll('option')[0].hasAttribute('selected')).toBe(false);
	});

	it('turns a canvas into an image of its pixels', async () => {
		const canvas = document.createElement('canvas');
		canvas.toDataURL = () => 'data:image/png;base64,AAAA';
		document.body.append(canvas);
		const clone = await cloneStyledElement(canvas);
		expect(clone.tagName).toBe('IMG');
		expect(clone.getAttribute('src')).toBe('data:image/png;base64,AAAA');
	});
});
