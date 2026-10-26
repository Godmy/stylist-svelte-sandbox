import type { SlotDomainEntity } from '$stylist/domain/interface/slot/domain-entity';
export interface RecipeDomainSidebar {
	activeDomain?: string;
	activeCluster?: string;
	activeJoint?: string;
	availableDomains?: readonly string[];
	availableClusters?: readonly string[];
	availableJoints?: readonly string[];
	entities?: SlotDomainEntity[];
	activeEntityPath?: string;
	draggableEntities?: boolean;
	onDomainSelect?: (name: string) => void;
	onClusterSelect?: (name: string) => void;
	onJointSelect?: (name: string) => void;
	onEntitySelect?: (path: string) => void;
	onEntityAdd?: (path: string) => void;
	onEntityDragStart?: (entity: SlotDomainEntity, event: DragEvent) => void;
	class?: string;
}
