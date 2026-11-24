import type { DomainFileMetric } from '$stylist/domain/type/object/domain-file-metric';
import type { DomainFileComponentMetric } from '$stylist/domain/type/object/domain-file-component-metric';
import type { RecipeDomainFileDomainGrid } from '$stylist/domain/interface/recipe/domain-file-domain-grid';
/** Reactive behavior of domain-file-domain-grid; props are read lazily when needed. */
export function createDomainFileDomainGridComponentState(
	getProps: () => Pick<RecipeDomainFileDomainGrid, 'domains'>
) {
	const props = $derived(getProps());
	const componentLabels: Record<keyof DomainFileComponentMetric, string> = {
		atoms: 'Atoms',
		molecules: 'Molecules',
		organisms: 'Organisms',
		templates: 'Templates',
		pages: 'Pages'
	};
	const componentKeys = Object.keys(componentLabels) as (keyof DomainFileComponentMetric)[];
	const maxDomainFiles = $derived(
		Math.max(1, ...props['domains'].map((domain) => domain.fileCount))
	);
	function formatDomainName(value: string): string {
		return value
			.split('-')
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}
	function getPercentage(value: number, max: number): number {
		return max <= 0 ? 0 : Math.round((value / max) * 100);
	}
	function getMaxJointCount(domain: DomainFileMetric): number {
		return Math.max(
			1,
			...domain.clusters.flatMap((cluster) => cluster.joints.map((joint) => joint.entityCount))
		);
	}
	return {
		get componentLabels(): typeof componentLabels {
			return componentLabels;
		},
		get componentKeys(): typeof componentKeys {
			return componentKeys;
		},
		get maxDomainFiles(): typeof maxDomainFiles {
			return maxDomainFiles;
		},
		get formatDomainName(): typeof formatDomainName {
			return formatDomainName;
		},
		get getPercentage(): typeof getPercentage {
			return getPercentage;
		},
		get getMaxJointCount(): typeof getMaxJointCount {
			return getMaxJointCount;
		}
	};
}
export default createDomainFileDomainGridComponentState;
