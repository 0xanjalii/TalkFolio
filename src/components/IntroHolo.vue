<script setup lang="ts">
import { useGitHubProfile } from "@/composables/useGitHubProfile";
import femaleConnectImg from "@/content/images/female-connect.jpg";

const { activeProfile } = useGitHubProfile();

const focus = [
  "AssemblyAI Streaming Speech-to-Text",
  "LeMUR Audio Intelligence & LLMs",
  "Real-Time Conversational Voice Interfaces",
  "Speaker Diarization & Auto-Chapters",
  "Low-Latency Audio Streaming Architectures",
];
</script>

<template>
  <section id="holo" class="holo">
    <div class="holo-backdrop">
      <img
        class="holo-bg"
        :src="activeProfile.secondary_avatar || activeProfile.avatar_url || femaleConnectImg"
        :alt="`${activeProfile.name} HUD`"
      />
      <div class="holo-scrim" aria-hidden="true"></div>
    </div>

    <div class="holo-grid">
      <!-- name (upper-left) -->
      <div class="panel panel-name">
        <span class="panel-badge mono">PROFILE</span>
        <p class="who">{{ activeProfile.name }}</p>
        <p class="role-sub mono">{{ activeProfile.role }}</p>
        <p class="where mono">📍 {{ activeProfile.location }}</p>
      </div>

      <!-- bio (lower-left) -->
      <div class="panel panel-bio">
        <span class="panel-badge mono">MISSION</span>
        <p>{{ activeProfile.bio || 'Architecting voice-first intelligent interfaces and streaming audio pipelines with AssemblyAI.' }}</p>
      </div>

      <!-- skills summary (right) -->
      <div class="panel panel-skills">
        <span class="panel-badge mono">SPEECH AI EXPERTISE</span>
        <ul class="focus">
          <li v-for="f in focus" :key="f" class="mono">
            <span class="green-bullet">⚡</span> {{ f }}
          </li>
        </ul>
      </div>

      <!-- track record (right, below skills) -->
      <div class="panel panel-proof">
        <span class="panel-badge mono">BENCHMARKS</span>
        <ul class="stats">
          <li v-for="s in activeProfile.stats" :key="s.label">
            <span class="stat-v">{{ s.value }}</span>
            <span class="stat-l mono">{{ s.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.holo {
  position: relative;
  width: 100%;
  min-height: 100svh;
  overflow: hidden;
  background: #0a0a0a;
  color: #ffffff;
}

.holo-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.holo-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  opacity: 0.55;
  filter: contrast(1.1) brightness(0.85);
}

.holo-scrim {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 50%, rgba(0, 240, 118, 0.08) 0%, rgba(10, 10, 10, 0.75) 75%),
    linear-gradient(to bottom, rgba(10, 10, 10, 0.6) 0%, #0a0a0a 100%);
}

.holo-grid {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-4);
  min-height: 100svh;
  justify-content: center;
  padding: calc(var(--header-h) + var(--s-5)) var(--outer) var(--s-7);

  @include mq(lg) {
    display: contents;
  }
}

/* High-contrast HUD panels */
.panel {
  position: relative;
  width: 100%;
  max-width: 26rem;
  background: #ffffff;
  color: #0a0a0a;
  border: 3px solid #000000;
  border-radius: var(--r-md);
  box-shadow: 6px 6px 0 var(--nb-green);
  padding: var(--s-4) var(--s-5);
  transition: transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 #000000;
  }

  @include mq(lg) {
    position: absolute;
    z-index: 2;
    width: auto;
  }
}

.panel-badge {
  display: inline-block;
  background: var(--nb-green);
  color: #0a0a0a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border: 1.5px solid #0a0a0a;
  border-radius: 3px;
  margin-bottom: 8px;
}

.panel-name {
  @include mq(lg) {
    top: 18%;
    left: 6%;
    min-width: 16rem;
  }
}

.panel-bio {
  @include mq(lg) {
    top: 60%;
    left: 8%;
    max-width: 20rem;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
  }
}

.panel-skills {
  @include mq(lg) {
    top: 22%;
    right: 6%;
    min-width: 18rem;
    max-width: 24rem;
  }
}

.panel-proof {
  @include mq(lg) {
    top: 62%;
    right: 10%;
    min-width: 18rem;
  }
}

.who {
  font-family: var(--f-display);
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 900;
  line-height: 1;
  color: #0a0a0a;
}

.role-sub {
  font-size: 12px;
  font-weight: 700;
  color: #059669;
  margin-top: 4px;
}

.where {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-top: 6px;
}

.focus {
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #0a0a0a;
  }
}

.green-bullet {
  color: #059669;
  font-size: 12px;
}

.stats {
  display: flex;
  gap: var(--s-4);

  li {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}

.stat-v {
  font-family: var(--f-display);
  font-size: clamp(1.8rem, 2.5vw, 2.2rem);
  font-weight: 900;
  line-height: 1;
  color: #0a0a0a;
}

.stat-l {
  font-size: 10px;
  line-height: 1.25;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #475569;
}
</style>
