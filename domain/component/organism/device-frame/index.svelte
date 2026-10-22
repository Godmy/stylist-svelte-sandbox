<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RecipeDeviceFrame } from '$stylist/domain/interface/recipe/device-frame';
	import { createDeviceFrameState } from '$stylist/domain/component/organism/device-frame/state.svelte';
	let props: RecipeDeviceFrame & HTMLAttributes<HTMLDivElement> = $props();
	const state = createDeviceFrameState(() => props);
</script>

{#if state.showFrame}
	<div class="pdf-outer">
		<div class="pdf-device">
			<div class={`pdf-badge ${state.spec.color}`}>
				{state.spec.name} | {state.spec.width}px x {state.spec.height}px
			</div>

			<div class="pdf-frame-wrap">
				{#if state.device === 'mobile'}
					<div class="pdf-phone">
						<div
							class={`pdf-phone-body ${state.spec.color}`}
							style="width: {state.spec.width + 24}px;"
						>
							<div class="pdf-notch-row">
								<div class="pdf-notch">
									<div class="pdf-notch-pill"></div>
									<div class="pdf-notch-dot"></div>
								</div>
							</div>

							<div
								class="pdf-screen pdf-screen--mobile"
								style="width: {state.spec.width}px; height: {state.spec.height}px;"
							>
								<div class="pdf-screen-inner">
									{#if state.children}
										{#if state.children}{@render state.children()}{/if}
									{/if}
								</div>
							</div>

							<div class="pdf-home-row">
								<div class="pdf-home-bar"></div>
							</div>
						</div>

						<div class="pdf-vol-btn pdf-vol-btn--1"></div>
						<div class="pdf-vol-btn pdf-vol-btn--2"></div>
						<div class="pdf-power-btn"></div>
					</div>
				{:else if state.device === 'tablet'}
					<div class="pdf-tablet">
						<div
							class={`pdf-tablet-body ${state.spec.color}`}
							style="width: {state.spec.width + 32}px;"
						>
							<div class="pdf-camera-row">
								<div class="pdf-camera-dot"></div>
							</div>

							<div
								class="pdf-screen pdf-screen--tablet"
								style="width: {state.spec.width}px; height: {state.spec.height}px;"
							>
								<div class="pdf-screen-inner">
									{#if state.children}
										{#if state.children}{@render state.children()}{/if}
									{/if}
								</div>
							</div>

							<div class="pdf-tablet-home-row">
								<div class="pdf-tablet-home-btn"></div>
							</div>
						</div>

						<div class="pdf-tablet-vol-btn"></div>
					</div>
				{:else if state.device === 'desktop'}
					<div class="pdf-desktop">
						<div class={`pdf-monitor-body ${state.spec.color}`}>
							<div class="pdf-bezel">
								<div
									class="pdf-screen pdf-screen--desktop"
									style="width: {state.spec.width}px; height: {state.spec.height}px;"
								>
									<div class="pdf-screen-inner">
										{#if state.children}
											{#if state.children}{@render state.children()}{/if}
										{/if}
									</div>
								</div>
							</div>

							<div class="pdf-logo-row">
								<div class="pdf-led"></div>
							</div>
						</div>

						<div class={`pdf-stand-neck ${state.spec.color}`}></div>
						<div class={`pdf-stand-base ${state.spec.color}`}></div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<div class="pdf-fullscreen">
		{#if state.children}
			{#if state.children}{@render state.children()}{/if}
		{/if}
	</div>
{/if}

<style>
	:global(.pdf-color--mobile) {
		background: linear-gradient(to bottom right, #1f2937, #111827);
	}
	:global(.pdf-color--tablet) {
		background: linear-gradient(to bottom right, #374151, #1f2937);
	}
	:global(.pdf-color--desktop) {
		background: linear-gradient(to bottom right, #4b5563, #374151);
	}
	:global(.device-content) {
		scroll-behavior: smooth;
	}

	@keyframes pdf-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.pdf-outer {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}
	.pdf-device {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pdf-badge {
		margin-bottom: 1rem;
		border-radius: 9999px;
		padding: 0.5rem 1rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	.pdf-frame-wrap {
		position: relative;
	}
	.pdf-fullscreen {
		height: 100%;
		width: 100%;
	}

	/* Mobile */
	.pdf-phone {
		position: relative;
	}
	.pdf-phone-body {
		box-sizing: border-box;
		border-radius: 3rem;
		padding: 0.75rem;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
	.pdf-notch-row {
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: center;
	}
	.pdf-notch {
		display: flex;
		height: 1.5rem;
		width: 8rem;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 9999px;
		background: black;
	}
	.pdf-notch-pill {
		height: 0.25rem;
		width: 3rem;
		border-radius: 9999px;
		background: #1f2937;
	}
	.pdf-notch-dot {
		height: 0.5rem;
		width: 0.5rem;
		border-radius: 9999px;
		background: #1f2937;
	}
	.pdf-screen {
		overflow: hidden;
		background: white;
		box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
	}
	@media (prefers-color-scheme: dark) {
		.pdf-screen {
			background: #111827;
		}
	}
	.pdf-screen--mobile {
		border-radius: 2.5rem;
	}
	.pdf-screen--tablet {
		border-radius: 1.5rem;
	}
	.pdf-screen--desktop {
		border-radius: 0.5rem;
	}
	.pdf-screen-inner {
		height: 100%;
		width: 100%;
		overflow: auto;
	}
	.pdf-home-row {
		margin-top: 0.5rem;
		display: flex;
		justify-content: center;
	}
	.pdf-home-bar {
		height: 0.25rem;
		width: 8rem;
		border-radius: 9999px;
		background: #4b5563;
	}
	.pdf-vol-btn {
		position: absolute;
		left: 0;
		height: 3rem;
		width: 0.25rem;
		border-radius: 0 9999px 9999px 0;
		background: #1f2937;
	}
	.pdf-vol-btn--1 {
		top: 6rem;
	}
	.pdf-vol-btn--2 {
		top: 10rem;
	}
	.pdf-power-btn {
		position: absolute;
		top: 8rem;
		right: 0;
		height: 4rem;
		width: 0.25rem;
		border-radius: 9999px 0 0 9999px;
		background: #1f2937;
	}

	/* Tablet */
	.pdf-tablet {
		position: relative;
	}
	.pdf-tablet-body {
		box-sizing: border-box;
		border-radius: 2rem;
		padding: 1rem;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
	.pdf-camera-row {
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: center;
	}
	.pdf-camera-dot {
		height: 0.75rem;
		width: 0.75rem;
		border-radius: 9999px;
		background: #111827;
	}
	.pdf-tablet-home-row {
		margin-top: 0.5rem;
		display: flex;
		justify-content: center;
	}
	.pdf-tablet-home-btn {
		height: 3rem;
		width: 3rem;
		border-radius: 9999px;
		border: 2px solid #374151;
		background: #111827;
	}
	.pdf-tablet-vol-btn {
		position: absolute;
		top: 8rem;
		right: 0;
		height: 4rem;
		width: 0.25rem;
		border-radius: 9999px 0 0 9999px;
		background: #1f2937;
	}

	/* Desktop */
	.pdf-desktop {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.pdf-monitor-body {
		border-radius: 1rem;
		padding: 1rem;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}
	.pdf-bezel {
		border-radius: 0.75rem;
		background: black;
		padding: 1.5rem;
	}
	.pdf-logo-row {
		margin-top: 0.5rem;
		display: flex;
		justify-content: center;
	}
	.pdf-led {
		height: 0.5rem;
		width: 0.5rem;
		border-radius: 9999px;
		background: #22c55e;
		animation: pdf-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	.pdf-stand-neck {
		margin-top: 0.5rem;
		height: 0.5rem;
		width: 8rem;
		border-radius: 9999px;
	}
	.pdf-stand-base {
		margin-top: 0.25rem;
		height: 0.75rem;
		width: 12rem;
		border-radius: 9999px;
	}
</style>
