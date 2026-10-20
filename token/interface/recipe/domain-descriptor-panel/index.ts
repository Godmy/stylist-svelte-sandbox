import type { TypeDomainComponentDescriptor } from '$stylist/domain/type/object/domain-component-descriptor';

/** Orbit panel that summarizes the projection of one component descriptor. */
export interface RecipeDomainDescriptorPanel {
	descriptor: TypeDomainComponentDescriptor;
	class?: string;
}
