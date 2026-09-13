<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { goToSection } from "@/composables/useRoute";
import { useAssemblyAI } from "@/composables/useAssemblyAI";
import { useGitHubProfile } from "@/composables/useGitHubProfile";
import femaleHeroImg from "@/content/images/female-hero.jpg";

const { activeProfile, openModal } = useGitHubProfile();
const {
  isListening,
  isProcessing,
  isSpeaking,
  isContinuousMode,
  activeLanguage,
  transcriptText,
  lastResponse,
  audioLevels,
  toggleListening,
  toggleContinuousConversation,
  finalizeUserTurn,
  simulateVoiceInput,
  processUserInput,
} = useAssemblyAI();

const userQuery = ref("");

const handleTextSubmit = async () => {
  const query = userQuery.value.trim();
  if (!query || isProcessing.value) return;
  userQuery.value = "";
  await processUserInput(query);
};

// Cycle title between name and TalkFolio
const names = computed(() => ["TalkFolio", activeProfile.value.name || "Anjali"]);
const idx = ref(0);
const name = computed(() => names.value[idx.value % names.value.length]);
let timer: number | undefined;

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = window.setInterval(() => {
    idx.value = (idx.value + 1) % names.value.length;
  }, 3200);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <section id="hero" class="hero">
    <!-- Dynamic Marquee Ticker -->
    <div class="marquee-banner mono" aria-hidden="true">
      <div class="marquee-track">
        <span>⚡ TALKFOLIO × ASSEMBLY AI ⚡ SPEECH-TO-TEXT ⚡ REAL-TIME VOICE COMMANDS ⚡ PERSONALIZED AI PORTFOLIO ⚡ TALK OUT LOUD ⚡ SUB-300MS LATENCY ⚡</span>
        <span>⚡ TALKFOLIO × ASSEMBLY AI ⚡ SPEECH-TO-TEXT ⚡ REAL-TIME VOICE COMMANDS ⚡ PERSONALIZED AI PORTFOLIO ⚡ TALK OUT LOUD ⚡ SUB-300MS LATENCY ⚡</span>
      </div>
    </div>

    <div class="container hero-container">
      <div class="hero-grid">
        <!-- Left: Copy & AssemblyAI Voice Controller -->
        <div class="hero-left">
          <div class="badge-pill mono">
            <span class="live-dot"></span> Powered by AssemblyAI Speech AI &amp; OpenRouter
          </div>

          <h1 class="hero-title">
            <Transition name="swap" mode="out-in">
              <span :key="name" class="title-text">{{ name }}</span>
            </Transition>
          </h1>

          <p class="hero-role mono">{{ activeProfile.role }}</p>
          <p class="hero-tagline">{{ activeProfile.tagline }}</p>

          <!-- Interactive AssemblyAI Bi-Directional Voice & Chat Console -->
          <div class="voice-console">
            <div class="voice-console-header mono">
              <div class="header-status-group">
                <span class="console-tag">🎙️ TalkFolio Voice &amp; AI Console</span>
                <span v-if="isContinuousMode" class="continuous-badge">⚡ BI-DIRECTIONAL</span>
              </div>
              <div class="status-tags">
                <span v-if="isListening" class="listening-tag">LISTENING (Speak now)...</span>
                <span v-else-if="isProcessing" class="processing-tag">THINKING (OpenRouter)...</span>
                <span v-else-if="isSpeaking" class="speaking-tag">SPEAKING ALOUD 🔊</span>
                <span v-else class="ready-tag">READY TO TALK</span>
              </div>
            </div>

            <div class="voice-console-body">
              <!-- Animated Waveform Bars -->
              <div class="waveform-bars" :class="{ active: isListening || isSpeaking }">
                <span
                  v-for="(lvl, i) in audioLevels"
                  :key="i"
                  class="wave-bar"
                  :style="{ height: `${(isListening || isSpeaking) ? lvl : 18}%` }"
                ></span>
              </div>

              <!-- Main Bi-Directional Continuous Voice Toggle -->
              <button
                class="mic-trigger mono"
                :class="{ continuous: isContinuousMode, listening: isListening, speaking: isSpeaking }"
                @click="toggleContinuousConversation"
                data-cursor="speak"
                :title="isContinuousMode ? 'Pause Hands-Free Bi-Directional Talk' : 'Start Hands-Free Bi-Directional Talk'"
              >
                <span class="mic-icon">{{ isContinuousMode ? (isSpeaking ? '🔊' : '⏹') : '🎙️' }}</span>
                <span>{{ isContinuousMode ? (isSpeaking ? 'AI Speaking...' : 'Pause Bi-Directional Talk') : 'Start Bi-Directional Talk' }}</span>
              </button>

              <!-- Done Speaking Fast-Forward Button -->
              <button
                v-if="isListening"
                class="done-btn mono"
                @click="finalizeUserTurn"
                data-cursor="send"
                title="Send immediately without waiting for silence"
              >
                Done Speaking ↗
              </button>
            </div>

            <!-- Multi-Language Selector Row -->
            <div class="lang-selector-row mono">
              <span class="lang-label">Language:</span>
              <select v-model="activeLanguage" class="lang-select">
                <option value="auto">🌐 All Languages (Auto-Detect)</option>
                <option value="en-US">🇺🇸 English</option>
                <option value="hi-IN">🇮🇳 Hindi (हिंदी)</option>
                <option value="es-ES">🇪🇸 Spanish (Español)</option>
                <option value="fr-FR">🇫🇷 French (Français)</option>
                <option value="de-DE">🇩🇪 German (Deutsch)</option>
                <option value="ja-JP">🇯🇵 Japanese (日本語)</option>
                <option value="zh-CN">🇨🇳 Chinese (中文)</option>
              </select>
              <span class="lang-hint">AssemblyAI Auto-Detect + Multi-lingual LLM</span>
            </div>

            <!-- Direct Text Query Form -->
            <form class="text-input-form" @submit.prevent="handleTextSubmit">
              <div class="text-input-wrapper">
                <input
                  v-model="userQuery"
                  type="text"
                  class="text-query-input mono"
                  :placeholder="`Ask ${activeProfile.name}'s AI in any language (e.g. Hindi, Spanish, English)...`"
                  :disabled="isProcessing"
                />
                <button type="submit" class="text-query-btn mono" :disabled="isProcessing || !userQuery.trim()">
                  {{ isProcessing ? '...' : 'Send ↗' }}
                </button>
              </div>
            </form>

            <!-- Real-time Transcript Output -->
            <div v-if="transcriptText" class="transcript-box mono">
              <span class="transcript-label">&gt;&gt; You:</span> {{ transcriptText }}
            </div>
            <div v-if="lastResponse" class="response-box mono">
              <span class="response-label">🤖 {{ activeProfile.name }}'s AI:</span> {{ lastResponse }}
            </div>

            <!-- Quick Command Suggestions -->
            <div class="quick-commands mono">
              <span class="quick-hint">Try saying:</span>
              <button class="cmd-chip" @click="simulateVoiceInput(`Show skills of ${activeProfile.name}`)">"Show skills"</button>
              <button class="cmd-chip" @click="simulateVoiceInput(`What repositories do you have on GitHub?`)">"GitHub Repos"</button>
              <button class="cmd-chip" @click="simulateVoiceInput(`Tell me about your background and experience`)">"Experience"</button>
              <button class="cmd-chip" @click="simulateVoiceInput('How can I contact you?')">"Contact"</button>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="hero-actions">
            <button class="nb-btn nb-btn-fetch mono" data-cursor="fetch" @click="openModal">
              ⚡ Fetch Any Profile
            </button>
            <button class="nb-btn nb-btn-primary" data-cursor="view" @click="goToSection('skills')">
              Explore Skills ↗
            </button>
            <button class="nb-btn nb-btn-secondary" data-cursor="say hi" @click="goToSection('contact')">
              Get in Touch ✉
            </button>
          </div>
        </div>

        <!-- Right: Stylized Female Character / Profile Card -->
        <div class="hero-right">
          <div class="avatar-card">
            <div class="card-bar mono">
              <span class="dot-red"></span>
              <span class="dot-yellow"></span>
              <span class="dot-green"></span>
              <span class="card-title">{{ (activeProfile.login || 'USER').toUpperCase() }}_FOLIO.SYS</span>
            </div>
            <div class="avatar-frame">
              <img
                :src="activeProfile.avatar_url || femaleHeroImg"
                :alt="`${activeProfile.name} — AI Portfolio`"
                class="avatar-img"
              />
              <div class="avatar-sticker mono">
                <span>⚡ {{ activeProfile.handle || '@0xanjalii' }}</span>
              </div>
              <div class="avatar-corner-badge mono">
                <span>{{ (activeProfile.role || 'SPEECH AI ARCHITECT').toUpperCase() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Down Prompt -->
    <button class="hero-scroll mono" data-cursor="scroll" @click="goToSection('skills')">
      SCROLL DOWN ↓
    </button>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: calc(var(--header-h) + 38px);
  padding-bottom: var(--s-8);
  overflow: hidden;
  background: var(--bg);
  background-image:
    radial-gradient(#0a0a0a 1px, transparent 1px),
    linear-gradient(to right, rgba(0, 240, 118, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 240, 118, 0.08) 1px, transparent 1px);
  background-size: 24px 24px, 48px 48px, 48px 48px;
}

/* Marquee Ticker */
.marquee-banner {
  position: absolute;
  top: var(--header-h);
  left: 0;
  width: 100%;
  background: var(--nb-green);
  color: var(--nb-black);
  border-top: 2.5px solid var(--nb-black);
  border-bottom: 2.5px solid var(--nb-black);
  overflow: hidden;
  white-space: nowrap;
  padding: 6px 0;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.1em;
  z-index: 10;
}

.marquee-track {
  display: inline-flex;
  animation: marquee-scroll 22s linear infinite;

  span {
    padding-right: 2rem;
  }
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.hero-container {
  position: relative;
  z-index: 2;
  margin-top: var(--s-4);
}

.hero-grid {
  display: grid;
  gap: var(--s-6);
  align-items: center;

  @include mq(lg) {
    grid-template-columns: 1.15fr 0.85fr;
    gap: var(--s-8);
  }
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--nb-white);
  border: 2px solid var(--nb-black);
  box-shadow: 3px 3px 0 var(--nb-black);
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  width: fit-content;
  border-radius: var(--r-sm);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nb-green);
  box-shadow: 0 0 8px var(--nb-green);
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hero-title {
  font-family: var(--f-display);
  font-size: clamp(3.8rem, 8vw, 7.2rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin: var(--s-2) 0;
  color: var(--nb-black);

  .title-text {
    display: inline-block;
    color: var(--nb-black);
    text-shadow:
      4px 4px 0 var(--nb-green),
      7px 7px 0 var(--nb-black);
  }
}

.hero-role {
  font-size: clamp(14px, 1.8vw, 18px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--nb-black);
  background: var(--nb-green);
  border: 2px solid var(--nb-black);
  box-shadow: 3px 3px 0 var(--nb-black);
  padding: 6px 14px;
  width: fit-content;
  border-radius: var(--r-sm);
  transform: rotate(-1deg);
}

.hero-tagline {
  font-size: 1.1rem;
  line-height: 1.55;
  color: var(--text);
  max-width: 36rem;
  margin-top: 4px;
  font-weight: 500;
}

/* Voice Console */
.voice-console {
  margin-top: var(--s-4);
  background: var(--nb-white);
  border: var(--nb-border);
  box-shadow: var(--nb-shadow);
  border-radius: var(--r-md);
  padding: var(--s-4);
  max-width: 38rem;
}

.voice-console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: var(--s-3);
  padding-bottom: var(--s-2);
  border-bottom: 2px dashed #0a0a0a;
  gap: 8px;
  flex-wrap: wrap;
}

.header-status-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.continuous-badge {
  background: var(--nb-green);
  color: var(--nb-black);
  border: 1.5px solid var(--nb-black);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 800;
  box-shadow: 1.5px 1.5px 0 var(--nb-black);
  animation: pulse 1.2s infinite alternate;
}

.listening-tag {
  color: var(--nb-black);
  background: var(--nb-green);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1.5px solid var(--nb-black);
  animation: pulse 1s infinite alternate;
}

.processing-tag {
  color: #ffffff;
  background: #0a0a0a;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1.5px solid var(--nb-black);
  animation: pulse 1.2s infinite alternate;
}

.speaking-tag {
  color: var(--nb-black);
  background: #facc15;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1.5px solid var(--nb-black);
  animation: pulse 0.8s infinite alternate;
}

.ready-tag {
  color: var(--muted);
  padding: 2px 6px;
}

.voice-console-body {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  flex-wrap: wrap;
}

.waveform-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 38px;
  padding: 4px 10px;
  background: #f1f5f9;
  border: 2px solid var(--nb-black);
  border-radius: var(--r-sm);
  min-width: 120px;
}

.wave-bar {
  flex: 1;
  width: 6px;
  background: var(--nb-black);
  border-radius: 2px;
  transition: height 0.15s ease;
}

.waveform-bars.active .wave-bar {
  background: var(--nb-green);
}

.mic-trigger {
  @include nb-button(var(--nb-green));
  padding: 10px 18px;
  font-size: 13px;

  &.listening {
    background: #ff4d4d;
    color: #ffffff;
  }

  &.speaking {
    background: #facc15;
    color: var(--nb-black);
  }

  &.continuous {
    border-color: var(--nb-black);
  }
}

.done-btn {
  background: var(--nb-white);
  color: var(--nb-black);
  border: 2px solid var(--nb-black);
  border-radius: var(--r-sm);
  box-shadow: 2px 2px 0 var(--nb-black);
  padding: 9px 13px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s var(--ease);

  &:hover {
    background: var(--nb-green);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--nb-black);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--nb-black);
  }
}

