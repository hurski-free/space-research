<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { i18n } from '../i18n';

import { type Game, createGame } from '../game';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    autoStart?: boolean;
  }>(),
  {
    autoStart: true,
  },
);

const emit = defineEmits<{
  leave: [];
}>();

const rootRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const gameRef = shallowRef<Game | null>(null);
// let glRef: WebGLRenderingContext | WebGL2RenderingContext | null = null
let resizeObserver: ResizeObserver | null = null;

function applyCanvasSize() {
  const root = rootRef.value;
  const canvas = canvasRef.value;
  if (!root || !canvas) return;

  const w = root.clientWidth;
  const h = root.clientHeight;
  if (w < 1 || h < 1) return;

  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    // scale canvas to match device pixel ratio
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  gameRef.value?.resizeCanvas(w, h);
}

function initGame() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');;

  if (!ctx) return;

  gameRef.value?.stop();
  
  const game = createGame({
    ctx,
    translator: i18n.global,
    actionsKeysMap: {
      main_engine: 'KeyW',
      maneur_left_engine: 'KeyA',
      maneur_right_engine: 'KeyD',
      scan: 'KeyC',
      stop_rotation: 'Space',
    },
  });

  setTimeout(() => {
    gameRef.value = game;
    game.resizeCanvas(canvas.width, canvas.height, true);

    if (props.autoStart) {
      game.start();
    }
  }, 100);
}

function togglePauseResume() {
  const game = gameRef.value;
  if (!game) return;

  if (game.gameState === 1) {
    game.pause();
  } else if (game.gameState === 2) {
    game.resume();
  }
}

function toggleStartStop() {
  const game = gameRef.value;
  if (!game) return;

  if (game.gameState === 0) {
    game.start();
  } else {
    game.stop();
  }
}

function restartGame() {
  gameRef.value?.restart();
}

function onKeyDown(event: KeyboardEvent) {
  event.preventDefault();
  gameRef.value?.handleKeyboardInput(event, true);
}

function onKeyUp(event: KeyboardEvent) {
  event.preventDefault();
  gameRef.value?.handleKeyboardInput(event, false);
  // gameRef.value?.handleKeyboardInput(event);
}

function teardownGame() {
  gameRef.value?.stop();
  gameRef.value = null;
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  nextTick(() => {
    resizeObserver = new ResizeObserver(() => {
      applyCanvasSize();
    });

    if (rootRef.value) {
      resizeObserver.observe(rootRef.value);
    }

    initGame();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  resizeObserver?.disconnect();
  resizeObserver = null;
  teardownGame();
});
</script>

<template>
  <div class="game-shell">
    <header class="game-toolbar">
      <button type="button" class="back-btn" @click="emit('leave')">{{ t('game.back') }}</button>
      <button type="button" class="toolbar-btn" @click="togglePauseResume">
        {{ t('game.pauseResume') }}
      </button>
      <button type="button" class="toolbar-btn" @click="toggleStartStop">
        {{ t('game.stopStart') }}
      </button>
      <button type="button" class="toolbar-btn" @click="restartGame">
        {{ t('game.restart') }}
      </button>
    </header>
    <div
      ref="rootRef"
      class="canvas-wrap"
    >
      <canvas ref="canvasRef" class="game-canvas" />
    </div>
  </div>
</template>

<style scoped>
.game-shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 0.75rem;
}

.game-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.back-btn {
  font: inherit;
  cursor: pointer;
  padding: 0.35rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.back-btn:hover {
  border-color: var(--accent-dim);
  color: var(--text-h);
}

.toolbar-btn {
  font: inherit;
  cursor: pointer;
  padding: 0.35rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.toolbar-btn:hover:not(:disabled) {
  border-color: var(--accent-dim);
  color: var(--text-h);
}

.toolbar-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.canvas-wrap {
  flex: 1;
  max-height: calc(100vh - 4rem);
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--input-bg);
  overflow: hidden;
}

.game-canvas {
  display: block;
}
</style>
