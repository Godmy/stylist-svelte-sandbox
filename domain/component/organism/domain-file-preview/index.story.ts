import DomainFilePreview from './index.svelte';
import type { RecipeDomainFilePreview } from '$stylist/domain/interface/recipe/domain-file-preview';
import type { ContractStory } from '$stylist/html/interface/contract/story';

const dependencyItems = [
	{ key: 'domain\\function\\state\\domain-page', depth: 1 },
	{ key: 'svg\\component\\atom\\icon', depth: 1 },
	{ key: 'svg\\const\\record\\icon-registry', depth: 2 }
];

/** File preview panel of the sandbox explorer. */
export default {
	component: DomainFilePreview,
	title: 'DomainFilePreview',
	description: 'File preview panel for raw text, markdown, story, JSON tree, and SVG content.',
	args: {
		previewMode: 'file',
		previewKind: 'text',
		dependencyItems,
		dependencyTreeNodes: [
			{
				id: 'domain\\function\\state\\domain-page',
				label: 'domain\\function\\state\\domain-page',
				expanded: true
			},
			{
				id: 'svg\\component\\atom\\icon',
				label: 'svg\\component\\atom\\icon',
				expanded: true,
				children: [
					{
						id: 'svg\\const\\record\\icon-registry',
						label: 'svg\\const\\record\\icon-registry'
					}
				]
			}
		],
		selectedDependencyKey: dependencyItems[0].key,
		selectedDependencyFiles: [
			{
				name: 'index.ts',
				content:
					"import type { TypeDomainFile } from '$stylist/domain/type/object/domain-file';\n\nexport type TypeDomainEntity = {\n\tname: string;\n\tpath: string;\n\tfiles: TypeDomainFile[];\n};\n"
			}
		]
	},
	controls: {
		previewMode: { type: 'select', options: ['file', 'markdown', 'story', 'json-tree', 'di'] },
		previewKind: { type: 'select', options: ['text', 'json', 'svg'] }
	},
	presets: {
		Markdown: { previewMode: 'markdown' },
		Svg: { previewKind: 'svg' },
		'Json tree': { previewMode: 'json-tree', previewKind: 'json' },
		Dependencies: { previewMode: 'di' }
	}
} satisfies ContractStory<RecipeDomainFilePreview>;
