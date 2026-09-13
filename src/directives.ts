import type { Directive } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fine = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reduce = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Handlers {
  move: (e: MouseEvent) => void;
  leave: () => void;
}

// Pull element gently toward the cursor.
export const vMagnetic: Directive<HTMLElement & { __mag?: Handlers }> = {
  mounted(el) {
    if (!fine() || reduce()) return;
    const strength = 0.3;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    el.__mag = { move, leave };
  },
  unmounted(el) {
    if (el.__mag) {
      el.removeEventListener("mousemove", el.__mag.move);
      el.removeEventListener("mouseleave", el.__mag.leave);
    }
  },
};

// Scroll parallax — element drifts up by `value`% as it passes the viewport (scrub).
export const vParallax: Directive<HTMLElement & { __px?: gsap.core.Tween }> = {
  mounted(el, binding) {
    if (reduce()) return;
    const amount = typeof binding.value === "number" ? binding.value : 24;
    el.__px = gsap.to(el, {
      yPercent: -amount,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  },
  unmounted(el) {
    el.__px?.scrollTrigger?.kill();
    el.__px?.kill();
  },
};

// Subtle 3D tilt toward the cursor.
export const vTilt: Directive<HTMLElement & { __tilt?: Handlers }> = {
  mounted(el) {
    if (!fine() || reduce()) return;
    const max = 6;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    el.__tilt = { move, leave };
  },
  unmounted(el) {
    if (el.__tilt) {
      el.removeEventListener("mousemove", el.__tilt.move);
      el.removeEventListener("mouseleave", el.__tilt.leave);
    }
  },
};
