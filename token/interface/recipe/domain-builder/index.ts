import type { TypeDomainComponentDescriptor } from '$stylist/domain/type/object/domain-component-descriptor';

/** Page builder over the domain tree: domains, clusters, joints, entities and their files. */
export interface RecipeDomainBuilder {
	tree?: {
		name: string;
		clusters: {
			name: string;
			joints: {
				name: string;
				entities: {
					name: string;
					path: string;
					files: { name: string; path: string }[];
				}[];
			}[];
		}[];
	}[];
	descriptors?: TypeDomainComponentDescriptor[];
	class?: string;
}
