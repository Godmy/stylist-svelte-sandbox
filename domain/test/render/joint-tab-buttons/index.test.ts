import { render, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import JointTabButtons from '../../../component/molecule/joint-tab-buttons/index.svelte';

describe('family icon', () => {
	it('shows the fitting registry icon for the selected family', async () => {
		const view = render(JointTabButtons, {
			selectedEntityName: 'split-button',
			activeJoint: 'atom'
		});
		const shell = view.container.querySelector('.entity-icon-shell');
		expect(shell?.getAttribute('title')).toBe('Icon: button');
		await waitFor(() => expect(shell?.querySelector('svg')).toBeTruthy());
	});

	it('leaves the slot empty when nothing fits', () => {
		const view = render(JointTabButtons, { selectedEntityName: 'html-node', activeJoint: 'alias' });
		const shell = view.container.querySelector('.entity-icon-shell');
		expect(shell?.classList.contains('entity-icon-shell--empty')).toBe(true);
		expect(shell?.children.length).toBe(0);
	});
});
