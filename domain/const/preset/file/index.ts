import type { TypeFile } from '$stylist/domain/type/alias/file';

export const PRESET_FILE = {
	INDEXED_COMPONENT: { type: 'component', files: ['index.svelte', 'index.ts'] },
	INDEXED_REACTIVE_COMPONENT: {
		type: 'component',
		files: ['index.svelte', 'index.ts', 'state.svelte.ts']
	},
	INDEXED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.svelte', 'index.ts']
	},
	INDEXED_REACTIVE_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.svelte', 'index.ts', 'state.svelte.ts']
	},
	DOCUMENTED_INDEXED_COMPONENT: {
		type: 'component',
		files: ['index.svelte', 'index.ts', 'readme.md']
	},
	DOCUMENTED_INDEXED_REACTIVE_COMPONENT: {
		type: 'component',
		files: ['index.svelte', 'index.ts', 'readme.md', 'state.svelte.ts']
	},
	DOCUMENTED_INDEXED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.svelte', 'index.ts', 'readme.md']
	},
	DOCUMENTED_INDEXED_REACTIVE_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.svelte', 'index.ts', 'readme.md', 'state.svelte.ts']
	},
	STORY_COMPONENT: { type: 'component', files: ['index.story.svelte'] },
	DEFINED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.ts', 'index.svelte', 'index.ts']
	},
	DEFINED_RENDERED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.story.ts', 'index.svelte', 'index.ts']
	},
	INDEX_CODE: { type: 'code', files: ['index.ts'] },
	INDEX_BARREL: { type: 'barrel', files: ['index.ts'] },
	INDEXED_CLASS: { type: 'class', files: ['index.ts'] },
	INDEXED_TYPE: { type: 'type', files: ['index.ts'] },
	INDEXED_INTERFACE: { type: 'interface', files: ['index.ts'] },
	INDEXED_CONST: { type: 'const', files: ['index.ts'] },
	INDEXED_FUNCTION: { type: 'function', files: ['index.ts'] },
	FUNCTION_TEST: { type: 'function', files: ['index.test.ts'] },
	INDEX_SVG: { type: 'svg', files: ['index.svg'] },
	REACTIVE_BARREL: { type: 'barrel', files: ['index.svelte.ts', 'index.ts'] },
	TESTED_INDEXED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.svelte', 'index.test.ts', 'index.ts']
	},
	SCHEMA_MARKDOWN: { type: 'markdown', files: ['schema.md'] },
	DATA_MARKDOWN: { type: 'data', files: ['index.md'] },
	INDEX_STYLESHEET: { type: 'stylesheet', files: ['index.css'] },
	INDEX_JSON: { type: 'json', files: ['index.json'] },
	LANDING_IMAGE: { type: 'image', files: ['2026-09-17-otono.jpg'] },
	LANDING_MARKDOWN: { type: 'markdown', files: ['2026-09-17-otono.md'] },
	PRODUCT_IMAGES: { type: 'image', files: ['logo.png', 'picture.png'] },
	GRAPH_FRAGMENT_SHADERS: {
		type: 'shader',
		files: ['base.frag', 'edge.frag', 'instanced.frag', 'particle.frag', 'phong.frag']
	},
	GRAPH_VERTEX_SHADERS: {
		type: 'shader',
		files: ['base.vert', 'edge.vert', 'instanced.vert', 'particle.vert', 'skinned.vert']
	},
	WEBGL_FRAGMENT_SHADERS: {
		type: 'shader',
		files: ['concentric-circles.frag', 'hyperspace.frag', 'turtle-dissolve.frag']
	},
	FULL_SCREEN_VERTEX_SHADER: { type: 'shader', files: ['full-screen.vert'] },
	MODULE_ICONS: {
		type: 'image',
		files: [
			'architecture.svg',
			'business.svg',
			'customer.svg',
			'default.svg',
			'design-system.svg',
			'farm.svg',
			'geo.svg',
			'global.svg',
			'information.svg',
			'interaction.svg',
			'management.svg',
			'prototype.svg',
			'sandbox.svg',
			'spanish.svg',
			'travel.svg',
			'wbd.svg'
		]
	}
} as const satisfies Record<string, { type: string; files: readonly TypeFile[] }>;
