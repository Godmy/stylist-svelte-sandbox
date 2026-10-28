/** Local-only controls for selecting component feedback. */
export interface RecipeComponentFeedback {
	mode: 'card' | 'panel';
	storyId?: string;
	componentName?: string;
	feedback: {
		readonly count: number;
		readonly expanded: boolean;
		readonly kind: string;
		readonly note: string;
		readonly paths: string;
		readonly status: string;
		readonly error: string;
		isSelected(id: string): boolean;
		toggle(id: string): void;
		togglePanel(): void;
		setKind(value: string): void;
		setNote(value: string): void;
		clear(): void;
		copy(): Promise<void>;
	};
}
