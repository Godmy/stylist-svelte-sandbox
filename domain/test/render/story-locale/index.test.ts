import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import StoryCanvas from '$stylist/domain/component/molecule/story-canvas/index.svelte';
import PreviewSettings from '$stylist/domain/component/molecule/preview-settings/index.svelte';
import story from '$stylist/localization/component/molecule/locale-preview/index.story';

afterEach(() => cleanup());

describe('story language', () => {
	it('renders stories in English by default', () => {
		const { container } = render(StoryCanvas, { props: { story } });
		expect(container.textContent).toContain('3 files selected');
	});

	it('wraps the story in LocaleProvider without the skin environment', () => {
		const { container } = render(StoryCanvas, { props: { story, locale: 'ru' } });
		expect(container.textContent).toContain('Выбрано 3 файла');
		expect(container.querySelector('[lang="ru"]')).not.toBeNull();
	});

	it('takes the language from the skin environment too', () => {
		const { container } = render(StoryCanvas, {
			props: { story, environment: { locale: 'he' } }
		});
		expect(container.querySelector('[dir="rtl"]')).not.toBeNull();
	});

	it('shows only the language control outside skinned domains', () => {
		const panel = render(PreviewSettings, {
			props: { value: {}, appearance: false, onChange: () => {} }
		});
		const labels = [...panel.container.querySelectorAll('label')].map((label) =>
			label.textContent?.trim()
		);
		expect(labels.some((label) => label?.includes('Language'))).toBe(true);
		expect(labels.some((label) => label?.includes('Density'))).toBe(false);
	});
});
