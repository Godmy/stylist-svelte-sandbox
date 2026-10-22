<script lang="ts">
	import BaseIcon from '$stylist/svg/component/atom/icon/index.svelte';
	import type { RecipeCubeControl } from '$stylist/development/interface/recipe/cube-control';
	import createCubeControlState from '$stylist/development/component/atom/cube-control/state.svelte';

	const Atom = 'atom';
	const Biohazard = 'biohazard';
	const Hand = 'hand';
	const House = 'house';
	const Info = 'info';
	const Radiation = 'radiation';

	let props: RecipeCubeControl = $props();
	const state = createCubeControlState(() => props);

	const restProps = $derived.by(() => {
		const {
			class: _class,
			size: _size,
			perspective: _perspective,
			autoRotate: _autoRotate,
			rotationDuration: _rotationDuration,
			interactive: _interactive,
			inertiaEnabled: _inertiaEnabled,
			inertiaFriction: _inertiaFriction,
			inertiaSensitivity: _inertiaSensitivity,
			faceLabels: _faceLabels,
			onRotate: _onRotate,
			onSelectionChange: _onSelectionChange,
			onDebugLog: _onDebugLog,
			...rest
		} = props;
		return rest;
	});
</script>

<div class={`c-cube-control ${state.className}`.trim()} {...restProps}>
	<div
		class="cube-stage"
		style={`--perspective:${state.perspectiveValue}px; --cube-size:${state.cubeSize}px;`}
		onpointerdown={state.handlePointerDown}
		role="img"
		aria-label="3D cube control"
	>
		<div class="cube-orbit" style={`transform:${state.orbitTransform};`}>
			<div class="cube">
				{#each state.FACE_NAMES as faceName, faceIndex}
					<div class={`cube-face cube-face-${faceName}`}>
						{#if state.faceLabels}
							<div
								class="face-template"
								style={`--face-accent:${state.FACE_THEMES[faceIndex].accent}; --face-tint:${state.FACE_THEMES[faceIndex].tint};`}
							>
								<button
									type="button"
									class={`face-title ${state.selectedTitleFace === faceIndex ? 'face-title-selected' : ''}`}
									data-select-type="title"
									data-face-index={faceIndex}
									onpointerenter={() => (state.isHoveringSelectable = true)}
									onpointerleave={() => (state.isHoveringSelectable = false)}
									onpointerdown={(event) => {
										event.preventDefault();
										event.stopPropagation();
										state.selectedTitleFace = faceIndex;
										state.scheduleAutoRotateResume();
										state.emitSelectionChange();
										state.pushDebugLog({
											ts: Date.now(),
											source: 'title',
											action: 'select',
											faceIndex,
											id: state.FACE_TITLES[faceIndex],
											pointerType: event.pointerType,
											x: event.clientX,
											y: event.clientY
										});
									}}
								>
									{state.FACE_TITLES[faceIndex]}
								</button>
								<div class="face-content">
									<div class="face-matrix">
										{#each state.HORIZONTAL_ICONS as icon, iconIndex}
											<button
												type="button"
												class={`template-icon template-axis-icon template-axis-icon-horizontal ${state.selectedIconId === `${faceIndex}-h-${icon.type}` ? 'template-icon-selected' : ''}`}
												title={icon.label}
												style={`--icon-tone:${icon.tone}; grid-column:${iconIndex + 2}; grid-row:1;`}
												aria-label={icon.label}
												aria-pressed={state.selectedIconId === `${faceIndex}-h-${icon.type}`}
												data-select-type="icon"
												data-select-id={`${faceIndex}-h-${icon.type}`}
												data-face-index={faceIndex}
												onpointerenter={() => (state.isHoveringSelectable = true)}
												onpointerleave={() => (state.isHoveringSelectable = false)}
												onpointerdown={(event) => {
													event.preventDefault();
													event.stopPropagation();
													const id = `${faceIndex}-h-${icon.type}`;
													state.selectIcon(id);
													state.pushDebugLog({
														ts: Date.now(),
														source: 'icon',
														action: 'select',
														id,
														faceIndex,
														pointerType: event.pointerType,
														x: event.clientX,
														y: event.clientY
													});
												}}
											>
												{#if icon.type === 'architecture'}
													<BaseIcon name={House} class="template-icon-glyph" strokeWidth={2.2} />
												{:else if icon.type === 'information'}
													<BaseIcon name={Info} class="template-icon-glyph" strokeWidth={2.6} />
												{:else}
													<BaseIcon name={Hand} class="template-icon-glyph" strokeWidth={2.1} />
												{/if}
											</button>
										{/each}

										{#each state.VERTICAL_ICONS as icon, iconIndex}
											<button
												type="button"
												class={`template-icon template-axis-icon template-axis-icon-vertical ${state.selectedIconId === `${faceIndex}-v-${icon.type}` ? 'template-icon-selected' : ''}`}
												title={icon.label}
												style={`--icon-tone:${icon.tone}; grid-column:1; grid-row:${iconIndex + 2};`}
												aria-label={icon.label}
												aria-pressed={state.selectedIconId === `${faceIndex}-v-${icon.type}`}
												data-select-type="icon"
												data-select-id={`${faceIndex}-v-${icon.type}`}
												data-face-index={faceIndex}
												onpointerenter={() => (state.isHoveringSelectable = true)}
												onpointerleave={() => (state.isHoveringSelectable = false)}
												onpointerdown={(event) => {
													event.preventDefault();
													event.stopPropagation();
													const id = `${faceIndex}-v-${icon.type}`;
													state.selectIcon(id);
													state.pushDebugLog({
														ts: Date.now(),
														source: 'icon',
														action: 'select',
														id,
														faceIndex,
														pointerType: event.pointerType,
														x: event.clientX,
														y: event.clientY
													});
												}}
											>
												{#if icon.type === 'atom'}
													<BaseIcon
														name={Radiation}
														class="template-icon-glyph"
														strokeWidth={2.1}
													/>
												{:else if icon.type === 'molecule'}
													<BaseIcon name={Atom} class="template-icon-glyph" strokeWidth={2.1} />
												{:else}
													<BaseIcon
														name={Biohazard}
														class="template-icon-glyph"
														strokeWidth={2.1}
													/>
												{/if}
											</button>
										{/each}

										{#each state.faceNumbers[faceIndex] as value, cellIndex}
											<button
												type="button"
												class={`number-cell ${state.activeCells[faceIndex] === cellIndex ? 'number-cell-active' : ''} ${state.selectedCellByFace[faceIndex] === cellIndex ? 'number-cell-selected' : ''}`}
												style={`--cell-delay:${cellIndex * 45}ms; grid-column:${(cellIndex % 3) + 2}; grid-row:${Math.floor(cellIndex / 3) + 2};`}
												data-select-type="cell"
												data-face-index={faceIndex}
												data-cell-index={cellIndex}
												onpointerenter={() => (state.isHoveringSelectable = true)}
												onpointerleave={() => (state.isHoveringSelectable = false)}
												onpointerdown={(event) => {
													event.preventDefault();
													event.stopPropagation();
													const next = [...state.selectedCellByFace];
													next[faceIndex] = cellIndex;
													state.selectedCellByFace = next;
													state.scheduleAutoRotateResume();
													state.emitSelectionChange();
													state.pushDebugLog({
														ts: Date.now(),
														source: 'cell',
														action: 'select',
														faceIndex,
														cellIndex,
														id: `${faceIndex}:${cellIndex}`,
														pointerType: event.pointerType,
														x: event.clientX,
														y: event.clientY
													});
												}}
											>
												{String(value).padStart(3, '0')}
											</button>
										{/each}
									</div>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="cube-actions">
		<button
			type="button"
			class="cube-button"
			onclick={() => (state.rotationY -= 15)}
			aria-label="Rotate left">Left</button
		>
		<button
			type="button"
			class="cube-button"
			onclick={() => (state.rotationY += 15)}
			aria-label="Rotate right">Right</button
		>
		<button
			type="button"
			class="cube-button"
			onclick={() => (state.rotationX = state.clamp(state.rotationX - 15, -88, 88))}
			aria-label="Rotate up">Up</button
		>
		<button
			type="button"
			class="cube-button"
			onclick={() => (state.rotationX = state.clamp(state.rotationX + 15, -88, 88))}
			aria-label="Rotate down">Down</button
		>
		<button
			type="button"
			class="cube-button cube-button-reset"
			onclick={state.resetRotation}
			aria-label="Reset cube rotation">Reset</button
		>
	</div>
</div>

<style>
	/* РЎС‚РёР»Рё РёР· РѕСЂРёРіРёРЅР°Р»СЊРЅРѕРіРѕ cube-control */
	.c-cube-control {
		display: inline-flex;
		flex-direction: column;
		gap: var(--spacing-3);
		user-select: none;
		touch-action: none;
	}

	.cube-stage {
		display: grid;
		place-items: center;
		width: calc(var(--cube-size) + 140px);
		height: calc(var(--cube-size) + 140px);
		perspective: var(--perspective);
		border-radius: var(--border-radius-xxl);
		background: var(--gradient-custom132);
		border: 1px solid color-mix(in srgb, var(--color-border-primary) 45%, transparent);
		cursor: grab;
	}

	.cube-stage:active {
		cursor: grabbing;
	}

	.cube-orbit {
		transform-style: preserve-3d;
		transform-origin: center center;
	}

	.cube {
		position: relative;
		width: var(--cube-size);
		height: var(--cube-size);
		transform-style: preserve-3d;
		transform-origin: center center;
	}

	.cube-face {
		position: absolute;
		inset: 0;
		display: block;
		color: var(--color-text-primary);
		border: 1px solid color-mix(in srgb, var(--color-text-primary) 12%, transparent);
		box-shadow: var(--shadow-custom46);
		backface-visibility: hidden;
		overflow: hidden;
		padding: var(--spacing-2);
		pointer-events: auto;
	}

	.cube-face-front {
		transform: translateZ(calc(var(--cube-size) / 2));
	}
	.cube-face-back {
		transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2));
	}
	.cube-face-right {
		transform: rotateY(90deg) translateZ(calc(var(--cube-size) / 2));
	}
	.cube-face-left {
		transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2));
	}
	.cube-face-top {
		transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2));
	}
	.cube-face-bottom {
		transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2));
	}

	.face-template {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: var(--spacing-2);
	}

	.face-title {
		font-weight: var(--font-weight-bold);
		text-align: center;
		font-size: var(--font-size-4);
		cursor: pointer;
		background: color-mix(in srgb, var(--face-accent) 15%, transparent);
		border-radius: var(--border-radius-lg);
		padding: var(--spacing-1) var(--spacing-2);
		transition: all var(--duration-200);
	}

	.face-title-selected {
		box-shadow: 0 0 0 2px var(--face-accent);
	}

	.face-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.face-matrix {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
		gap: var(--spacing-1);
		flex: 1;
	}

	.template-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--border-radius-md);
		cursor: pointer;
		transition: all var(--duration-150);
		background: var(--face-tint);
	}

	.template-icon-selected {
		box-shadow: 0 0 0 2px var(--icon-tone);
	}

	.number-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: var(--font-size-2);
		background: var(--face-tint);
		border-radius: var(--border-radius-sm);
		cursor: pointer;
		transition: all var(--duration-200);
		animation: cell-glow 3s ease-in-out infinite;
		animation-delay: var(--cell-delay, 0ms);
	}

	.number-cell-active {
		background: var(--face-accent);
		color: white;
	}

	.number-cell-selected {
		box-shadow: 0 0 0 2px var(--face-accent);
	}

	@keyframes cell-glow {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}

	.cube-actions {
		display: flex;
		gap: var(--spacing-2);
		justify-content: center;
		flex-wrap: wrap;
	}

	.cube-button {
		padding: var(--spacing-2) var(--spacing-4);
		border: 1px solid var(--color-border-primary);
		background: var(--color-background-primary);
		border-radius: var(--border-radius-md);
		cursor: pointer;
		transition: all var(--duration-200);
	}

	.cube-button:hover {
		background: var(--color-background-secondary);
	}

	.cube-button-reset {
		background: var(--color-primary-100);
		border-color: var(--color-primary-500);
	}

	.template-icon-glyph {
		width: 1rem;
		height: 1rem;
	}
</style>
