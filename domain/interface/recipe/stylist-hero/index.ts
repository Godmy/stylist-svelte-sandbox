import type { AiModelInfo } from '$stylist/domain/type/object/ai-model-info';
export interface RecipeStylistHero {
	title?: string;
	subtitle?: string;
	subtitleAccent?: string;
	description?: string;
	badgeLabel?: string;
	badgeHref?: string;
	sponsorLabel?: string;
	sponsorHref?: string;
	poweredByLabel?: string;
	creditNote?: string;
	rootDomainCount?: number;
	storyModuleCount?: number;
	aiModels?: AiModelInfo[];
	class?: string;
}
