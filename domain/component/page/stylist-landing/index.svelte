<script lang="ts">
	import CtaButtons from '$stylist/domain/component/molecule/cta-buttons/index.svelte';
	import FeatureGrid from '$stylist/domain/component/molecule/feature-grid/index.svelte';
	import SamoMethodology from '$stylist/domain/component/organism/samo-methodology/index.svelte';
	import StylistHero from '$stylist/domain/component/molecule/stylist-hero/index.svelte';
	import StylistMission from '$stylist/domain/component/molecule/stylist-mission/index.svelte';
	import type { RecipeStylistLanding } from '$stylist/domain/interface/recipe/stylist-landing';

	let {
		rootDomainCount = 0,
		storyModuleCount = 0,
		onBrowseComponents,
		onOpenPlayground,
		onOpenWorkspace,
		onOpenGuide,
		class: className = ''
	}: RecipeStylistLanding = $props();
</script>

<section class={`c-stylist-landing ${className}`} aria-label="Stylist landing">
	<div class="landing-flow">
		<StylistHero {rootDomainCount} {storyModuleCount} />

		<div class="content-band content-band--cta">
			<div class="content-shell content-shell--narrow">
				<CtaButtons
					totalComponents={storyModuleCount}
					onComponentsOpen={onBrowseComponents}
					onPlaygroundOpen={onOpenPlayground}
				/>
			</div>
		</div>

		<div class="content-band">
			<div class="content-shell">
				<FeatureGrid />
			</div>
		</div>

		<div class="content-band">
			<div class="content-shell">
				<SamoMethodology {onOpenGuide} />
			</div>
		</div>

		<div class="content-band">
			<div class="content-shell">
				<StylistMission onPrimaryOpen={onOpenWorkspace} onSecondaryOpen={onBrowseComponents} />
			</div>
		</div>
	</div>
</section>

<style>
	.c-stylist-landing {
		min-height: 100vh;
		padding: clamp(1rem, 2vw, 1.75rem) clamp(1rem, 2vw, 2rem) clamp(3rem, 6vw, 5rem);
		background:
			radial-gradient(
				circle at top left,
				color-mix(in srgb, var(--color-warning-500) 10%, transparent),
				transparent 22%
			),
			radial-gradient(
				circle at 88% 12%,
				color-mix(in srgb, var(--color-primary-500) 12%, transparent),
				transparent 18%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--color-background-primary) 96%, white 4%),
				color-mix(
					in srgb,
					var(--color-background-primary) 88%,
					var(--color-background-secondary) 12%
				)
			);
	}

	.landing-flow {
		display: grid;
		gap: clamp(3.5rem, 6vw, 5rem);
		margin: 0 auto;
	}

	.content-band {
		width: 100%;
	}

	.content-shell {
		width: min(88rem, 100%);
		margin: 0 auto;
	}

	.content-shell--narrow {
		width: min(72rem, 100%);
		text-align: center;
	}

	.content-band--cta {
		position: relative;
		z-index: 1;
	}
</style>
