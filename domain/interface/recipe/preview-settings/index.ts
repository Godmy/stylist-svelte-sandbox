import type { ContractPreviewEnvironment } from '$stylist/domain/interface/contract/preview-environment';

export interface RecipePreviewSettings {
	value: ContractPreviewEnvironment;
	onChange: (value: ContractPreviewEnvironment) => void;
	/** Skin, theme, font and density controls; without them only the language is shown. */
	appearance?: boolean;
}
