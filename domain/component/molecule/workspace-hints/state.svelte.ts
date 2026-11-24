import { onMount } from 'svelte';
import type { RecipeWorkspaceHints } from '$stylist/domain/interface/recipe/workspace-hints';
/** Reactive behavior of workspace-hints; props are read lazily when needed. */
export function createWorkspaceHintsComponentState(
	getProps: () => Pick<RecipeWorkspaceHints, 'root'> & {
		root: Exclude<RecipeWorkspaceHints['root'], undefined>;
	} & { __id: string }
) {
	const props = $derived(getProps());
	let hint = $state('');
	let left = $state(0);
	let top = $state(0);
	let tooltip = $state<HTMLDivElement>();
	let anchor: HTMLElement | null = null;
	let originalDescription: string | null = null;
	function restoreAnchor() {
		if (anchor) {
			if (originalDescription === null) anchor.removeAttribute('aria-describedby');
			else anchor.setAttribute('aria-describedby', originalDescription);
		}
		anchor = null;
	}
	function hide() {
		restoreAnchor();
		hint = '';
	}
	function show(target: EventTarget | null) {
		const element =
			target instanceof Element
				? target.closest<HTMLElement>('[data-hint], button[aria-label], a[aria-label]')
				: null;
		if (!element?.closest(props['root']) || element.closest('[inert]')) {
			hide();
			return;
		}
		if (element === anchor) return;
		hide();
		anchor = element;
		hint = element.dataset.hint || element.getAttribute('aria-label') || '';
		originalDescription = element.getAttribute('aria-describedby');
		element.setAttribute(
			'aria-describedby',
			[originalDescription, props.__id].filter(Boolean).join(' ')
		);
	}
	$effect(() => {
		if (!hint || !tooltip || !anchor) return;
		const rect = anchor.getBoundingClientRect();
		const width = tooltip.offsetWidth;
		const height = tooltip.offsetHeight;
		const vertical = !!anchor.closest('.module-toolbar, .c-icon-toolbar.vertical');
		left = Math.max(
			8,
			Math.min(
				vertical ? rect.right + 10 : rect.left + rect.width / 2 - width / 2,
				window.innerWidth - width - 8
			)
		);
		top = Math.max(
			8,
			Math.min(
				rect.bottom + 8 + height > window.innerHeight
					? rect.top - height - 8
					: vertical
						? rect.top + (rect.height - height) / 2
						: rect.bottom + 8,
				window.innerHeight - height - 8
			)
		);
	});
	onMount(() => {
		let mounted = true;
		// What convert() changed, restored on unmount; an element converted twice restores its last title.
		const converted: [HTMLElement, string][] = [];
		const iconTitles: [SVGTitleElement, Node][] = [];
		const convert = () => {
			// SVG title elements trigger native tooltips independently of HTML title attributes.
			// Controls already get their accessible name and styled hint from the button/link.
			for (const title of document.querySelectorAll<SVGTitleElement>(
				`${props['root']} button svg title, ${props['root']} a svg title, ${props['root']} svg[aria-hidden="true"] title`
			)) {
				if (title.parentNode) iconTitles.push([title, title.parentNode]);
				title.remove();
			}
			for (const element of document.querySelectorAll<HTMLElement>(`${props['root']} [title]`)) {
				const title = element.getAttribute('title');
				if (!title) continue;
				converted.push([element, title]);
				element.dataset.hint = title;
				element.removeAttribute('title');
			}
		};
		convert();
		const observer = new MutationObserver(() => {
			convert();
			if (anchor) hint = anchor.dataset.hint || anchor.getAttribute('aria-label') || '';
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['title', 'data-hint', 'aria-label']
		});
		const over = (event: PointerEvent) => {
			if (event.pointerType !== 'touch') show(event.target);
		};
		const out = (event: PointerEvent) => {
			if (!anchor?.contains(event.relatedTarget as Node | null)) hide();
		};
		const focus = (event: FocusEvent) => show(event.target);
		// Removing a focused node can dispatch focusout during a Svelte render.
		const blur = () =>
			queueMicrotask(() => {
				if (mounted) hide();
			});
		const key = (event: KeyboardEvent) => {
			if (event.key === 'Escape') hide();
		};
		document.addEventListener('pointerover', over);
		document.addEventListener('pointerout', out);
		document.addEventListener('focusin', focus);
		document.addEventListener('focusout', blur);
		document.addEventListener('pointerdown', hide);
		document.addEventListener('keydown', key);
		window.addEventListener('scroll', hide, true);
		window.addEventListener('resize', hide);
		return () => {
			mounted = false;
			restoreAnchor();
			observer.disconnect();
			document.removeEventListener('pointerover', over);
			document.removeEventListener('pointerout', out);
			document.removeEventListener('focusin', focus);
			document.removeEventListener('focusout', blur);
			document.removeEventListener('pointerdown', hide);
			document.removeEventListener('keydown', key);
			window.removeEventListener('scroll', hide, true);
			window.removeEventListener('resize', hide);
			for (const [element, title] of converted) {
				element.setAttribute('title', title);
				delete element.dataset.hint;
			}
			for (const [title, parent] of iconTitles) parent.appendChild(title);
		};
	});
	return {
		get hint(): typeof hint {
			return hint;
		},
		set hint(__nextValue: typeof hint) {
			hint = __nextValue;
		},
		get left(): typeof left {
			return left;
		},
		set left(__nextValue: typeof left) {
			left = __nextValue;
		},
		get top(): typeof top {
			return top;
		},
		set top(__nextValue: typeof top) {
			top = __nextValue;
		},
		get tooltip(): typeof tooltip {
			return tooltip;
		},
		set tooltip(__nextValue: typeof tooltip) {
			tooltip = __nextValue;
		}
	};
}
export default createWorkspaceHintsComponentState;
