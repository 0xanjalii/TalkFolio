<template>
  <div class="mesh" aria-hidden="true">
    <span class="blob blob-1"></span>
    <span class="blob blob-2"></span>
    <span class="blob blob-3"></span>
    <span class="grain"></span>
  </div>
</template>

<style scoped lang="scss">
.mesh {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.7;
  will-change: transform;
}

.blob-1 {
  width: 46vw;
  height: 46vw;
  top: -8vw;
  left: -4vw;
  background: radial-gradient(circle at 30% 30%, var(--blob-1), transparent 70%);
  animation: drift-1 22s var(--ease) infinite alternate;
}

.blob-2 {
  width: 40vw;
  height: 40vw;
  top: 10vw;
  right: -6vw;
  background: radial-gradient(circle at 60% 40%, var(--blob-2), transparent 70%);
  animation: drift-2 26s var(--ease) infinite alternate;
}

.blob-3 {
  width: 38vw;
  height: 38vw;
  bottom: -10vw;
  left: 25vw;
  background: radial-gradient(circle at 50% 50%, var(--blob-3), transparent 70%);
  animation: drift-3 30s var(--ease) infinite alternate;
}

/* subtle film grain via layered transparent gradient */
.grain {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(24, 24, 27, 0.04) 1px, transparent 1px);
  background-size: 3px 3px;
  mix-blend-mode: multiply;
  opacity: 0.5;
}

@keyframes drift-1 {
  to {
    transform: translate(8vw, 6vw) scale(1.15);
  }
}
@keyframes drift-2 {
  to {
    transform: translate(-7vw, 9vw) scale(1.1);
  }
}
@keyframes drift-3 {
  to {
    transform: translate(5vw, -8vw) scale(1.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}
</style>
