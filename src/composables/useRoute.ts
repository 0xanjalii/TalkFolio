import { onMounted, onUnmounted, ref } from "vue";
import { getSection } from "@/content/sections";
import { scrollToTarget } from "./useScroll";

// URL-driven routing.
//   /             → home (hero)
//   /<section-id> → a section (about, experience, skills, contact)
// The URL changes only on EXPLICIT navigation (nav clicks, voice tools, back/forward).
// Manual scrolling does NOT rewrite the URL.
export const activeSlug = ref<string | null>(null);

const sectionFromPath = (): string | null => {
  if (typeof window === "undefined") return null;
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return getSection(seg)?.id ?? null;
};

/** Navigate to a section by id or alias: updates the URL and smooth-scrolls. */
export const goToSection = (idOrAlias: string, duration = 1.1): boolean => {
  const section = getSection(idOrAlias);
  if (!section) return false;
  const path = `/${section.id}`;
  if (window.location.pathname !== path) window.history.pushState({}, "", path);
  scrollToTarget("#" + section.elementId, duration);
  return true;
};

/** Back to the top (home). */
export const goHome = () => {
  if (window.location.pathname !== "/") window.history.pushState({}, "", "/");
  scrollToTarget(0);
};

export const useRoute = () => {
  const onPop = () => {
    const sec = sectionFromPath();
    if (sec) {
      scrollToTarget("#" + getSection(sec)!.elementId);
    } else {
      scrollToTarget(0);
    }
  };

  onMounted(() => {
    const sec = sectionFromPath();
    if (sec) {
      requestAnimationFrame(() =>
        window.setTimeout(() => scrollToTarget("#" + getSection(sec)!.elementId), 300),
      );
    }
    window.addEventListener("popstate", onPop);
  });

  onUnmounted(() => window.removeEventListener("popstate", onPop));
};
