import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PrivacySettings from '$stylist/development/component/molecule/privacy-settings/index.svelte';

describe('privacy settings reactivity', () => {
	it('updates the switch after local edits without mutating props, and follows later settings', async () => {
		const settings = [
			{ id: 'analytics', label: 'Analytics', description: 'Usage statistics', enabled: true }
		];
		const { rerender } = render(PrivacySettings, { settings });
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
		await fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(false);
		expect(settings[0].enabled).toBe(true);
		await fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
		await rerender({ settings: [{ ...settings[0], enabled: false }] });
		expect(checkbox.checked).toBe(false);
	});
});
