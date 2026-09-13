<script setup lang="ts">
import { ref } from "vue";
import { useGitHubProfile } from "@/composables/useGitHubProfile";

const { isModalOpen, isFetchingProfile, fetchError, fetchProfile, closeModal } = useGitHubProfile();

const profileInput = ref("");

const presets = [
  { label: "@0xanjalii (Anjali)", handle: "0xanjalii" },
  { label: "@torvalds (Linux)", handle: "torvalds" },
  { label: "@yyx990803 (Vue)", handle: "yyx990803" },
  { label: "@karpathy (AI)", handle: "karpathy" },
];

const handleFetch = async (targetHandle?: string) => {
  const query = targetHandle || profileInput.value || "0xanjalii";
  const success = await fetchProfile(query);
  if (success) {
    profileInput.value = "";
    closeModal();
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">
          <!-- Window Header Bar -->
          <div class="modal-bar mono">
            <div class="bar-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="bar-title">PROFILE_INGESTION_SYSTEM.IO</span>
            <button class="bar-close" @click="closeModal" aria-label="Close modal">✕</button>
          </div>

          <div class="modal-body">
            <h3 class="modal-title">⚡ Fetch GitHub or LinkedIn Profile</h3>
            <p class="modal-desc">
              Enter any GitHub or LinkedIn profile URL / handle. TalkFolio will fetch repositories and profile data, personalize your portfolio's AI knowledge base, and let visitors talk with your portfolio out loud.
            </p>

            <!-- Input Form -->
            <form class="fetch-form" @submit.prevent="handleFetch()">
              <div class="input-wrapper">
                <span class="input-icon mono">&gt;</span>
                <input
                  v-model="profileInput"
                  type="text"
                  class="fetch-input mono"
                  placeholder="e.g. 0xanjalii, github.com/0xanjalii, or linkedin.com/in/username"
                  :disabled="isFetchingProfile"
                  autofocus
                />
              </div>

              <button
                type="submit"
                class="fetch-btn mono"
                :disabled="isFetchingProfile"
              >
                <span v-if="isFetchingProfile">⚡ FETCHING DATA...</span>
                <span v-else>⚡ GENERATE PORTFOLIO</span>
              </button>
            </form>

            <!-- Error Banner -->
            <div v-if="fetchError" class="error-banner mono">
              <span>⚠ {{ fetchError }}</span>
            </div>

            <!-- Quick Presets -->
            <div class="presets-section">
              <span class="presets-label mono">Try Quick Presets:</span>
              <div class="preset-chips">
                <button
                  v-for="p in presets"
                  :key="p.handle"
                  class="preset-chip mono"
                  @click="handleFetch(p.handle)"
                  :disabled="isFetchingProfile"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Status Indicator -->
            <div class="info-footer mono">
              <span class="pulse-dot"></span>
              <span>AssemblyAI STT &amp; OpenRouter AI Engine Ready</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-card {
  width: 100%;
  max-width: 540px;
  background: #ffffff;
  border: 3px solid #0a0a0a;
  border-radius: var(--r-md);
  box-shadow: 8px 8px 0 #0a0a0a;
  overflow: hidden;
  animation: cardPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardPop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-bar {
  background: #0a0a0a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 2px solid #0a0a0a;
}

.bar-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #0a0a0a;
}
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.bar-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--nb-green);
}

.bar-close {
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.15s;

  &:hover {
    color: var(--nb-green);
  }
}

.modal-body {
  padding: 24px;
}

.modal-title {
  font-family: var(--f-sans);
  font-weight: 800;
  font-size: 1.4rem;
  color: #0a0a0a;
  margin-bottom: 8px;
}

.modal-desc {
  font-size: 13px;
  line-height: 1.5;
  color: #475569;
  margin-bottom: 20px;
}

.fetch-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #0a0a0a;
  border-radius: var(--r-sm);
  padding: 0 12px;
  box-shadow: 3px 3px 0 #0a0a0a;
}

.input-icon {
  font-size: 16px;
  font-weight: 800;
  color: var(--nb-green-dark);
  margin-right: 8px;
}

.fetch-input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #0a0a0a;
  outline: none;

  &::placeholder {
    color: #94a3b8;
  }
}

.fetch-btn {
  background: var(--nb-green);
  color: #0a0a0a;
  border: 2.5px solid #0a0a0a;
  border-radius: var(--r-sm);
  box-shadow: 4px 4px 0 #0a0a0a;
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.15s var(--ease);

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #0a0a0a;
    background: #00d060;
  }

  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #0a0a0a;
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
}

.error-banner {
  background: #fef2f2;
  border: 2px solid #ef4444;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}

.presets-section {
  margin-bottom: 20px;
}

.presets-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.preset-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-chip {
  background: #f1f5f9;
  color: #0a0a0a;
  border: 1.5px solid #0a0a0a;
  box-shadow: 2px 2px 0 #0a0a0a;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: var(--nb-green);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #0a0a0a;
  }
}

.info-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  border-top: 1px dashed #cbd5e1;
  padding-top: 14px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nb-green);
  box-shadow: 0 0 6px var(--nb-green);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
