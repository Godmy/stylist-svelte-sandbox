import type { HTMLAttributes } from 'svelte/elements';
import type { RecipeErrorBoundary } from '$stylist/development/interface/recipe/error-boundary';
export function createErrorBoundaryState(
	getProps: () => RecipeErrorBoundary & HTMLAttributes<HTMLDivElement>
) {
	const props = $derived(getProps());
	const component = $derived(props.component);
	const componentProps = $derived(props.props ?? {});
	const children = $derived(props.children);

	let error = $state<string | null>(null);

	function handleError(event: ErrorEvent) {
		console.error('[RecipeErrorBoundary] Caught error:', event.error);
		error = event.error?.message || 'Unexpected rendering error';
		event.preventDefault();
	}

	function clearError() {
		error = null;
	}

	return {
		get component() {
			return component;
		},
		get componentProps() {
			return componentProps;
		},
		get children() {
			return children;
		},
		get error() {
			return error;
		},
		handleError,
		clearError
	};
}
