import { normalizeDomainTree } from '$stylist/domain/function/transform/normalize-domain-tree';
import { resolveFilePreset } from '$stylist/domain/function/resolve/file-preset';
import { resolveTreeFamilies } from '$stylist/domain/function/resolve/tree-families';
import type { TypeDomainTreeInput } from '$stylist/domain/type/alias/domain-tree-input';

export function expandComponentTree(tree: TypeDomainTreeInput) {
	const interfaceJointOrder = ['behavior', 'slot', 'recipe'];
	return normalizeDomainTree(tree).map((domain) => ({
		name: domain.name,
		clusters: (domain.cluster ?? domain.clusters ?? [])
			.map((cluster) => ({
				name: cluster.name,
				joints: (cluster.joint ?? cluster.joints ?? [])
					.map((joint) => ({
						name: joint.name,
						entities: resolveTreeFamilies(joint).map((entity) => {
							const path =
								entity.path ?? `${domain.name}/${cluster.name}/${joint.name}/${entity.name}`;
							const files = new Map(
								(entity.files ?? []).map((file) => [
									file.name,
									{
										name: file.name,
										path: file.path ?? `${path}/${file.name}`
									}
								])
							);
							const keys = [
								entity.preset,
								cluster.name === 'component' ? entity.component_type : undefined,
								entity.code,
								entity.svg
							];
							for (const key of keys) {
								if (!key) continue;
								for (const name of resolveFilePreset(key).files) {
									if (!files.has(name)) files.set(name, { name, path: `${path}/${name}` });
								}
							}
							return {
								...entity,
								path,
								files: [...files.values()].sort((a, b) =>
									a.name < b.name ? -1 : a.name > b.name ? 1 : 0
								)
							};
						})
					}))
					.filter((joint) => joint.entities.length > 0)
					.sort((a, b) => {
						if (cluster.name !== 'interface') return 0;
						const aIndex = interfaceJointOrder.indexOf(a.name);
						const bIndex = interfaceJointOrder.indexOf(b.name);
						return (
							(aIndex < 0 ? interfaceJointOrder.length : aIndex) -
							(bIndex < 0 ? interfaceJointOrder.length : bIndex)
						);
					})
			}))
			.filter((cluster) => cluster.joints.length > 0)
	}));
}
