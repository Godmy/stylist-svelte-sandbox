import JointTabButtons from '$stylist/domain/component/molecule/joint-tab-buttons/index.svelte';
import type { RecipeJointTabButtons } from '$stylist/domain/interface/recipe/joint-tab-buttons';
import type { ContractStory } from '$stylist/html/interface/contract/story';
import { JOINT_TOOLBAR_ITEMS } from '$stylist/domain/const/value/joint-toolbar-items';

const root = '/src/lib/dialog/component/organism/dialog';
const files = [
	{ name: 'index.svelte', path: `${root}/index.svelte` },
	{ name: 'index.ts', path: `${root}/index.ts` }
];

/** File tab strip; index.story.svelte keeps the active file and preview mode the callbacks report. */
export default {
	component: JointTabButtons,
	title: 'JointTabButtons',
	description: 'File tab strip with preview mode actions for the domain workspace.',
	args: {
		files,
		markdownFile: { name: 'README.md', path: `${root}/README.md` },
		storyFile: { name: 'index.story.ts', path: `${root}/index.story.ts` },
		selectedEntityName: 'invite-page',
		activeFilePath: files[0].path,
		previewMode: 'file',
		previewKind: 'text',
		activeJoint: 'template',
		hasDependencyPreview: true
	},
	controls: {
		selectedEntityName: { type: 'text' },
		// The preview mode and kind are component-specific unions; no token array matches them.
		previewMode: { type: 'select', options: ['file', 'markdown', 'story', 'json-tree', 'di'] },
		previewKind: { type: 'select', options: ['text', 'json', 'svg'] },
		activeJoint: { type: 'select', options: JOINT_TOOLBAR_ITEMS.map((item) => item.name) },
		hasDependencyPreview: { type: 'boolean' }
	},
	presets: {
		Markdown: { previewMode: 'markdown' },
		'Without extras': { markdownFile: null, storyFile: null, hasDependencyPreview: false }
	}
} satisfies ContractStory<RecipeJointTabButtons>;
