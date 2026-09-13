<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const dot = ref<HTMLElement | null>(null);
const ring = ref<HTMLElement | null>(null);
const enabled = ref(false);
const on = ref(false);
const trail = ref<HTMLElement | null>(null);

const HOVER_SEL = "[data-cursor], a, button, .pcard, .nav-link, .filter, .social";

// Code-ish tokens that briefly trail the cursor.
const SNIPPETS = [
  "AssemblyAI", "StreamingSTT", "LeMUR", "transcribe()", "audio.stream()", "Diarization",
  "SpeechToText", "FastAPI", "TypeScript", "Vue3", "AudioIntelligence", "wss://api.assemblyai.com",
  "AutoChapters", "SentimentAI", "Sub300ms", "TalkFolio", "mic.record()", "VoiceCommand",
];

let raf = 0;
let tx = 0;
let ty = 0;
let dx = 0;
let dy = 0;
let rx = 0;
let ry = 0;
let lastSx = -999;
let lastSy = -999;
let reduceMotion = false;

const spawnToken = (x: number, y: number) => {
  const c = trail.value;
  if (!c) return;
  const el = document.createElement("span");
  el.className = "trail-token mono";
  el.textContent = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]!;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  const ox = Math.random() * 22 - 11;
  const rot = Math.random() * 16 - 8;
  c.appendChild(el);
  const anim = el.animate(
    [
      { opacity: 0.75, transform: `translate(-50%, -50%) rotate(${rot}deg)` },
      { opacity: 0.75, offset: 0.55, transform: `translate(calc(-50% + ${ox * 0.5}px), -90%) rotate(${rot}deg)` },
      { opacity: 0, transform: `translate(calc(-50% + ${ox}px), -130%) rotate(${rot}deg)` },
    ],
    { duration: 2100, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  anim.onfinish = () => el.remove();
};

const move = (e: PointerEvent) => {
  tx = e.clientX;
  ty = e.clientY;
  if (!reduceMotion && Math.hypot(tx - lastSx, ty - lastSy) > 38) {
    lastSx = tx;
    lastSy = ty;
    spawnToken(tx, ty);
  }
};

const over = (e: Event) => {
  if ((e.target as Element)?.closest?.(HOVER_SEL)) on.value = true;
};
const out = (e: Event) => {
  if ((e.target as Element)?.closest?.(HOVER_SEL)) on.value = false;
};

const tick = () => {
  // dot tracks tightly, ring trails for a smooth lag
  dx += (tx - dx) * 0.4;
  dy += (ty - dy) * 0.4;
  rx += (tx - rx) * 0.16;
  ry += (ty - ry) * 0.16;
  if (dot.value) dot.value.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
  if (ring.value) ring.value.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  raf = requestAnimationFrame(tick);
};

onMounted(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  enabled.value = true;
  tx = ty = dx = dy = rx = ry = -100;
  window.addEventListener("pointermove", move);
  document.addEventListener("mouseover", over);
  document.addEventListener("mouseout", out);
  raf = requestAnimationFrame(tick);
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener("pointermove", move);
  document.removeEventListener("mouseover", over);
  document.removeEventListener("mouseout", out);
});
</script>

<template>
  <template v-if="enabled">
    <div ref="trail" class="cursor-trail" aria-hidden="true"></div>
    <div ref="ring" class="cursor-ring" :class="{ on }"></div>
    <div ref="dot" class="cursor-dot" :class="{ on }"></div>
  </template>
</template>

<style scoped lang="scss">
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
}

.cursor-dot {
  width: 10px;
  height: 10px;
  background: var(--nb-green);
  border: 1.5px solid #000000;
  box-shadow: 2px 2px 0 #000000;
  transition:
    width 0.15s var(--ease),
    height 0.15s var(--ease),
    opacity 0.15s var(--ease);
}

.cursor-ring {
  width: 38px;
  height: 38px;
  border: 2px solid #000000;
  background: rgba(0, 240, 118, 0.15);
  box-shadow: 2px 2px 0 #000000;
  transition:
    width 0.2s var(--ease),
    height 0.2s var(--ease),
    border-width 0.2s var(--ease),
    background 0.2s var(--ease);
}

.cursor-ring.on {
  width: 52px;
  height: 52px;
  border-width: 2.5px;
  background: rgba(0, 240, 118, 0.35);
}

.cursor-dot.on {
  width: 6px;
  height: 6px;
}

/* fading code trail */
.cursor-trail {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;
}
.cursor-trail :deep(.trail-token) {
  position: fixed;
  transform: translate(-50%, -50%);
  /* keep the floating code monospace even though --f-mono is now the manga label font */
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--accent-text);
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(28, 18, 6, 0.3);
  will-change: transform, opacity;
}
</style>
