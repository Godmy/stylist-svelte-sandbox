import { expandComponentTree } from '$stylist/domain/function/transform/expand-component-tree';
import type { TypeDomainTreeInput } from '$stylist/domain/type/alias/domain-tree-input';
import type { TypeDomainComponentDescriptor } from '$stylist/domain/type/object/domain-component-descriptor';

export function resolveComponentDescriptor(
	tree: TypeDomainTreeInput,
	entityPath: string
): TypeDomainComponentDescriptor | null {
	const domainName = entityPath.split('/')[0];
	const selected = Array.isArray(tree)
		? tree.filter((node) => node.name === domainName)
		: Object.hasOwn(tree, domainName)
			? { [domainName]: tree[domainName] }
			: {};
	const domain = expandComponentTree(selected)[0];
	if (!domain) return null;
	const componentCluster = domain.clusters.find((cluster) => cluster.name === 'component');
	const joint = componentCluster?.joints.find(
		(joint) =>
			['atom', 'molecule', 'organism', 'template', 'page'].includes(joint.name) &&
			joint.entities.some((entity) => entity.path === entityPath)
	);
	const entity = joint?.entities.find((entity) => entity.path === entityPath);
	if (!entity || !joint) return null;
	const paths = new Set(
		domain.clusters.flatMap((cluster) =>
			cluster.joints.flatMap((joint) =>
				joint.entities.flatMap((entity) => entity.files.map((file) => file.path))
			)
		)
	);
	const existing = (path: string) => (paths.has(path) ? path : undefined);
	const family = entity.name;
	const recipeTypePath = existing(`${domain.name}/interface/recipe/${family}/index.ts`);
	const componentStatePath = existing(`${entity.path}/state.svelte.ts`);
	const stateFunctionPath =
		componentStatePath ??
		existing(`${domain.name}/function/state/${family}/state.svelte.ts`) ??
		existing(`${domain.name}/function/state/${family}/index.ts`);
	// `index.story.ts` is the story; a sibling `index.story.svelte` is then only its render.
	const storyModulePath =
		existing(`${entity.path}/index.story.ts`) ?? existing(`${entity.path}/index.story.svelte`);
	const contractPath = existing(`${domain.name}/interface/contract/${family}/index.ts`);
	const jsonPaths = domain.clusters
		.filter((cluster) => cluster.name === 'data')
		.flatMap((cluster) =>
			cluster.joints
				.filter((joint) => joint.name === 'json')
				.flatMap((joint) =>
					joint.entities.flatMap((entity) =>
						entity.files.filter((file) => file.name.endsWith('.json')).map((file) => file.path)
					)
				)
		)
		.sort();
	const jsonFor = (fragment: string) => {
		const selected = jsonPaths.filter((path) => path.includes(fragment));
		return selected.length ? selected : undefined;
	};
	return {
		entityPath: entity.path,
		domain: domain.name,
		cluster: 'component',
		joint: joint.name as TypeDomainComponentDescriptor['joint'],
		family,
		componentModulePath: existing(`${entity.path}/index.svelte`),
		recipeTypePath,
		stateFunctionPath,
		componentStatePath,
		jsonPaths: jsonPaths.length ? jsonPaths : undefined,
		contractPaths: contractPath ? [contractPath] : undefined,
		interfaceRecipeJsonPaths: jsonFor('/interface/recipe/'),
		constEnumJsonPaths: jsonFor('/const/enum/'),
		constMapJsonPaths: jsonFor('/const/map/'),
		functionStateJsonPaths: jsonFor('/function/state/'),
		functionScriptJsonPaths: jsonFor('/function/script/'),
		controlDefinitionJsonPaths: jsonFor('/control/'),
		hasRecipePipeline: !!recipeTypePath,
		hasStatePipeline: !!stateFunctionPath,
		hasStoryPreview: !!storyModulePath,
		storyModulePath
	};
}
