import type { TypeFile } from '$stylist/domain/type/alias/file';

export const PRESET_FILE = {
	ANIMATION_LEGACY_NOTICES: { type: 'data', files: ["images-carousel-zoom.md","svelte-tilt-LICENSE.md","svelte-tilt.md"] },
	AUTH_LEGACY_NOTICES: { type: 'data', files: ["sveltekit-auth-starter-LICENSE.md"] },
	DEMO_LEGACY_NOTICES: { type: 'data', files: ["CopeTube-LICENSE.md","Vontigo-LICENSE.md","c2c-pay-com-LICENSE.md","caasa-LICENSE.md","cms-frontend-LICENSE.md","editable-website-LICENSE.md","finances-LICENSE.md","kantina-LICENSE.md","netcore-svelte-saas-kit-LICENSE.md","portfolio-LICENSE.md","primo-LICENSE.md","restaurant-orders-management-LICENSE.md","svelte-saas-kit-LICENSE.md","sveltekit-LICENSE.md","sveltekit-typescript-vanilla-extract-starter-LICENSE.md","trpc-sveltekit-example-LICENSE.md","unding-LICENSE.md"] },
	DEMO_SOURCE_CONTEXT: { type: 'data', files: ["c2c-pay-com-local-changes.md","c2c-pay-ru-current-layout.md"] },
	FILE_LEGACY_NOTICES: { type: 'data', files: ["MyStorage-LICENSE.md"] },
	GEO_LEGACY_NOTICES: { type: 'data', files: ["chs-map-LICENSE.md","svelte-mapbox-LICENSE.md"] },
	MENU_LEGACY_NOTICES: { type: 'data', files: ["components-svelte-LICENSE.md"] },
	PROTOTYPE_SCHOOL_LEGACY_NOTICES: { type: 'data', files: ["2024-sba-LICENSE.md","Flexi-LICENSE.md","LibreHomework-LICENSE.md","dever-generator-LICENSE.md","huntabyte.com-admin-LICENSE.md"] },
	PROTOTYPE_SCHOOL_LESSON_PLANNING_PROMPTS: { type: 'data', files: ["chqcompetition.md"] },
	PROTOTYPE_SHOP_LEGACY_NOTICES: { type: 'data', files: ["svelte-commerce-LICENSE.md"] },
	TREEJS_LEGACY_NOTICES: { type: 'data', files: ["three-0.180.0-LICENSE.md","threejs-webgl-planet-for-production-LICENSE.md"] },
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
	DEFINED_REACTIVE_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.ts', 'index.svelte', 'index.ts', 'state.svelte.ts']
	},
	DEFINED_RENDERED_REACTIVE_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.story.ts', 'index.svelte', 'index.ts', 'state.svelte.ts']
	},
	DOCUMENTED_DEFINED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.ts', 'index.svelte', 'index.ts', 'readme.md']
	},
	DOCUMENTED_DEFINED_REACTIVE_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.ts', 'index.svelte', 'index.ts', 'readme.md', 'state.svelte.ts']
	},
	DOCUMENTED_DEFINED_RENDERED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.story.ts', 'index.svelte', 'index.ts', 'readme.md']
	},
	DOCUMENTED_DEFINED_RENDERED_REACTIVE_STORY_COMPONENT: {
		type: 'component',
		files: [
			'index.story.svelte',
			'index.story.ts',
			'index.svelte',
			'index.ts',
			'readme.md',
			'state.svelte.ts'
		]
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
	TESTED_DEFINED_RENDERED_STORY_COMPONENT: {
		type: 'component',
		files: ['index.story.svelte', 'index.story.ts', 'index.svelte', 'index.test.ts', 'index.ts']
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
		files: ['concentric-circles.frag', 'hyperspace.frag', 'interference-field.frag', 'turtle-dissolve.frag']
	},
	FULL_SCREEN_VERTEX_SHADER: { type: 'shader', files: ['full-screen.vert'] },
	MODULE_ICONS: {
		type: 'image',
		files: [
			'admin.svg',
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
