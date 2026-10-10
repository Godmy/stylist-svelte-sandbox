import { normalizeDomainTree } from '$stylist/domain/function/transform/normalize-domain-tree';
import { resolveFilePreset } from '$stylist/domain/function/resolve/file-preset';
import { resolveTreeFamilies } from '$stylist/domain/function/resolve/tree-families';
import type { TypeDomainTreeInput } from '$stylist/domain/type/alias/domain-tree-input';

export function countDomainStories(tree: TypeDomainTreeInput): number {
	let count = 0;
	for (const domain of normalizeDomainTree(tree))
		for (const cluster of domain.cluster ?? domain.clusters ?? []) {
			if (cluster.name !== 'component') continue;
			for (const joint of cluster.joint ?? cluster.joints ?? []) {
				if (!['atom', 'molecule', 'organism', 'template', 'page'].includes(joint.name)) continue;
				for (const entity of resolveTreeFamilies(joint)) {
					const explicit = entity.files?.some((file) => file.name.startsWith('index.story.'));
					const key = entity.preset ?? entity.component_type;
					const preset =
						key && resolveFilePreset(key).files.some((name) => name.startsWith('index.story.'));
					if (explicit || preset) count += 1;
				}
			}
		}
	return count;
}
