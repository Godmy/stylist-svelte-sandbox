import type { HTMLAttributes } from 'svelte/elements';
import type { RecipeEnhancedExportPanel } from '$stylist/development/interface/recipe/enhanced-export-panel';
export function createEnhancedExportPanelState(
	getProps: () => RecipeEnhancedExportPanel & HTMLAttributes<HTMLDivElement>
) {
	const props = $derived(getProps());
	const componentName = $derived(props.componentName ?? '');
	const svelteCode = $derived(props.svelteCode ?? '');
	const componentProps = $derived(props.props ?? {});

	let copySuccess = $state(false);
	let npmCopySuccess = $state(false);

	const currentCode = $derived(svelteCode);

	const resolvedComponentName = $derived(componentName || 'Component');
	const appContent = $derived.by(() => {
		const openTag = '<';
		const closeTag = ' />';
		const scriptClose = '<' + '/script>';
		return (
			'<script>\n' +
			`  import ${resolvedComponentName} from './${resolvedComponentName}.svelte';\n` +
			scriptClose +
			'\n\n' +
			openTag +
			resolvedComponentName +
			closeTag
		);
	});

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(currentCode);
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function downloadCode() {
		const blob = new Blob([currentCode], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${componentName || 'component'}.svelte`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function copyNpmCommand() {
		const command = 'npm install @stylist-svelte/components';
		try {
			await navigator.clipboard.writeText(command);
			npmCopySuccess = true;
			setTimeout(() => {
				npmCopySuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function openInCodeSandbox() {
		const parameters = {
			files: {
				'package.json': {
					content: { dependencies: { svelte: 'latest', '@stylist-svelte/components': 'latest' } }
				},
				[`${componentName || 'Component'}.svelte`]: { content: currentCode },
				'App.svelte': { content: appContent }
			}
		};
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = 'https://codesandbox.io/api/v1/sandboxes/define';
		form.target = '_blank';
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'parameters';
		input.value = JSON.stringify(parameters);
		form.appendChild(input);
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}

	function openInStackBlitz() {
		const url = `https://stackblitz.com/fork/svelte?file=${componentName || 'Component'}.svelte`;
		window.open(url, '_blank');
	}

	return {
		get componentName() {
			return componentName;
		},
		get svelteCode() {
			return svelteCode;
		},
		get componentProps() {
			return componentProps;
		},
		get currentCode() {
			return currentCode;
		},
		get copySuccess() {
			return copySuccess;
		},
		get npmCopySuccess() {
			return npmCopySuccess;
		},
		get appContent() {
			return appContent;
		},
		copyCode,
		downloadCode,
		copyNpmCommand,
		openInCodeSandbox,
		openInStackBlitz
	};
}
