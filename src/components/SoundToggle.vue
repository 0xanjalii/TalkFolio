<script setup lang="ts">
import { soundsEnabled } from "@/composables/useSounds";

const toggle = () => {
  soundsEnabled.value = !soundsEnabled.value;
};
</script>

<template>
  <button
    class="sound-toggle"
    :class="{ off: !soundsEnabled }"
    @click="toggle"
    data-cursor="sound"
    :aria-label="soundsEnabled ? 'Mute sound' : 'Enable sound'"
    :aria-pressed="soundsEnabled"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <!-- speaker body -->
      <path
        d="M4 9v6h3.5L12 19V5L7.5 9H4z"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linejoin="round"
      />
      <!-- sound waves (hidden when muted) -->
      <g class="waves" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <path class="wave wave-1" d="M15.5 9.2a4 4 0 0 1 0 5.6" />
        <path class="wave wave-2" d="M18 7a7.5 7.5 0 0 1 0 10" />
      </g>
      <!-- mute slash (shown when muted) — crosses the whole speaker -->
      <line class="slash" x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </svg>
  </button>
</template>

<style scoped lang="scss">
.sound-toggle {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  color: var(--text);
  background: transparent;
  transition:
    color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);

  &:hover {
    color: var(--nb-black);
    background: var(--nb-green);
    border: 1.5px solid var(--nb-black);
    box-shadow: 2px 2px 0 var(--nb-black);
  }

  .wave {
    transition:
      opacity var(--t-fast) var(--ease),
      transform var(--t-fast) var(--ease);
    transform-origin: 14px 12px;
  }
  .wave-2 {
    transition-delay: 0.04s;
  }

  .slash {
    opacity: 0;
    stroke-dasharray: 24;
    stroke-dashoffset: 24;
    transition:
      opacity var(--t-fast) var(--ease),
      stroke-dashoffset var(--t-fast) var(--ease);
  }

  /* muted state */
  &.off {
    color: var(--faint);

    .wave {
      opacity: 0;
      transform: translateX(-3px);
    }
    .slash {
      opacity: 1;
      stroke-dashoffset: 0;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .sound-toggle .wave,
  .sound-toggle .slash {
    transition: none;
  }
}
</style>
