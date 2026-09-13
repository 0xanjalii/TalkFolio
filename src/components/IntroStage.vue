<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero.vue";
import IntroHolo from "./IntroHolo.vue";

gsap.registerPlugin(ScrollTrigger);

const mode = ref<"stage" | "stacked">("stacked");
const track = ref<HTMLElement | null>(null);
const heroLayer = ref<HTMLElement | null>(null);
const blueLayer = ref<HTMLElement | null>(null);
let tl: gsap.core.Timeline | null = null;

onMounted(() => {
  const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!desktop || reduce) return; // stay stacked

  mode.value = "stage";

  requestAnimationFrame(() => {
    if (!track.value || !heroLayer.value || !blueLayer.value) return;
    gsap.set(blueLayer.value, { autoAlpha: 0 });
    tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: track.value, start: "top top", end: "bottom bottom", scrub: true },
    });
    // Tight cross-dissolve, then a dwell on the resolved blue page.
    // Blue arrives a beat earlier so it is the solid backdrop while the hero dissolves on top of it.
    tl.to(blueLayer.value, { autoAlpha: 1, duration: 0.13 }, 0.34);
    tl.to(heroLayer.value, { autoAlpha: 0, duration: 0.15 }, 0.36);
    // Spacer extends the timeline across the full scroll so the band stays tight and the rest is dwell.
    tl.to({}, { duration: 0.49 }, 0.51);
  });
});

onUnmounted(() => {
  tl?.scrollTrigger?.kill();
  tl?.kill();
});
</script>

<template>
  <!-- Desktop: pinned two-layer diagonal reveal -->
  <section v-if="mode === 'stage'" ref="track" class="intro-track">
    <span id="about" class="anchor anchor-about"></span>
    <div class="intro-stage">
      <div ref="heroLayer" class="layer layer-hero"><Hero /></div>
      <div ref="blueLayer" class="layer layer-blue"><IntroHolo /></div>
    </div>
  </section>

  <!-- Mobile / reduced-motion: simple stacked pages -->
  <div v-else class="intro-stacked">
    <Hero />
    <span id="about" class="anchor"></span>
    <IntroHolo />
  </div>
</template>

<style scoped lang="scss">
.intro-track {
  position: relative;
  height: 230svh;
}

.anchor {
  position: absolute;
  left: 0;
  width: 1px;
  height: 1px;
}
/* Anchor lands in the post-transition dwell (p≈0.7), so clicking About
   arrives on the fully-resolved holo page, never mid-crossfade. */
.anchor-about {
  top: 40%;
}

.intro-stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
}

.layer-hero {
  z-index: 2;
  will-change: transform, opacity;
}

.layer-blue {
  z-index: 1;
}

.intro-stacked .anchor {
  display: block;
  height: 0;
}
</style>
