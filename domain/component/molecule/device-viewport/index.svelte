<script lang="ts">
	import { DEVICE_FRAME_VIEWPORT } from '$stylist/domain/const/array/device-frame-viewport';
	import type { DeviceFrameViewport } from '$stylist/domain/type/alias/device-frame-viewport';
	import type { RecipeDeviceViewport } from '$stylist/domain/interface/recipe/device-viewport';

	let {
		value = 'desktop',
		width,
		widths = {},
		onWidthChange,
		fullscreen = false,
		onFullscreenChange,
		onChange,
		class: className = ''
	}: RecipeDeviceViewport = $props();

	const LABEL: Record<DeviceFrameViewport, string> = {
		mobile: 'Mobile',
		tablet: 'Tablet',
		desktop: 'Desktop',
		fullscreen: 'Fullscreen'
	};
	const WIDTHS: Record<DeviceFrameViewport, number[]> = {
		mobile: [320, 360, 375, 390, 414, 430],
		tablet: [600, 768, 820, 834, 1024],
		desktop: [1280, 1366, 1440, 1536, 1920, 2560],
		fullscreen: []
	};
	const selectedWidth = $derived(
		width ?? widths[value] ?? { mobile: 375, tablet: 768, desktop: 1440, fullscreen: null }[value]
	);
</script>

<nav class="c-device-viewport {className}" aria-label="Preview viewport">
	{#each DEVICE_FRAME_VIEWPORT.filter((device) => device !== 'fullscreen') as device (device)}
		<button
			type="button"
			class:active={value === device}
			class="viewport-button"
			onclick={() => onChange?.(device)}
			aria-pressed={value === device}
			aria-label={LABEL[device]}
			data-hint={`${LABEL[device]} · ${device === value ? selectedWidth : (widths[device] ?? { mobile: 375, tablet: 768, desktop: 1440, fullscreen: null }[device])}px`}
		>
			{#if device === 'mobile'}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<rect x="7" y="2" width="10" height="20" rx="2" />
					<path d="M11 18h2" />
				</svg>
			{:else if device === 'tablet'}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<rect x="4" y="2" width="16" height="20" rx="2" />
					<path d="M12 18h.01" />
				</svg>
			{:else if device === 'desktop'}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<rect x="2" y="4" width="20" height="13" rx="2" />
					<path d="M8 21h8" />
					<path d="M12 17v4" />
				</svg>
			{:else}
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M8 3H5a2 2 0 0 0-2 2v3" />
					<path d="M21 8V5a2 2 0 0 0-2-2h-3" />
					<path d="M3 16v3a2 2 0 0 0 2 2h3" />
					<path d="M16 21h3a2 2 0 0 0 2-2v-3" />
				</svg>
			{/if}
		</button>
	{/each}
	{#if value !== 'fullscreen'}
		<label class="viewport-size">
			<span class="viewport-select-wrap">
				<select
					aria-label={`${LABEL[value]} viewport width`}
					value={selectedWidth}
					onchange={(event) => onWidthChange?.(Number(event.currentTarget.value))}
				>
					{#if selectedWidth && !WIDTHS[value].includes(selectedWidth)}
						<option value={selectedWidth}>{selectedWidth} px</option>
					{/if}
					{#each WIDTHS[value] as preset (preset)}
						<option value={preset}>{preset} px</option>
					{/each}
				</select>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg
				>
			</span>
		</label>
	{/if}
	<button
		type="button"
		class="viewport-button fullscreen-button"
		class:active={fullscreen}
		aria-pressed={fullscreen}
		aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
		title={fullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
		onclick={() => onFullscreenChange?.(!fullscreen)}
	>
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			{#if fullscreen}<path d="M3 8h5V3m8 0v5h5M3 16h5v5m8 0v-5h5" />{:else}<path
					d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"
				/>{/if}
		</svg>
	</button>
</nav>

<style>
	.c-device-viewport {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 80%, transparent);
		border-radius: 18px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-background-primary) 96%, white 4%),
			color-mix(in srgb, var(--color-background-primary) 90%, var(--color-background-secondary) 10%)
		);
		box-shadow:
			0 16px 38px rgba(15, 23, 42, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.55);
		backdrop-filter: blur(14px);
	}

	.viewport-size {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding-left: 0.6rem;
		border-left: 1px solid var(--color-border-primary);
	}
	.viewport-select-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}
	.viewport-select-wrap select {
		appearance: none;
		height: 2.3rem;
		width: 6.7rem;
		padding: 0 1.65rem 0 0.7rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 10px;
		background: var(--color-background-primary);
		color: var(--color-text-primary);
		font: inherit;
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}
	.viewport-select-wrap select:hover {
		border-color: var(--color-primary-500);
	}
	.viewport-select-wrap select:focus-visible {
		outline: 2px solid var(--color-primary-500);
		outline-offset: 2px;
	}
	.viewport-select-wrap svg {
		position: absolute;
		right: 0.6rem;
		pointer-events: none;
		color: var(--color-text-secondary);
	}
	.fullscreen-button {
		margin-left: 0.65rem;
		outline: 1px solid var(--color-border-primary);
		outline-offset: 4px;
	}

	.viewport-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.85rem;
		height: 2.85rem;
		padding: 0;
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 78%, transparent);
		border-radius: 999px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-background-primary) 97%, white 3%) 0%,
			color-mix(in srgb, var(--color-background-primary) 92%, var(--color-background-secondary) 8%)
				100%
		);
		color: var(--color-text-primary);
		cursor: pointer;
		box-shadow:
			0 8px 20px rgba(15, 23, 42, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.55);
		transition:
			transform 120ms ease,
			background-color 120ms ease,
			border-color 120ms ease,
			color 120ms ease;
	}

	.viewport-button:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--color-primary-500) 44%, var(--color-border-primary) 56%);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-background-primary) 86%, var(--color-primary-500) 14%) 0%,
			color-mix(in srgb, var(--color-background-primary) 82%, var(--color-primary-500) 18%) 100%
		);
	}

	.viewport-button.active {
		border-color: color-mix(in srgb, var(--color-primary-500) 48%, var(--color-border-primary) 52%);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-background-primary) 78%, var(--color-primary-500) 22%) 0%,
			color-mix(in srgb, var(--color-background-primary) 72%, var(--color-primary-600) 28%) 100%
		);
		color: var(--color-text-primary);
		box-shadow:
			0 10px 24px rgba(15, 23, 42, 0.16),
			inset 0 1px 0 rgba(255, 255, 255, 0.22);
	}

	.viewport-button.active:hover {
		border-color: color-mix(in srgb, var(--color-primary-500) 56%, var(--color-border-primary) 44%);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-background-primary) 70%, var(--color-primary-500) 30%) 0%,
			color-mix(in srgb, var(--color-background-primary) 66%, var(--color-primary-600) 34%) 100%
		);
	}

	@media (max-width: 840px) {
		.c-device-viewport {
			flex-wrap: nowrap;
			justify-content: flex-end;
		}
		.viewport-size {
			gap: 0.35rem;
			padding-left: 0.35rem;
		}
	}
</style>
