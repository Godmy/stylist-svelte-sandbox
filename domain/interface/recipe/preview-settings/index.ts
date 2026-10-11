import type { ContractPreviewEnvironment } from '../../contract/preview-environment';

export interface RecipePreviewSettings {
	value: ContractPreviewEnvironment;
	onChange: (value: ContractPreviewEnvironment) => void;
}
