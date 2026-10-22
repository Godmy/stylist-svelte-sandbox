import type { ContractPreviewEnvironment } from '$stylist/domain/interface/contract/preview-environment';

export interface RecipePreviewSettings {
	value: ContractPreviewEnvironment;
	onChange: (value: ContractPreviewEnvironment) => void;
}
