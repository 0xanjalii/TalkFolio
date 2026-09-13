import { nextTick, onMounted, onUnmounted, ref } from "vue";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const lenis = ref<Lenis | null>(null);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth-scroll to a section element by id (or 0 for top). */
export const scrollToTarget = (target: string | number, duration = 1.1) => {
  if (lenis.value) {
    lenis.value.scrollTo(target as any, { offset: 0, duration });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Scroll to a target after the home view re-appears from under a project page.
 * Home is hidden with `display:none` (v-show) while a project shows, which collapses
 * Lenis's scroll limit — so `lenis.resize()` MUST run before scrolling or the target
 * gets clamped against the stale (tiny) max and we land on the hero.
 */
export const scrollToSectionAfterHome = (target: string | number, duration = 1.1) => {
  nextTick(() =>
    requestAnimationFrame(() => {
      lenis.value?.resize(); // recompute scroll limit now that home is visible again
      ScrollTrigger.refresh(); // re-pin IntroStage so section offsets are correct
      requestAnimationFrame(() => scrollToTarget(target, duration));
    }),
  );
};

let teardownAuto: (() => void) | null = null;

/** Cancel any in-flight auto-scroll (e.g. when the user takes over). */
export const cancelAutoScroll = () => teardownAuto?.();

/**
 * Slowly glide through an element from the current position to its bottom —
 * used after the D-ID agent navigates so content reveals while it talks.
 * Linear, ~`pxPerSec` reading pace; any user input cancels it.
 */
export const slowScrollThrough = (selector: string, pxPerSec = 32) => {
  const l = lenis.value;
  if (!l || typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return;

  const top = window.scrollY + el.getBoundingClientRect().top;
  const targetY = Math.max(0, top + el.offsetHeight - window.innerHeight);
  const distance = targetY - window.scrollY;
  if (distance < 16) return;

  const duration = Math.min(Math.max(distance / pxPerSec, 4), 40);

  teardownAuto?.(); // drop any prior auto-scroll listeners
  const stop = () => {
    l.scrollTo(l.animatedScroll, { immediate: true, force: true });
    teardownAuto?.();
  };
  teardownAuto = () => {
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    window.removeEventListener("pointerdown", stop);
    teardownAuto = null;
  };
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  window.addEventListener("pointerdown", stop);

  l.scrollTo(targetY, {
    duration,
    easing: (t: number) => t, // linear, steady reading pace
    force: true,
    onComplete: () => teardownAuto?.(),
  });
};

export const useScroll = () => {
  let raf = 0;

  onMounted(() => {
    if (prefersReducedMotion()) {
      // Native scrolling; still let ScrollTrigger drive reveals.
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.value = instance;

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      instance.raf(time * 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    ScrollTrigger.refresh();
  });

  onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf);
    lenis.value?.destroy();
    lenis.value = null;
  });
};
