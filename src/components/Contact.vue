<script setup lang="ts">
import { useGitHubProfile } from "@/composables/useGitHubProfile";
import { useAssemblyAI } from "@/composables/useAssemblyAI";
import Reveal from "./Reveal.vue";
import femaleConnectImg from "@/content/images/female-connect.jpg";

const { activeProfile } = useGitHubProfile();
const { isListening, toggleListening, transcriptText } = useAssemblyAI();
</script>

<template>
  <section id="contact" class="contact">
    <div class="container contact-inner">
      <div class="contact-card">
        <div class="card-header mono">
          <span class="dot-red"></span>
          <span class="dot-yellow"></span>
          <span class="dot-green"></span>
          <span class="header-title">DISPATCH_COMMUNICATION.IO</span>
        </div>

        <div class="contact-grid">
          <!-- Left: Portrait & Info -->
          <div class="contact-left">
            <div class="portrait-box">
              <img
                :src="activeProfile.secondary_avatar || activeProfile.avatar_url || femaleConnectImg"
                :alt="activeProfile.name"
                class="portrait-img"
              />
              <div class="portrait-badge mono">{{ activeProfile.name.toUpperCase() }} // READY TO BUILD</div>
            </div>
            <div class="quick-status mono">
              <span class="live-dot"></span> Open for Engineering &amp; Project Collaboration
            </div>
          </div>

          <!-- Right: Contact Actions -->
          <div class="contact-right">
            <Reveal>
              <p class="eyebrow">Direct Contact</p>
              <h2 class="contact-title">Let's build something worth <em>talking</em> to.</h2>
              <p class="contact-sub">Have a voice AI concept, streaming audio pipeline, or speech intelligence project? Drop me a line or leave a voice memo.</p>

              <!-- Voice Memo with AssemblyAI -->
              <div class="voice-memo-card mono">
                <div class="memo-header">
                  <span>🎙️ Voice Memo (AssemblyAI Live STT)</span>
                  <span v-if="isListening" class="live-tag">RECORDING</span>
                </div>
                <div class="memo-body">
                  <button
                    class="memo-btn"
                    :class="{ recording: isListening }"
                    @click="toggleListening"
                  >
                    {{ isListening ? '⏹ Stop & Transcribe' : '🎙️ Record Voice Memo' }}
                  </button>
                  <p v-if="transcriptText" class="memo-text">"{{ transcriptText }}"</p>
                </div>
              </div>

              <!-- Main Contact Link -->
              <a class="contact-cta mono" :href="activeProfile.x" target="_blank" rel="noopener" data-cursor="open">
                Say Hello on X (Twitter) ↗
              </a>

              <!-- Social Pills -->
              <div class="socials">
                <a
                  v-for="s in activeProfile.socials"
                  :key="s.label"
                  class="social mono"
                  :href="s.url"
                  target="_blank"
                  rel="noopener"
                  data-cursor="open"
                >
                  {{ s.label }} ↗
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact {
  position: relative;
  overflow: hidden;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: var(--section-y);
  background: var(--bg);
  @include manga-paper;
}

.contact-inner {
  position: relative;
  z-index: 2;
  width: 100%;
}

.contact-card {
  background: var(--nb-white);
  border: var(--nb-border-thick);
  border-radius: var(--r-lg);
  box-shadow: var(--nb-shadow-lg);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: #0a0a0a;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
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

.header-title {
  margin-left: 6px;
  color: var(--nb-green);
}

.contact-grid {
  display: grid;
  gap: var(--s-6);
  padding: var(--s-6);

  @include mq(lg) {
    grid-template-columns: 0.8fr 1.2fr;
    gap: var(--s-8);
    padding: var(--s-8);
  }
}

.portrait-box {
  position: relative;
  border: var(--nb-border);
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: 6px 6px 0 var(--nb-black);
}

.portrait-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.portrait-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: var(--nb-green);
  color: var(--nb-black);
  border: 2px solid var(--nb-black);
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
  border-radius: var(--r-sm);
  box-shadow: 2px 2px 0 var(--nb-black);
}

.quick-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--s-4);
  font-size: 12px;
  font-weight: 700;
  color: var(--nb-black);
  background: var(--nb-green-light);
  border: 1.5px solid var(--nb-black);
  padding: 8px 12px;
  border-radius: var(--r-sm);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nb-green-dark);
  box-shadow: 0 0 6px var(--nb-green);
}

.contact-title {
  font-family: var(--f-display);
  font-size: clamp(2.4rem, 5vw, 4.2rem);
  font-weight: 900;
  line-height: 1.05;
  margin: var(--s-3) 0;
  color: var(--nb-black);

  em {
    font-style: normal;
    background: var(--nb-green);
    padding: 0 6px;
    border: 2px solid var(--nb-black);
    box-shadow: 3px 3px 0 var(--nb-black);
  }
}

.contact-sub {
  font-size: 1.1rem;
  line-height: 1.55;
  color: var(--muted);
  margin-bottom: var(--s-5);
  font-weight: 500;
}

.voice-memo-card {
  background: #f8fafc;
  border: 2px solid var(--nb-black);
  box-shadow: 3px 3px 0 var(--nb-black);
  border-radius: var(--r-sm);
  padding: var(--s-4);
  margin-bottom: var(--s-5);
}

.memo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 800;
  margin-bottom: var(--s-3);
}

.live-tag {
  background: #ff4d4d;
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  animation: pulse 1s infinite alternate;
}

.memo-btn {
  @include nb-button(var(--nb-green));
  padding: 8px 14px;
  font-size: 12px;

  &.recording {
    background: #ff4d4d;
    color: #ffffff;
  }
}

.memo-text {
  margin-top: var(--s-3);
  background: #0a0a0a;
  color: var(--nb-green);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.contact-cta {
  @include nb-button(var(--nb-green));
  display: inline-flex;
  font-size: 14px;
  padding: 12px 24px;
  margin-bottom: var(--s-5);
}

.socials {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
}

.social {
  background: var(--nb-white);
  border: 2px solid var(--nb-black);
  box-shadow: 3px 3px 0 var(--nb-black);
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--nb-black);
  padding: 8px 16px;
  transition: all 0.15s var(--ease);

  &:hover {
    background: var(--nb-green);
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 var(--nb-black);
  }
}
</style>
