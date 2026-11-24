import type { RecipeDomainSidebar } from '$stylist/domain/interface/recipe/domain-sidebar';
import { resolveModuleGroup } from '$stylist/domain/function/resolve/module-group';
/** Reactive behavior of domain-sidebar; props are read lazily when needed. */
export function createDomainSidebarComponentState(
	getProps: () => Pick<RecipeDomainSidebar, 'activeDomain' | 'availableDomains'> & {
		availableDomains: Exclude<RecipeDomainSidebar['availableDomains'], undefined>;
	}
) {
	const props = $derived(getProps());
	const registries = import.meta.glob('/modules.json', {
		eager: true,
		import: 'default'
	}) as Record<string, Record<string, { path?: string; domains: string[] }>>;
	const moduleIcons = import.meta.glob('../../../data/icon/module/*.svg', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
	const modules = $derived(
		resolveModuleGroup(registries['/modules.json'] ?? {}, props['availableDomains'])
	);
	const activeModule = $derived(
		modules.find((entry) => entry.domains.includes(props['activeDomain'] ?? ''))?.name
	);
	const visibleDomains = $derived(
		modules.find((entry) => entry.name === activeModule)?.domains ?? props['availableDomains']
	);
	return {
		get moduleIcons(): typeof moduleIcons {
			return moduleIcons;
		},
		get modules(): typeof modules {
			return modules;
		},
		get activeModule(): typeof activeModule {
			return activeModule;
		},
		get visibleDomains(): typeof visibleDomains {
			return visibleDomains;
		}
	};
}
export default createDomainSidebarComponentState;