.lang-selector-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--s-3);
  padding-top: var(--s-2);
  border-top: 1px dashed rgba(10, 10, 10, 0.2);
  font-size: 11px;
  flex-wrap: wrap;
}

.lang-label {
  font-weight: 800;
  color: var(--nb-black);
}

.lang-select {
  background: #ffffff;
  border: 2px solid var(--nb-black);
  border-radius: var(--r-sm);
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--nb-black);
  box-shadow: 2px 2px 0 var(--nb-black);
  outline: none;
  cursor: pointer;
}

.lang-hint {
  font-size: 10px;
  color: var(--muted);
  font-weight: 600;
}

.text-input-form {
  margin-top: var(--s-3);
}

.text-input-wrapper {
  display: flex;
  gap: 8px;
}

.text-query-input {
  flex: 1;
  background: #ffffff;
  border: 2px solid var(--nb-black);
  border-radius: var(--r-sm);
  box-shadow: 2px 2px 0 var(--nb-black);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--nb-black);
  outline: none;

  &:focus {
    border-color: var(--nb-black);
    box-shadow: 3px 3px 0 var(--nb-black);
    background: #fafafa;
  }
}

.text-query-btn {
  @include nb-button(var(--nb-green));
  padding: 8px 14px;
  font-size: 12px;
}

