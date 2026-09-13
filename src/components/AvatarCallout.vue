<script setup lang="ts">
import { ref } from "vue";
import { useAssemblyAI } from "@/composables/useAssemblyAI";

const { isListening, isProcessing, transcriptText, toggleListening, simulateVoiceInput } = useAssemblyAI();
const minimized = ref(false);
</script>

<template>
  <div class="voice-floater" :class="{ listening: isListening }">
    <!-- Live Transcript Bubble -->
    <Transition name="fade">
      <div v-if="transcriptText && !minimized" class="floating-bubble mono">
        <div class="bubble-header">
          <span>⚡ AssemblyAI STT</span>
          <button class="close-btn" @click="transcriptText = ''">✕</button>
        </div>
        <p class="bubble-content">"{{ transcriptText }}"</p>
      </div>
    </Transition>

    <!-- Floating Trigger Pill -->
    <div class="floating-action">
      <button
        class="floating-btn mono"
        :class="{ active: isListening }"
        @click="toggleListening"
        data-cursor="speak"
        title="Voice Control with AssemblyAI"
      >
        <span class="pulse-ring" v-if="isListening"></span>
        <span class="btn-icon">{{ isListening ? '⏹' : '🎙️' }}</span>
        <span class="btn-text">{{ isListening ? 'Listening...' : 'Talk with AI' }}</span>
      </button>

      <button
        v-if="!isListening"
        class="quick-test-btn mono"
        @click="simulateVoiceInput('Show skills')"
        title="Quick Command Demo"
      >
        "Skills"
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.voice-floater {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.floating-bubble {
  background: #0a0a0a;
  color: var(--nb-green);
  border: 2px solid var(--nb-green);
  border-radius: var(--r-md);
  box-shadow: 4px 4px 0 #000000;
  padding: 10px 14px;
  max-width: 280px;
  font-size: 12px;
}

.bubble-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 4px;
}

.close-btn {
  color: #94a3b8;
  font-size: 11px;
  padding: 0 4px;
  cursor: pointer;

  &:hover {
    color: #ffffff;
  }
}

.bubble-content {
  font-weight: 600;
  line-height: 1.4;
}

.floating-action {
  display: flex;
  align-items: center;
  gap: 6px;
}

.floating-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--nb-green);
  color: #0a0a0a;
  border: 2.5px solid #0a0a0a;
  box-shadow: 4px 4px 0 #0a0a0a;
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.15s var(--ease);

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #0a0a0a;
    background: #00d060;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #0a0a0a;
  }

  &.active {
    background: #ff4d4d;
    color: #ffffff;
  }
}

.pulse-ring {
  position: absolute;
  inset: -6px;
  border-radius: 999px;
  border: 2px solid var(--nb-green);
  animation: pulse-ring 1.5s infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
}

.quick-test-btn {
  background: #ffffff;
  color: #0a0a0a;
  border: 2px solid #0a0a0a;
  box-shadow: 3px 3px 0 #0a0a0a;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s var(--ease);

  &:hover {
    background: var(--nb-green-light);
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 #0a0a0a;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
