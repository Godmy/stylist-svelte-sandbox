import type { TokenComponentType } from '$stylist/development/type/alias/component-type';
import type { PageBuilderButtonAttributes as SlotPageBuilderButtonAttributes } from '$stylist/development/interface/slot/page-builder-button-attributes';
import type { PageBuilderElement as SlotPageBuilderElement } from '$stylist/development/interface/slot/page-builder-element';
import type { PageBuilderHeadingAttributes as SlotPageBuilderHeadingAttributes } from '$stylist/development/interface/slot/page-builder-heading-attributes';
import type { PageBuilderImageAttributes as SlotPageBuilderImageAttributes } from '$stylist/development/interface/slot/page-builder-image-attributes';
import type { PageBuilderTextAttributes as SlotPageBuilderTextAttributes } from '$stylist/development/interface/slot/page-builder-text-attributes';

export class PageBuilderManager {
	static getDefaultContent(type: TokenComponentType): string {
		switch (type) {
			case 'text':
				return 'Add your text here...';
			case 'heading':
				return 'Heading';
			case 'button':
				return 'Click me';
			default:
				return '';
		}
	}

	static getDefaultAttributes(type: TokenComponentType): SlotPageBuilderElement['attributes'] {
		switch (type) {
			case 'text':
				return {
					FONT_SIZE: '16px',
					color: 'var(--color-text-primary)'
				} as SlotPageBuilderTextAttributes;
			case 'heading':
				return {
					level: 2,
					FONT_SIZE: '32px',
					color: 'var(--color-text-primary)'
				} as SlotPageBuilderHeadingAttributes;
			case 'button':
				return {
					backgroundColor: 'var(--color-primary-500)',
					color: 'var(--color-text-inverse)',
					padding: 'var(--space-2) var(--space-4)'
				} as SlotPageBuilderButtonAttributes;
			case 'image':
				return {
					src: '',
					alt: 'Image',
					width: 640,
					height: 360
				} as SlotPageBuilderImageAttributes;
			case 'divider':
				return { color: 'var(--color-border-primary)' } as SlotPageBuilderElement['attributes'];
			case 'container':
				return {
					backgroundColor: 'var(--color-background-primary)',
					padding: 'var(--space-4)',
					margin: 'var(--space-2)',
					BORDER_RADIUS: 'var(--radius-1-5)'
				} as SlotPageBuilderElement['attributes'];
			default:
				return {};
		}
	}

	static renderElement(element: SlotPageBuilderElement): string {
		switch (element.type) {
			case 'text': {
				const attrs = element.attributes as SlotPageBuilderTextAttributes | undefined;
				return `<p style="font-size:${attrs?.FONT_SIZE ?? 'var(--font-size-4)'};color:${attrs?.color ?? 'var(--color-text-primary)'};">${element.content ?? ''}</p>`;
			}
			case 'heading': {
				const attrs = element.attributes as SlotPageBuilderHeadingAttributes | undefined;
				const level = Math.min(Math.max(attrs?.level ?? 2, 1), 6);
				return `<h${level} style="font-size:${attrs?.FONT_SIZE ?? 'var(--font-size-8)'};color:${attrs?.color ?? 'var(--color-text-primary)'};">${element.content ?? ''}</h${level}>`;
			}
			case 'button': {
				const attrs = element.attributes as SlotPageBuilderButtonAttributes | undefined;
				return `<button style="background-color:${attrs?.backgroundColor ?? 'var(--color-primary-500)'};color:${attrs?.color ?? 'var(--color-text-inverse)'};padding:${attrs?.padding ?? 'var(--space-2) var(--space-4)'};border:none;border-radius: var(--radius-1-5);cursor:pointer;">${element.content ?? ''}</button>`;
			}
			case 'divider':
				return '<hr style="border:0;border-top:1px solid var(--color-border-primary);margin: var(--space-4) 0;" />';
			case 'image': {
				const attrs = element.attributes as SlotPageBuilderImageAttributes | undefined;
				return `<img src="${attrs?.src ?? ''}" alt="${attrs?.alt ?? 'Image'}" style="width:${attrs?.width == null ? '100%' : `${attrs.width}px`};height:${attrs?.height == null ? 'auto' : `${attrs.height}px`};" />`;
			}
			default:
				return `<div>${element.content ?? ''}</div>`;
		}
	}
}
