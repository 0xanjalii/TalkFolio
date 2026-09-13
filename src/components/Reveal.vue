<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const props = withDefaults(defineProps<{ delay?: number; y?: number }>(), { delay: 0, y: 32 });

const el = ref<HTMLElement | null>(null);
let tween: gsap.core.Tween | null = null;

onMounted(() => {
  if (!el.value) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(el.value, { opacity: 1, y: 0, filter: "none" });
    return;
  }
  tween = gsap.fromTo(
    el.value,
    { opacity: 0, y: props.y, filter: "blur(6px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power3.out",
      delay: props.delay,
      scrollTrigger: { trigger: el.value, start: "top 88%", once: true },
    },
  );
});

onUnmounted(() => {
  tween?.scrollTrigger?.kill();
  tween?.kill();
});
</script>

<template>
  <div ref="el" class="reveal"><slot /></div>
</template>

<style scoped lang="scss">
.reveal {
  will-change: transform, opacity, filter;
}
</style>
