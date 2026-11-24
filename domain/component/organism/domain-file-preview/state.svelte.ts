import { ManagerStoryViewportContext } from '$stylist/theme/class/manager/story-viewport-context';
import type { RecipeDomainFilePreview } from '$stylist/domain/interface/recipe/domain-file-preview';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import type { HtmlNode } from '$stylist/html/type/alias/html-node';
import { createHtmlStoryNode } from '$stylist/html/function/create/html-story-node';
import { serializeHtmlMarkup } from '$stylist/html/function/serialize/html-markup';

import { resolvePreviewSkin } from '$stylist/domain/function/resolve/preview-skin';
import type { ContractPreviewEnvironment } from '$stylist/domain/interface/contract/preview-environment';
import { captureElementImage } from '$stylist/domain/function/capture/element-image';
import { resolveContentArea } from '$stylist/domain/function/resolve/content-area';
import { serializeUnknownError } from '$stylist/domain/function/serialize/unknown-error';
/** Reactive behavior of domain-file-preview; props are read lazily when needed. */
export function createDomainFilePreviewComponentState(
	getProps: () => Pick<
		RecipeDomainFilePreview,
		| 'fileContent'
		| 'storyPreviewComponent'
		| 'previewKind'
		| 'storyDevice'
		| 'storyWidth'
		| 'fullscreen'
		| 'storyPath'
	> & {
		fileContent: Exclude<RecipeDomainFilePreview['fileContent'], undefined>;
		storyPreviewComponent: Exclude<RecipeDomainFilePreview['storyPreviewComponent'], undefined>;
		previewKind: Exclude<RecipeDomainFilePreview['previewKind'], undefined>;
		storyDevice: Exclude<RecipeDomainFilePreview['storyDevice'], undefined>;
		fullscreen: Exclude<RecipeDomainFilePreview['fullscreen'], undefined>;
		storyPath: Exclude<RecipeDomainFilePreview['storyPath'], undefined>;
	}
) {
	const props = $derived(getProps());
	ManagerStoryViewportContext.set(
		() => props['storyDevice'],
		() => props['fullscreen'],
		() => true
	);
	let frame = $state<HTMLIFrameElement>();
	let frameHost = $state<HTMLDivElement>();
	let availableWidth = $state(0);
	let availableHeight = $state(0);
	const viewportWidth = $derived(
		props['storyWidth'] ??
			{ mobile: 375, tablet: 768, desktop: 1440, fullscreen: null }[props['storyDevice']]
	);
	const frameScale = $derived(
		viewportWidth && availableWidth ? Math.min(1, availableWidth / viewportWidth) : 1
	);
	$effect(() => {
		if (!frameHost) return;
		const observer = new ResizeObserver(([entry]) => {
			availableWidth = entry.contentRect.width;
			availableHeight = entry.contentRect.height;
		});
		observer.observe(frameHost);
		return () => observer.disconnect();
	});
	const frameStory = $derived(props['storyPath'].replace(/^\/?src\/lib\//, '').replace(/^\//, ''));
	const frameUrl = $derived(`/preview?story=${encodeURIComponent(frameStory)}`);
	// `index.story.ts`: controls live here, the iframe only renders the component with args.
	const story = $derived(
		props['storyPath'].endsWith('.story.ts')
			? (props['storyPreviewComponent'] as ContractStory)
			: null
	);
	let storyArgs: Record<string, unknown> | undefined;
	let storyContent: readonly HtmlNode[] | undefined;
	let environment = $state<ContractPreviewEnvironment>({});
	const visualHtml = $derived(resolvePreviewSkin(props['storyPath']));
	$effect(() => {
		// Story args are per story. Appearance is a shared explicit environment choice.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		props['storyPath'];
		storyArgs = undefined;
		storyContent = undefined;
	});
	const family = $derived(props['storyPath'].split('/').at(-2) ?? '');
	const storyTitle = $derived(
		story?.title ??
			family
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
	);
	// `/src/lib/html/component/atom/a/index.story.ts` -> `html / atom / a`
	const storyLocation = $derived(
		props['storyPath']
			.replace(/^\/?src\/lib\//, '')
			.split('/')
			.slice(0, -1)
			.filter((part) => part !== 'component')
			.join(' / ')
	);
	let panelOpen = $state(false);
	$effect(() => {
		if (!props['fullscreen']) panelOpen = false;
	});
	let capturing = $state(false);
	let captureError = $state('');
	/** One click: the painted component (not the whole frame) is saved as `<family>.png`. */
	async function takeScreenshot() {
		// Contract canvas first, then the legacy `Story` surface (its own controls stay out).
		const canvas = ['.c-story-canvas', '.component-preview__surface', '.preview-story > *']
			.map((selector) => frame?.contentDocument?.querySelector(selector))
			.find(Boolean);
		if (!canvas || capturing) return;
		capturing = true;
		captureError = '';
		try {
			const blob = await captureElementImage(canvas, resolveContentArea(canvas));
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = `${family || 'story'}.png`;
			link.click();
			setTimeout(() => URL.revokeObjectURL(link.href));
		} catch (error) {
			captureError = `Screenshot failed: ${serializeUnknownError(error).message}`;
		} finally {
			capturing = false;
		}
	}
	// html stories are elements: the HTML tab shows the story tree (context included) as markup.
	const storyMarkup = $derived.by(() => {
		if (!story || !props['storyPath'].includes('/html/component/')) return undefined;
		// Foreign content is supplied by custom render components, not HtmlNode.
		if (family === 'svg' || family === 'math') return undefined;
		const current = story;
		return (args: Record<string, unknown>, content?: readonly HtmlNode[]) => {
			try {
				const node = createHtmlStoryNode(family, current, args, content);
				return node ? serializeHtmlMarkup(node) : null;
			} catch {
				return 'Unable to serialize this content as HTML.';
			}
		};
	});
	// The frame stays transparent until it has the theme and the story painted: no white flash.
	// Readiness belongs to one iframe element: returning from another tab mounts a new frame.
	let readyUrl = $state('');
	let readyFrame = $state<HTMLIFrameElement>();
	const frameReady = $derived(readyUrl === frameUrl && !!frame && readyFrame === frame);
	$effect(() => {
		// Every navigation of the frame starts unready, also when it returns to an earlier story.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		frameUrl;
		readyUrl = '';
	});
	// Loading has two stages (story module, then frame) with a shine each; the second picks up
	// the first one's phase, so a slow load shows one continuous sweep instead of a restart.
	let shineStart = 0;
	let shineEnd = -Infinity;
	let shinesShown = 0;
	const continueShine = (node: HTMLElement) => {
		const now = performance.now();
		if (shinesShown === 0 && now - shineEnd > 100) shineStart = now;
		shinesShown++;
		node.style.setProperty('--shine-elapsed', `${now - shineStart}ms`);
		return () => {
			shinesShown--;
			shineEnd = performance.now();
		};
	};
	function sendArgs(args: Record<string, unknown>, content?: readonly HtmlNode[]) {
		storyArgs = args;
		storyContent = content;
		frame?.contentWindow?.postMessage(
			{ type: 'stylist:story-args', args, content },
			window.location.origin
		);
	}
	function syncFrame() {
		frame?.contentWindow?.postMessage(
			{ type: 'stylist:viewport', device: props['storyDevice'], fullscreen: props['fullscreen'] },
			window.location.origin
		);
		if (storyArgs) sendArgs(storyArgs, storyContent);
		frame?.contentWindow?.postMessage(
			{
				type: 'stylist:preview-environment',
				settings: visualHtml ? $state.snapshot(environment) : { locale: environment.locale }
			},
			window.location.origin
		);
	}
	function receiveFrame(event: MessageEvent) {
		if (event.origin !== window.location.origin || event.source !== frame?.contentWindow) return;
		if (event.data?.type === 'stylist:preview-ready') syncFrame();
		// A late message from the previous document must not mark the next story as ready.
		if (event.data?.type === 'stylist:story-ready' && event.data.story === frameStory) {
			readyUrl = frameUrl;
			readyFrame = frame;
		}
		if (event.data?.type === 'stylist:exit-fullscreen')
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
	}
	$effect(() => {
		// Read only to re-sync the frame when the device or fullscreen mode changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		props['storyDevice'];
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		props['fullscreen'];
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		environment;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		visualHtml;
		syncFrame();
	});
	$effect(() => {
		if (!frame) return;
		const observer = new MutationObserver(syncFrame);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['style', 'class', 'data-theme']
		});
		return () => observer.disconnect();
	});
	const renderedContent = $derived.by(() => {
		if (props['previewKind'] !== 'json') return props['fileContent'];
		try {
			return JSON.stringify(JSON.parse(props['fileContent']), null, 2);
		} catch {
			return props['fileContent'];
		}
	});
	return {
		get frame(): typeof frame {
			return frame;
		},
		set frame(__nextValue: typeof frame) {
			frame = __nextValue;
		},
		get frameHost(): typeof frameHost {
			return frameHost;
		},
		set frameHost(__nextValue: typeof frameHost) {
			frameHost = __nextValue;
		},
		get availableHeight(): typeof availableHeight {
			return availableHeight;
		},
		set availableHeight(__nextValue: typeof availableHeight) {
			availableHeight = __nextValue;
		},
		get viewportWidth(): typeof viewportWidth {
			return viewportWidth;
		},
		get frameScale(): typeof frameScale {
			return frameScale;
		},
		get frameUrl(): typeof frameUrl {
			return frameUrl;
		},
		get story(): typeof story {
			return story;
		},
		get environment(): typeof environment {
			return environment;
		},
		set environment(__nextValue: typeof environment) {
			environment = __nextValue;
		},
		get visualHtml(): typeof visualHtml {
			return visualHtml;
		},
		get storyTitle(): typeof storyTitle {
			return storyTitle;
		},
		get storyLocation(): typeof storyLocation {
			return storyLocation;
		},
		get panelOpen(): typeof panelOpen {
			return panelOpen;
		},
		set panelOpen(__nextValue: typeof panelOpen) {
			panelOpen = __nextValue;
		},
		get capturing(): typeof capturing {
			return capturing;
		},
		set capturing(__nextValue: typeof capturing) {
			capturing = __nextValue;
		},
		get captureError(): typeof captureError {
			return captureError;
		},
		set captureError(__nextValue: typeof captureError) {
			captureError = __nextValue;
		},
		get takeScreenshot(): typeof takeScreenshot {
			return takeScreenshot;
		},
		get storyMarkup(): typeof storyMarkup {
			return storyMarkup;
		},
		get frameReady(): typeof frameReady {
			return frameReady;
		},
		get continueShine(): typeof continueShine {
			return continueShine;
		},
		get sendArgs(): typeof sendArgs {
			return sendArgs;
		},
		get syncFrame(): typeof syncFrame {
			return syncFrame;
		},
		get receiveFrame(): typeof receiveFrame {
			return receiveFrame;
		},
		get renderedContent(): typeof renderedContent {
			return renderedContent;
		}
	};
}
export default createDomainFilePreviewComponentState;
