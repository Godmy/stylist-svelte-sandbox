<script lang="ts">
	import SamoArchitectureCompare from '$stylist/domain/component/molecule/samo-architecture-compare/index.svelte';
	import SamoAssemblyPipeline from '$stylist/domain/component/molecule/samo-assembly-pipeline/index.svelte';
	import SamoMorphologyBox from '$stylist/domain/component/molecule/samo-morphology-box/index.svelte';
	import SamoNestedMethods from '$stylist/domain/component/molecule/samo-nested-methods/index.svelte';
	import SamoOverview from '$stylist/domain/component/molecule/samo-overview/index.svelte';
	import SamoPractice from '$stylist/domain/component/molecule/samo-practice/index.svelte';
	import SamoSolidGrid from '$stylist/domain/component/molecule/samo-solid-grid/index.svelte';
	import type { RecipeSamoMethodology } from '$stylist/domain/interface/recipe/samo-methodology';

	let {
		navLabel = 'Inside the methodology',
		guideLabel = 'How it works',
		onOpenGuide,
		class: className = ''
	}: RecipeSamoMethodology = $props();

	const chapters = [
		{ id: 'samo-overview', label: 'SAMO' },
		{ id: 'samo-solid', label: 'SOLID' },
		{ id: 'samo-assembly', label: 'Assembly' },
		{ id: 'samo-nested', label: 'Nested methods' },
		{ id: 'samo-morphology', label: 'Morphological box' },
		{ id: 'samo-architecture', label: 'Governance' },
		{ id: 'samo-practice', label: 'Practice' }
	];

	// Scrolls instead of using hash links, so the sandbox's own routing state stays untouched.
	function openChapter(id: string) {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
	}
</script>

<section class={`c-samo-methodology ${className}`} aria-label="SAMO methodology">
	<nav class="smt-nav" aria-label={navLabel}>
		<span class="smt-nav-label">{navLabel}</span>
		<ul class="smt-nav-list">
			{#each chapters as chapter, index (chapter.id)}
				<li>
					<button type="button" class="smt-nav-link" onclick={() => openChapter(chapter.id)}>
						<span class="smt-nav-index">{String(index + 1).padStart(2, '0')}</span>
						{chapter.label}
					</button>
				</li>
			{/each}
		</ul>
		{#if onOpenGuide}
			<button type="button" class="smt-guide-link" onclick={onOpenGuide}>
				<span class="smt-guide-mark" aria-hidden="true">?</span>
				{guideLabel}
			</button>
		{/if}
	</nav>

	<div id="samo-overview" class="smt-chapter">
		<SamoOverview />
	</div>
	<div id="samo-solid" class="smt-chapter">
		<SamoSolidGrid />
	</div>
	<div id="samo-assembly" class="smt-chapter">
		<SamoAssemblyPipeline />
	</div>
	<div id="samo-nested" class="smt-chapter">
		<SamoNestedMethods />
	</div>
	<div id="samo-morphology" class="smt-chapter">
		<SamoMorphologyBox />
	</div>
	<div id="samo-architecture" class="smt-chapter">
		<SamoArchitectureCompare />
	</div>
	<div id="samo-practice" class="smt-chapter">
		<SamoPractice />
	</div>

	{#if onOpenGuide}
		<button type="button" class="smt-guide-banner" onclick={onOpenGuide}>
			<span class="smt-guide-banner-mark" aria-hidden="true">?</span>
			<span class="smt-guide-banner-copy">
				<span class="smt-guide-banner-title">See how it works day to day</span>
				<span class="smt-guide-banner-desc">
					The life of a change, extending a real button, the platform, risks and adoption.
				</span>
			</span>
			<span class="smt-guide-banner-arrow" aria-hidden="true">→</span>
		</button>
	{/if}
</section>

<style>
	.c-samo-methodology {
		display: grid;
		gap: clamp(3.5rem, 6vw, 5rem);
	}

	.smt-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
		border-radius: 24px;
		border: 1px solid var(--color-border-primary);
		background-color: color-mix(in srgb, var(--color-background-primary) 90%, white 10%);
		padding: 1rem 1.25rem;
	}

	.smt-nav-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-warning-500);
	}

	.smt-nav-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.smt-nav-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		border-radius: 9999px;
		border: 1px solid var(--color-border-primary);
		background: transparent;
		padding: 0.375rem 0.875rem;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}

	.smt-nav-link:hover {
		border-color: var(--color-warning-500);
		background-color: color-mix(in srgb, var(--color-warning-500) 10%, transparent);
	}

	.smt-nav-index {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.75rem;
		color: var(--color-warning-500);
	}

	.smt-chapter {
		scroll-margin-top: 1.5rem;
	}

	.smt-guide-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
		border: none;
		border-radius: 9999px;
		background: linear-gradient(135deg, #ea580c, #dc2626);
		padding: 0.4rem 1rem 0.4rem 0.4rem;
		font: inherit;
		font-size: 0.875rem;
		font-weight: 800;
		color: #fff;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.smt-guide-link:hover {
		transform: translateY(-1px);
	}

	.smt-guide-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		background-color: rgba(255, 255, 255, 0.22);
		font-weight: 900;
	}

	.smt-guide-banner {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1.25rem;
		width: 100%;
		border: none;
		border-radius: 28px;
		background-color: #0b1020;
		background-image:
			radial-gradient(circle at 0% 50%, rgba(234, 88, 12, 0.45), transparent 40%),
			linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
			linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
		background-size:
			auto,
			28px 28px,
			28px 28px;
		padding: clamp(1.25rem, 3vw, 2rem);
		font: inherit;
		text-align: left;
		color: #f8fafc;
		cursor: pointer;
		transition:
			transform 0.25s,
			box-shadow 0.25s;
	}

	.smt-guide-banner:hover {
		transform: translateY(-3px);
		box-shadow: 0 28px 56px -30px rgba(234, 88, 12, 0.85);
	}

	.smt-guide-banner-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: clamp(3rem, 6vw, 4rem);
		height: clamp(3rem, 6vw, 4rem);
		border-radius: 1.25rem;
		background: linear-gradient(135deg, #f59e0b, #dc2626);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 900;
	}

	.smt-guide-banner-copy {
		display: grid;
		gap: 0.25rem;
	}

	.smt-guide-banner-title {
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 900;
		letter-spacing: -0.02em;
	}

	.smt-guide-banner-desc {
		line-height: 1.55;
		color: #cbd5e1;
	}

	.smt-guide-banner-arrow {
		font-size: 1.75rem;
		font-weight: 900;
		color: #fb923c;
		transition: transform 0.25s;
	}

	.smt-guide-banner:hover .smt-guide-banner-arrow {
		transform: translateX(6px);
	}

	@media (prefers-reduced-motion: reduce) {
		.smt-guide-link:hover,
		.smt-guide-banner:hover,
		.smt-guide-banner:hover .smt-guide-banner-arrow {
			transform: none;
		}
	}
</style>