.transcript-box {
  margin-top: var(--s-3);
  background: #0a0a0a;
  color: var(--nb-green);
  padding: 8px 12px;
  border-radius: var(--r-sm);
  font-size: 13px;
  font-weight: 600;
}

.response-box {
  margin-top: 6px;
  background: var(--nb-green-light);
  border: 1.5px solid var(--nb-black);
  color: var(--nb-black);
  padding: 6px 12px;
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 700;
}

.quick-commands {
  margin-top: var(--s-3);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.quick-hint {
  font-weight: 800;
  color: var(--muted);
}

.cmd-chip {
  background: #f8fafc;
  color: var(--nb-black);
  border: 1.5px solid var(--nb-black);
  border-radius: var(--r-sm);
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s var(--ease);

  &:hover {
    background: var(--nb-green);
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 0 var(--nb-black);
  }
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
  margin-top: var(--s-5);
}

.nb-btn {
  @include nb-button;

  &-fetch {
    background: #ffea79;
    color: var(--nb-black);
    border: 2px solid var(--nb-black);
    box-shadow: 3px 3px 0 var(--nb-black);

    &:hover {
      background: #ffd633;
      transform: translate(-1px, -1px);
      box-shadow: 4px 4px 0 var(--nb-black);
    }
  }

  &-primary {
    background: var(--nb-green);
    color: var(--nb-black);
  }

  &-secondary {
    background: var(--nb-white);
    color: var(--nb-black);
  }
}

/* Right: Female Avatar Card */
.hero-right {
  display: flex;
  justify-content: center;
}

.avatar-card {
  width: 100%;
  max-width: 440px;
  background: var(--nb-white);
  border: var(--nb-border-thick);
  border-radius: var(--r-lg);
  box-shadow: var(--nb-shadow-lg);
  overflow: hidden;
  transition: transform var(--t-mid) var(--ease), box-shadow var(--t-mid) var(--ease);

  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 12px 12px 0 var(--nb-black);
  }
}

.card-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #0a0a0a;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.dot-red, .dot-yellow, .dot-green {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.card-title {
  margin-left: 6px;
  color: var(--nb-green);
}

.avatar-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #141414;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-sticker {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--nb-green);
  color: var(--nb-black);
  border: 2px solid var(--nb-black);
  border-radius: var(--r-sm);
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 3px 3px 0 var(--nb-black);
  transform: rotate(-3deg);
}

.avatar-corner-badge {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: #0a0a0a;
  color: var(--nb-green);
  border: 2px solid var(--nb-green);
  border-radius: var(--r-sm);
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 3px 3px 0 var(--nb-black);
}

.hero-scroll {
  position: absolute;
  z-index: 4;
  bottom: var(--s-4);
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--nb-black);
  background: var(--nb-green);
  border: 2px solid var(--nb-black);
  box-shadow: 3px 3px 0 var(--nb-black);
  padding: 7px 16px;
  border-radius: var(--r-sm);
  animation: bob 1.8s ease-in-out infinite;

  &:hover {
    background: #00d060;
  }
}

@keyframes bob {
  50% {
    transform: translate(-50%, 6px);
  }
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.25s var(--ease),
    transform 0.25s var(--ease);
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(0.2em);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-0.2em);
}
</style>
