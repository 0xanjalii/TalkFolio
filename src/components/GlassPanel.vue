<template>
  <div class="glass-panel">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.glass-panel {
  @include glass();
  border-radius: var(--r-lg);
}
</style>
