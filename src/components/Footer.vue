<script setup lang="ts">
import { profile } from "@/content/profile";
const year = 2026;
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="mono brand-p"><span class="green-star">⚡</span> © {{ year }} <strong>TalkFolio</strong> · {{ profile.name }}</p>
      <p class="mono dim">Powered by <strong>AssemblyAI</strong> Speech AI · Built with Vue</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  border-top: 3px solid #0a0a0a;
  background: var(--nb-white);
  padding-block: var(--s-5);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--nb-black);
}

.brand-p {
  font-weight: 700;
}

.green-star {
  color: #059669;
  font-size: 14px;
}

.dim {
  color: var(--muted);
  font-weight: 600;

  strong {
    color: var(--nb-black);
    background: var(--nb-green);
    padding: 1px 6px;
    border: 1px solid #0a0a0a;
    border-radius: 3px;
  }
}
</style>
