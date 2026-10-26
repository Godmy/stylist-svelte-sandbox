import { cleanup, fireEvent, render, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ClusterToolbar from '$stylist/domain/component/molecule/cluster-toolbar/index.svelte';
import JointToolbar from '$stylist/domain/component/molecule/joint-toolbar/index.svelte';
import { expandComponentTree } from '$stylist/domain/function/transform/expand-component-tree';
import type { TypeDomainTree } from '$stylist/domain/type/object/domain-tree';
import type { TypeDomainTreeInput } from '$stylist/domain/type/alias/domain-tree-input';
import manifest from '$stylist/domain/data/json/domain-page-manifest/index.json';

afterEach(cleanup);

describe('manifest taxonomy navigation', () => {
	it('orders interface joints as behavior, slot, recipe before the remaining joints', () => {
		const tree = expandComponentTree({
			svg: {
				interface: {
					contract: { boundary: 'INDEXED_INTERFACE' },
					recipe: { assembled: 'INDEXED_INTERFACE' },
					slot: { content: 'INDEXED_INTERFACE' },
					behavior: { capability: 'INDEXED_INTERFACE' }
				}
			}
		});
		expect(tree[0].clusters[0].joints.map((joint) => joint.name)).toEqual([
			'behavior',
			'slot',
			'recipe',
			'contract'
		]);
	});

	it.each<{ format: string; input: TypeDomainTreeInput }>([
		{
			format: 'compact manifest',
			input: {
				svg: {
					component: {},
					function: { resolve: {} },
					data: { json: {}, icon: { kept: 'INDEX_SVG' }, flag: {} }
				},
				empty: { data: { icon: {} } }
			}
		},
		{
			format: 'legacy tree',
			input: [
				{
					name: 'svg',
					clusters: [
						{ name: 'component' },
						{ name: 'function', joints: [] },
						{ name: 'type', joints: [{ name: 'alias', entities: [] }] },
						{
							name: 'data',
							joints: [
								{ name: 'json', family: [] },
								{ name: 'icon', entities: [{ name: 'kept', svg: 'INDEX_SVG' }] },
								{ name: 'flag' }
							]
						}
					]
				},
				{ name: 'empty', clusters: [{ name: 'data', joints: [{ name: 'icon' }] }] }
			]
		}
	])('hides empty joints and clusters in $format', async ({ input }) => {
		const tree = expandComponentTree(input);
		expect(tree[0].clusters.map((cluster) => cluster.name)).toEqual(['data']);
		expect(tree[0].clusters[0].joints.map((joint) => joint.name)).toEqual(['icon']);
		expect(tree[0].clusters[0].joints[0].entities[0].files).toEqual([
			{ name: 'index.svg', path: 'svg/data/icon/kept/index.svg' }
		]);
		expect(tree[1].clusters).toEqual([]);

		const clusters = render(ClusterToolbar, {
			availableClusters: tree[0].clusters.map((cluster) => cluster.name)
		});
		const joints = render(JointToolbar, {
			availableJoints: tree[0].clusters[0].joints.map((joint) => joint.name)
		});
		expect(clusters.container.querySelectorAll('button')).toHaveLength(1);
		expect(joints.container.querySelectorAll('button')).toHaveLength(1);
		expect(within(clusters.container).getByRole('button', { name: 'data' })).toBeTruthy();
		expect(within(joints.container).getByRole('button', { name: 'icon' })).toBeTruthy();
		await clusters.rerender({ availableClusters: tree[1].clusters.map((cluster) => cluster.name) });
		await joints.rerender({ availableJoints: [] });
		expect(clusters.container.querySelectorAll('button')).toHaveLength(0);
		expect(joints.container.querySelectorAll('button')).toHaveLength(0);
	});

	it('makes every cluster and joint in the current manifest selectable', async () => {
		const tree = expandComponentTree(manifest.tree as TypeDomainTree);
		const onClusterSelect = vi.fn();
		const onJointSelect = vi.fn();
		const clusters = render(ClusterToolbar, { availableClusters: [], onSelect: onClusterSelect });
		const joints = render(JointToolbar, { availableJoints: [], onSelect: onJointSelect });

		const clusterNames = [...new Set(tree.flatMap((domain) => domain.clusters.map((c) => c.name)))];
		await clusters.rerender({ availableClusters: clusterNames });
		expect(clusters.container.querySelectorAll('button')).toHaveLength(clusterNames.length);
		for (const name of clusterNames) {
			await fireEvent.click(within(clusters.container).getByRole('button', { name }));
			expect(onClusterSelect).toHaveBeenLastCalledWith(name);
			const jointNames = [
				...new Set(
					tree.flatMap((domain) =>
						domain.clusters
							.filter((cluster) => cluster.name === name)
							.flatMap((cluster) => cluster.joints.map((joint) => joint.name))
					)
				)
			];
			await joints.rerender({ availableJoints: jointNames });
			expect(joints.container.querySelectorAll('button')).toHaveLength(jointNames.length);
			for (const joint of jointNames) {
				await fireEvent.click(within(joints.container).getByRole('button', { name: joint }));
				expect(onJointSelect).toHaveBeenLastCalledWith(joint);
			}
		}
	});

	it('shows SVG icon and future tree entries, and clears buttons for empty selections', async () => {
		const clusters = render(ClusterToolbar, {
			availableClusters: ['data', 'test', 'custom-cluster']
		});
		const joints = render(JointToolbar, { availableJoints: Object.keys(manifest.tree.svg.data) });
		expect(joints.getByRole('button', { name: 'icon' })).toBeTruthy();
		expect(clusters.getByRole('button', { name: 'test' })).toBeTruthy();
		expect(clusters.getByRole('button', { name: 'custom-cluster' })).toBeTruthy();

		await joints.rerender({ availableJoints: ['custom-joint'], active: 'custom-joint' });
		expect(joints.getByRole('button', { name: 'custom-joint' }).getAttribute('aria-current')).toBe(
			'page'
		);
		expect(joints.queryByRole('button', { name: 'icon' })).toBeNull();
		await clusters.rerender({ availableClusters: [] });
		await joints.rerender({ availableJoints: [] });
		expect(clusters.container.querySelectorAll('button')).toHaveLength(0);
		expect(joints.container.querySelectorAll('button')).toHaveLength(0);
		expect(clusters.getByText('no clusters')).toBeTruthy();
		expect(joints.getByText('no joints')).toBeTruthy();
	});
});
