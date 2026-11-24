<script lang="ts">
	import MetricBar from '$stylist/chart/component/atom/metric-bar/index.svelte';

	import type { RecipeDomainFileDomainGrid } from '$stylist/domain/interface/recipe/domain-file-domain-grid';
	import createDomainFileDomainGridComponentState from '$stylist/domain/component/organism/domain-file-domain-grid/state.svelte';

	let { domains, class: className = '' }: RecipeDomainFileDomainGrid = $props();

	const state = createDomainFileDomainGridComponentState(() => ({ domains: domains }));
</script>

<div class="c-domain-file-domain-grid {className}">
	{#each domains as domain (domain.name)}
		<article class="domain-card">
			<header class="domain-card__header">
				<div>
					<h3>{state.formatDomainName(domain.name)}</h3>
					<p>{domain.name}</p>
				</div>
				<strong>{domain.fileCount}</strong>
			</header>

			<MetricBar
				text="Total files"
				percentage={state.getPercentage(domain.fileCount, state.maxDomainFiles)}
				valueLabel={domain.fileCount}
				color="#2563eb"
				trackColor="color-mix(in srgb, var(--color-border-primary, #cbd5e1) 60%, transparent)"
			/>

			<div class="component-grid" aria-label={`${domain.name} component counts`}>
				{#each state.componentKeys as key, keyIndex (keyIndex)}
					<div>
						<span>{state.componentLabels[key]}</span>
						<strong>{domain.components[key]}</strong>
					</div>
				{/each}
			</div>

			<div class="cluster-list">
				{#each domain.clusters as cluster (`${domain.name}-${cluster.name}`)}
					<section class="cluster-group">
						<header>
							<span>{cluster.name}</span>
							<strong>{cluster.fileCount}</strong>
						</header>
						<div class="joint-list">
							{#each cluster.joints as joint (`${domain.name}-${cluster.name}-${joint.name}`)}
								<MetricBar
									text={joint.name}
									percentage={state.getPercentage(
										joint.entityCount,
										state.getMaxJointCount(domain)
									)}
									valueLabel={`${joint.entityCount} / ${joint.fileCount} files`}
									color="#0f766e"
									trackColor="color-mix(in srgb, var(--color-border-primary, #cbd5e1) 60%, transparent)"
								/>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</article>
	{/each}
</div>

<style>
	.c-domain-file-domain-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
		gap: 1rem;
	}

	.domain-card {
		display: grid;
		align-content: start;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--color-border-primary, #cbd5e1);
		border-radius: 8px;
		background: var(--color-background-primary, #ffffff);
	}

	.domain-card__header {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
	}

	.domain-card__header p {
		margin: 0.2rem 0 0;
		color: var(--color-text-secondary, #64748b);
		overflow-wrap: anywhere;
	}

	.domain-card__header h3 {
		margin: 0;
		font-size: 1rem;
		line-height: 1.2;
	}

	.domain-card__header strong {
		font-size: 1.5rem;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.component-grid div {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
		padding: 0.65rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary, #cbd5e1) 72%, transparent);
		border-radius: 8px;
		background: var(--color-background-secondary, #f8fafc);
	}

	.component-grid span {
		color: var(--color-text-secondary, #64748b);
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	.component-grid strong {
		font-size: 1.15rem;
		font-variant-numeric: tabular-nums;
	}

	.cluster-list,
	.joint-list {
		display: grid;
		gap: 0.75rem;
	}

	.cluster-group {
		display: grid;
		gap: 0.65rem;
		padding-top: 0.75rem;
		border-top: 1px solid color-mix(in srgb, var(--color-border-primary, #cbd5e1) 70%, transparent);
	}

	.cluster-group header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.cluster-group header strong {
		font-size: 0.85rem;
		color: var(--color-text-secondary, #64748b);
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 720px) {
		.component-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
