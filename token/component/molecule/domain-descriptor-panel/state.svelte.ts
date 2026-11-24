import { L6_TOKEN_DEFINITIONS } from '$stylist/token/const/object/orbit-control-definition';
import type { RecipeDomainDescriptorPanel } from '$stylist/token/interface/recipe/domain-descriptor-panel';
import type { TypeDomainComponentProjection } from '$stylist/domain/type/object/domain-component-projection';
/** Reactive behavior of domain-descriptor-panel; props are read lazily when needed. */
export function createDomainDescriptorPanelComponentState(
	getProps: () => Pick<RecipeDomainDescriptorPanel, 'descriptor'>
) {
	type DescriptorMode = 'architecture' | 'information' | 'interaction' | 'controls' | 'contracts';

	const props = $derived(getProps());
	const modeLabels: Record<DescriptorMode, string> = {
		architecture: 'Architecture',
		information: 'Information',
		interaction: 'Interaction',
		controls: 'Controls',
		contracts: 'Contracts'
	};
	const architectureNodes = [
		{
			id: 'component-size',
			icon: 'component-size',
			label: 'Component Size',
			definition: L6_TOKEN_DEFINITIONS['component-size']
		},
		{
			id: 'animations',
			icon: 'animations',
			label: 'Animations',
			definition: L6_TOKEN_DEFINITIONS.animations
		}
	];
	const informationNodes = [
		{
			id: 'style',
			icon: 'style',
			label: 'Style',
			definition: L6_TOKEN_DEFINITIONS.style
		},
		{
			id: 'variants',
			icon: 'variants',
			label: 'Variants',
			definition: L6_TOKEN_DEFINITIONS.variants
		},
		{
			id: 'text-element',
			icon: 'text-element',
			label: 'Text Element',
			definition: L6_TOKEN_DEFINITIONS['text-element']
		}
	];
	const interactionNodes = [
		{
			id: 'controls',
			icon: 'controls',
			label: 'Controls',
			definition: L6_TOKEN_DEFINITIONS.controls
		},
		{
			id: 'state',
			icon: 'state',
			label: 'State',
			definition: L6_TOKEN_DEFINITIONS.state
		}
	];
	let activeMode = $state<DescriptorMode>('architecture');
	let projection = $state<TypeDomainComponentProjection | null>(null);
	let projectionLoading = $state(false);
	let projectionError = $state('');
	const descriptorEntityPath = $derived(props['descriptor'].entityPath);
	function stringifyPreview(value: unknown): string {
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return String(value);
		}
	}
	function slicePreview(value: unknown): string {
		const text = stringifyPreview(value);
		return text.length > 360 ? `${text.slice(0, 360)}...` : text;
	}
	function readObjectField(value: unknown, key: string): string | null {
		if (typeof value !== 'object' || value === null || !(key in value)) {
			return null;
		}

		const fieldValue = (value as Record<string, unknown>)[key];
		return fieldValue == null ? null : String(fieldValue);
	}
	const architectureRows = $derived(
		projection
			? [
					{ label: 'Recipe', value: projection.architecture.recipeTypePath ?? 'missing' },
					{ label: 'State', value: projection.architecture.stateFunctionPath ?? 'missing' },
					{ label: 'Component', value: projection.architecture.componentModulePath ?? 'missing' },
					{
						label: 'Contracts',
						value: projection.architecture.contractPaths.length
							? projection.architecture.contractPaths.join('\n')
							: 'none'
					}
				]
			: []
	);
	const architecturePipeline = $derived(
		projection
			? [
					{
						label: 'Recipe',
						value: projection.architecture.recipeTypePath,
						kind: 'contract'
					},
					{
						label: 'State',
						value: projection.architecture.stateFunctionPath,
						kind: 'runtime'
					},
					{
						label: 'Component',
						value: projection.architecture.componentModulePath,
						kind: 'render'
					}
				]
			: []
	);
	const informationGroups = $derived(
		projection
			? [
					{ label: 'Recipe JSON', items: projection.information.recipeJson },
					{ label: 'Enum JSON', items: projection.information.enumJson },
					{ label: 'Map JSON', items: projection.information.mapJson }
				]
			: []
	);
	const interactionRows = $derived(
		projection
			? [
					{
						label: 'State pipeline',
						value: projection.interaction.hasStatePipeline ? 'available' : 'missing'
					},
					{ label: 'Story module', value: projection.interaction.storyModulePath ?? 'missing' },
					{ label: 'State JSON count', value: String(projection.interaction.stateJson.length) }
				]
			: []
	);
	const controlPreviews = $derived(projection?.controls.controlJson ?? []);
	const controlCards = $derived(
		controlPreviews.map((control, index) => ({
			title: readObjectField(control, 'id') ?? `Control #${index + 1}`,
			kind: readObjectField(control, 'controlKind') ?? 'unknown',
			tokenName: readObjectField(control, 'tokenName') ?? 'unknown',
			taxonomy:
				readObjectField(control, 'functionalTaxonomy') ??
				readObjectField(control, 'taxonomy') ??
				'unknown',
			preview: slicePreview(control)
		}))
	);
	const contractFiles = $derived(projection?.contracts.files ?? []);
	async function loadProjection(): Promise<void> {
		projectionLoading = true;
		projectionError = '';

		try {
			const response = await fetch(
				`/api/descriptor?entityPath=${encodeURIComponent(props['descriptor'].entityPath)}`
			);
			if (!response.ok) {
				throw new Error(`Descriptor request failed with ${response.status}`);
			}

			projection = (await response.json()) as TypeDomainComponentProjection;
		} catch (error) {
			projectionError = error instanceof Error ? error.message : String(error);
		} finally {
			projectionLoading = false;
		}
	}
	$effect(() => {
		// Read only to re-run the projection when the descriptor path changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		descriptorEntityPath;
		projection = null;
		projectionError = '';
		void loadProjection();
	});
	return {
		get modeLabels(): typeof modeLabels {
			return modeLabels;
		},
		get architectureNodes(): typeof architectureNodes {
			return architectureNodes;
		},
		get informationNodes(): typeof informationNodes {
			return informationNodes;
		},
		get interactionNodes(): typeof interactionNodes {
			return interactionNodes;
		},
		get activeMode(): typeof activeMode {
			return activeMode;
		},
		set activeMode(__nextValue: typeof activeMode) {
			activeMode = __nextValue;
		},
		get projection(): typeof projection {
			return projection;
		},
		set projection(__nextValue: typeof projection) {
			projection = __nextValue;
		},
		get projectionLoading(): typeof projectionLoading {
			return projectionLoading;
		},
		set projectionLoading(__nextValue: typeof projectionLoading) {
			projectionLoading = __nextValue;
		},
		get projectionError(): typeof projectionError {
			return projectionError;
		},
		set projectionError(__nextValue: typeof projectionError) {
			projectionError = __nextValue;
		},
		get slicePreview(): typeof slicePreview {
			return slicePreview;
		},
		get architectureRows(): typeof architectureRows {
			return architectureRows;
		},
		get architecturePipeline(): typeof architecturePipeline {
			return architecturePipeline;
		},
		get informationGroups(): typeof informationGroups {
			return informationGroups;
		},
		get interactionRows(): typeof interactionRows {
			return interactionRows;
		},
		get controlCards(): typeof controlCards {
			return controlCards;
		},
		get contractFiles(): typeof contractFiles {
			return contractFiles;
		}
	};
}
export default createDomainDescriptorPanelComponentState;
