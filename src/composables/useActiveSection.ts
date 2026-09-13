import { onMounted, onUnmounted, ref } from "vue";
import { SECTIONS } from "@/content/sections";

// Empty = no tab highlighted (the hero/landing state).
export const activeSection = ref<string>("");

export const useActiveSection = () => {
  let observer: IntersectionObserver | null = null;

  // While the hero is in view (top of page), no section is "active".
  const onScroll = () => {
    if (window.scrollY < window.innerHeight * 0.5) activeSection.value = "";
  };

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeSection.value = entry.target.id;
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.elementId);
      if (el) observer.observe(el);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  onUnmounted(() => {
    observer?.disconnect();
    window.removeEventListener("scroll", onScroll);
  });

  return { activeSection };
};
