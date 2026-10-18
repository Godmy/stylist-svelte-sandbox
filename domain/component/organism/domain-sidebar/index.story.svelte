<script lang="ts">
	import DomainSidebar from './index.svelte';
	import type { RecipeDomainSidebar } from '$stylist/domain/interface/recipe/domain-sidebar';
	import type { SlotDomainEntity } from '$stylist/domain/interface/slot/domain-entity';

	// Render of index.story.ts: the active domain, cluster, joint and entity are local state driven by the sidebar callbacks.
	let args: RecipeDomainSidebar = $props();

	const entitiesByDomain: Record<'layout' | 'theme' | 'button', SlotDomainEntity[]> = {
		button: [
			{
				name: 'button',
				path: '/src/lib/button/component/atom/button',
				files: [{ path: 'index.svelte' }, { path: 'index.story.svelte' }]
			}
		],
		layout: [
			{
				name: 'clickable',
				path: '/src/lib/layout/component/atom/clickable',
				files: [{ path: 'index.svelte' }, { path: 'index.story.svelte' }]
			},
			{
				name: 'hoverable',
				path: '/src/lib/layout/component/atom/hoverable',
				files: [{ path: 'index.svelte' }]
			}
		],
		theme: [
			{
				name: 'theme-provider',
				path: '/src/lib/theme/component/atom/theme-provider',
				files: [{ path: 'index.svelte' }, { path: 'index.story.svelte' }]
			},
			{
				name: 'theme-consumer',
				path: '/src/lib/theme/component/atom/theme-consumer',
				files: [{ path: 'index.svelte' }]
			}
		]
	};

	let activeDomain = $state<'layout' | 'theme' | 'button'>('layout');
	let activeCluster = $state('component');
	let activeJoint = $state('atom');
	let activeEntityPath = $state<string>(entitiesByDomain.layout[0].path);
</script>

<div class="_c1">
	<DomainSidebar
		{...args}
		{activeDomain}
		{activeCluster}
		{activeJoint}
		entities={entitiesByDomain[activeDomain]}
		{activeEntityPath}
		onDomainSelect={(name) => {
			activeDomain = name === 'button' ? 'button' : name === 'theme' ? 'theme' : 'layout';
			activeEntityPath = entitiesByDomain[activeDomain][0].path;
		}}
		onClusterSelect={(name) => {
			activeCluster = name;
		}}
		onJointSelect={(name) => {
			activeJoint = name;
		}}
		onEntitySelect={(path) => {
			activeEntityPath = path;
		}}
	/>
</div>

<style>
	._c1 {
		height: 34rem;
		width: 18rem;
		overflow: hidden;
		border-radius: 1rem;
		border-width: 1px;
		border-style: solid;
		border-color: #e2e8f0;
		background-color: #ffffff;
	}
</style>
