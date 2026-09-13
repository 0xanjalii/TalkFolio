<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { SECTIONS } from "@/content/sections";
import { useActiveSection } from "@/composables/useActiveSection";
import { goToSection, goHome } from "@/composables/useRoute";
import { useAssemblyAI } from "@/composables/useAssemblyAI";
import { useGitHubProfile } from "@/composables/useGitHubProfile";
import SoundToggle from "./SoundToggle.vue";

const { activeSection } = useActiveSection();
const { isListening, isContinuousMode, toggleContinuousConversation } = useAssemblyAI();
const { activeProfile, openModal } = useGitHubProfile();
const hidden = ref(false);
let lastY = 0;

const onScroll = () => {
  const y = window.scrollY;
  hidden.value = y > lastY && y > 320;
  lastY = y;
};

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header class="header" :class="{ hide: hidden }">
    <div class="header-inner">
      <button class="brand mono" @click="goHome()" data-cursor="top" aria-label="Back to top">
        <span class="brand-badge">⚡</span> #TalkFolio
      </button>
      <nav class="nav" aria-label="Sections">
        <button
          v-for="s in SECTIONS"
          :key="s.id"
          class="nav-link mono"
          :class="{ active: activeSection === s.id }"
          @click="goToSection(s.id)"
        >
          {{ s.label }}
        </button>
      </nav>
      <div class="header-actions">
        <button
          class="profile-btn mono"
          @click="openModal"
          data-cursor="fetch"
          title="Fetch GitHub or LinkedIn Profile"
        >
          <span class="profile-icon">⚡</span>
          <span class="profile-label">{{ activeProfile.login ? `@${activeProfile.login}` : 'Fetch Profile' }}</span>
        </button>
        <button
          class="voice-btn mono"
          :class="{ active: isListening || isContinuousMode }"
          @click="toggleContinuousConversation"
          data-cursor="mic"
          :title="isContinuousMode ? 'Pause Bi-Directional Talk' : 'Start Bi-Directional Talk with AssemblyAI'"
        >
          <span class="mic-icon">{{ isContinuousMode ? '⚡' : '🎙️' }}</span>
          <span class="voice-label">{{ isContinuousMode ? 'Bi-Directional' : (isListening ? 'Listening...' : 'Voice AI') }}</span>
        </button>
        <button class="cta mono" @click="goToSection('contact')" data-cursor="say hi">Connect</button>
        <SoundToggle />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 28px);
  max-width: var(--container);
  z-index: 100;
  transition: transform var(--t-mid) var(--ease);
}

.header.hide {
  transform: translateX(-50%) translateY(-150%);
}

.header-inner {
  background: var(--nb-white);
  border: var(--nb-border);
  box-shadow: var(--nb-shadow);
  height: 58px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  padding: 0 10px 0 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.05em;
  color: var(--nb-black);
}

.brand-badge {
  background: var(--nb-green);
  color: var(--nb-black);
  border: 1.5px solid var(--nb-black);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 11px;
  box-shadow: 1.5px 1.5px 0 var(--nb-black);
}

.nav {
  display: none;
  gap: 4px;

  @include mq(lg) {
    display: flex;
  }
}

.nav-link {
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  padding: 8px 12px;
  border-radius: var(--r-sm);
  transition: all 0.15s var(--ease);

  &:hover {
    color: var(--nb-black);
    background: var(--nb-green);
    border: 1.5px solid var(--nb-black);
    box-shadow: 2px 2px 0 var(--nb-black);
  }

  &.active {
    color: var(--nb-black);
    background: var(--nb-green-light);
    border: 1.5px solid var(--nb-black);
    box-shadow: 2px 2px 0 var(--nb-black);
  }
}

.hot {
  position: absolute;
  top: -6px;
  right: 2px;
  font-family: var(--f-mono);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.2;
  color: var(--nb-black);
  background: var(--nb-green);
  border: 1.5px solid var(--nb-black);
  border-radius: 4px;
  padding: 1px 4px;
  transform: rotate(6deg);
  box-shadow: 1.5px 1.5px 0 var(--nb-black);
  pointer-events: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--nb-green);
  border: 2px solid var(--nb-black);
  border-radius: var(--r-sm);
  box-shadow: 2px 2px 0 var(--nb-black);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 800;
  color: var(--nb-black);
  cursor: pointer;
  transition: all 0.15s var(--ease);

  &:hover {
    background: #00d060;
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--nb-black);
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 var(--nb-black);
  }
}

.voice-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  border: 2px solid var(--nb-black);
  border-radius: var(--r-sm);
  box-shadow: 2px 2px 0 var(--nb-black);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  color: var(--nb-black);
  transition: all 0.15s var(--ease);

  &:hover {
    background: var(--nb-green);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--nb-black);
  }

  &.active {
    background: var(--nb-green);
    animation: pulse 1s infinite alternate;
  }
}

@keyframes pulse {
  from { box-shadow: 2px 2px 0 var(--nb-black); }
  to { box-shadow: 0 0 10px var(--nb-green); }
}

.cta {
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: var(--r-sm);
  background: var(--nb-green);
  color: var(--nb-black);
  border: 2px solid var(--nb-black);
  box-shadow: 3px 3px 0 var(--nb-black);
  white-space: nowrap;
  transition: all 0.15s var(--ease);

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 var(--nb-black);
    background: #00d060;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 var(--nb-black);
  }
}
</style>
