import { untrack } from 'svelte';
import type { TokenControlDefinition } from '$stylist/token/type/object/token-control-definition';
import type { TokenTokenValue as TokenValue } from '$stylist/design-token/type/alias/token-value';
import type { RecipeTokenSetting } from '$stylist/token/interface/recipe/token-setting';
/** Reactive behavior of token-setting; props are read lazily when needed. */
export function createTokenSettingComponentState(
	getProps: () => Pick<RecipeTokenSetting, 'definition' | 'value' | 'showTokenDetails' | 'onChange'>
) {
	const props = $derived(getProps());
	const architectureSvgs = import.meta.glob<string>('/src/lib/architecture/data/svg/*.svg', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
	const informationSvgs = import.meta.glob<string>('/src/lib/information/data/svg/*.svg', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
	function normalizeSlug(input: string): string {
		return input
			.toLowerCase()
			.replace(/\[[^\]]*]/g, '')
			.replace(/_/g, '-')
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/--+/g, '-')
			.replace(/^-|-$/g, '');
	}
	function mapSvgByName(source: Record<string, string>): Record<string, string> {
		const out: Record<string, string> = {};
		for (const [path, svg] of Object.entries(source)) {
			const fileName = path.split('/').pop() ?? '';
			const iconName = fileName.replace(/\.svg$/i, '');
			out[normalizeSlug(iconName)] = svg;
		}
		return out;
	}
	const svgByDomain = {
		architecture: mapSvgByName(architectureSvgs),
		information: mapSvgByName(informationSvgs)
	} as const;
	const svgByNameGlobal: Record<string, string> = {
		...svgByDomain.architecture,
		...svgByDomain.information
	};
	const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;
	function resolveIconSvg(def: TokenControlDefinition): string {
		const local =
			svgByDomain[def.functionalTaxonomy as keyof typeof svgByDomain] ?? svgByNameGlobal;
		const candidates = [normalizeSlug(def.tokenFile), normalizeSlug(def.tokenName)].filter(
			(name, index, arr) => name.length > 0 && arr.indexOf(name) === index
		);

		for (const candidate of candidates) {
			if (local[candidate]) return local[candidate];
		}
		for (const candidate of candidates) {
			if (svgByNameGlobal[candidate]) return svgByNameGlobal[candidate];
		}
		return fallbackSvg;
	}
	function decorateSvg(svg: string): string {
		return svg.replace('<svg', '<svg class="token-setting-molecule__icon-svg" aria-hidden="true"');
	}
	function firstOptionValue(def: TokenControlDefinition): TokenValue {
		if (def.controlKind === 'radio' || def.controlKind === 'select') {
			return def.options[0]?.value ?? '';
		}
		if (def.controlKind === 'range') {
			return def.min;
		}
		return typeof def.defaultValue === 'string' ? def.defaultValue : '';
	}
	let internalValue = $state<TokenValue>(
		untrack(
			() =>
				props['value'] ?? props['definition'].defaultValue ?? firstOptionValue(props['definition'])
		)
	);
	let dataOnlyOpened = $state(false);
	$effect(() => {
		if (props['value'] !== undefined && props['value'] !== internalValue) {
			internalValue = props['value'];
		}
	});
	$effect(() => {
		if (props['showTokenDetails'] && dataOnlyOpened) {
			dataOnlyOpened = false;
		}
	});
	function setValue(next: TokenValue): void {
		internalValue = next;
		props['onChange']?.(next);
	}
	function onIconClick(): void {
		if (props['showTokenDetails']) return;
		dataOnlyOpened = !dataOnlyOpened;
	}
	const iconMarkup = $derived.by(() => decorateSvg(resolveIconSvg(props['definition'])));
	const panelVisible = $derived.by(() => props['showTokenDetails'] || dataOnlyOpened);
	return {
		get internalValue(): typeof internalValue {
			return internalValue;
		},
		set internalValue(__nextValue: typeof internalValue) {
			internalValue = __nextValue;
		},
		get setValue(): typeof setValue {
			return setValue;
		},
		get onIconClick(): typeof onIconClick {
			return onIconClick;
		},
		get iconMarkup(): typeof iconMarkup {
			return iconMarkup;
		},
		get panelVisible(): typeof panelVisible {
			return panelVisible;
		}
	};
}
export default createTokenSettingComponentState;
