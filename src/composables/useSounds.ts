import { onMounted, onUnmounted, ref, watch } from "vue";
import musicUrl from "@/assets/audio/Portfolio_Echoes_v2.mp3";
import clickUrl from "@/assets/audio/click.mp3";

// Global sound state (shared with the header toggle). Music + click SFX on by default.
export const soundsEnabled = ref(true);

const MUSIC_VOLUME = 0.02;
const CLICK_VOLUME = 0.5;

export const useSounds = () => {
  let music: HTMLAudioElement | null = null;
  let unlocked = false;

  const startMusic = () => {
    if (!music || !soundsEnabled.value) return;
    music.play().catch(() => {
      /* blocked by autoplay policy — will start on first gesture */
    });
  };

  // Browsers block audio until the user interacts. The first gesture unlocks it.
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    startMusic();
  };

  const playClick = () => {
    if (!soundsEnabled.value) return;
    const a = new Audio(clickUrl);
    a.volume = CLICK_VOLUME;
    a.play().catch(() => {});
  };

  onMounted(() => {
    if (typeof window === "undefined") return;

    music = new Audio(musicUrl);
    music.loop = true;
    music.volume = MUSIC_VOLUME;
    music.preload = "auto";

    startMusic(); // try immediately (works if the domain was already interacted with)

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("click", playClick, true); // every click, capture phase
  });

  onUnmounted(() => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    document.removeEventListener("click", playClick, true);
    music?.pause();
    music = null;
  });

  // Toggle: pause/resume music; the playClick guard handles SFX.
  watch(soundsEnabled, (on) => {
    if (on) startMusic();
    else music?.pause();
  });
};
