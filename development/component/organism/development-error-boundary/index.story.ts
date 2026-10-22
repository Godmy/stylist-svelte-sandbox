import DevelopmentErrorBoundary from '$stylist/development/component/organism/development-error-boundary/index.svelte';
import type { RecipeDevelopmentErrorBoundary } from '$stylist/development/interface/recipe/development-error-boundary';
import type { ContractStory } from '$stylist/html/interface/contract/story';

/** Development error boundary; index.story.svelte supplies the children and a crash trigger. */
export default {
	component: DevelopmentErrorBoundary,
	title: 'DevelopmentErrorBoundary',
	description: 'Interactive error boundary with customizable options.',
	args: {
		showDetails: true,
		showReload: true,
		showCopyError: true,
		showReportIssue: true,
		title: 'Something went wrong',
		message: 'An unexpected error occurred. Our team has been notified.',
		reportUrl: 'https://github.com/issues'
	},
	controls: {
		showDetails: { type: 'boolean' },
		showReload: { type: 'boolean' },
		showCopyError: { type: 'boolean' },
		showReportIssue: { type: 'boolean' },
		title: { type: 'text' },
		message: { type: 'text' },
		reportUrl: { type: 'text' }
	}
} satisfies ContractStory<RecipeDevelopmentErrorBoundary>;
