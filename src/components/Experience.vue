<script setup lang="ts">
import { experience } from "@/content/resume";
import Reveal from "./Reveal.vue";
</script>

<template>
  <section id="experience" class="section exp-sec">
    <span class="paper-note mono" aria-hidden="true">★</span>
    <div class="container">
      <Reveal>
        <p class="eyebrow">Experience</p>
        <h2 class="section-title">A decade building data &amp; AI systems.</h2>
      </Reveal>

      <ol class="exp-grid">
        <Reveal v-for="(entry, i) in experience" :key="entry.company" :delay="i * 0.06">
          <article class="exp-card">
            <h3 class="exp-company">{{ entry.company }}</h3>
            <div v-for="role in entry.roles" :key="role.title + role.period" class="exp-role-block">
              <p class="exp-role">{{ role.title }}</p>
              <p class="exp-period mono">{{ role.period }}</p>
              <ul class="exp-bullets">
                <li v-for="b in role.bullets.slice(0, 3)" :key="b">{{ b }}</li>
              </ul>
            </div>
          </article>
        </Reveal>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.exp-sec {
  @include manga-paper;
}

/* keep copy above the decorative star stamp */
.container {
  position: relative;
  z-index: 1;
}

/* tilted comic star stamp in the gutter */
.paper-note {
  @include manga-note(6deg);
}

/* sticky-note label (matches the Skills "Stack" badge) */
.eyebrow {
  @include manga-sticky;

  &::before {
    display: none;
  }
}

.exp-grid {
  display: grid;
  gap: var(--s-4);

  @include mq(sm) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include mq(lg) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.exp-card {
  @include manga-card();
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  padding: var(--s-5);
  transition:
    transform var(--t-fast) var(--ease),
    box-shadow var(--t-fast) var(--ease);

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 var(--manga-ink);
  }

  @include reduce-motion {
    transition: none;
    &:hover {
      transform: none;
    }
  }
}

/* gentle floating — staggered amplitudes/durations so neighbours don't bob in unison (matches the About HUD) */
@keyframes float-1 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
@keyframes float-2 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-11px); }
}
@keyframes float-3 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.exp-grid :deep(.reveal:nth-child(3n + 1)) .exp-card {
  animation: float-1 5.6s ease-in-out infinite;
}
.exp-grid :deep(.reveal:nth-child(3n + 2)) .exp-card {
  animation: float-3 6s ease-in-out infinite 0.6s;
}
.exp-grid :deep(.reveal:nth-child(3n)) .exp-card {
  animation: float-2 6.8s ease-in-out infinite 1s;
}

@include reduce-motion {
  .exp-grid :deep(.reveal) .exp-card {
    animation: none;
  }
}

.exp-company {
  font-family: var(--f-sans);
  font-weight: 700;
  font-size: 1.15rem;
  line-height: 1.15;
  color: var(--text);
}

.exp-role-block {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
}

.exp-role {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text);
}

.exp-period {
  align-self: flex-start;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--manga-ink);
  background: var(--sticky-1);
  border: 1.5px solid var(--manga-ink);
  box-shadow: 2px 2px 0 var(--manga-ink);
  border-radius: var(--r-sm);
  padding: 2px 10px;
  transform: rotate(-1.5deg);
}

.exp-bullets {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);

  li {
    position: relative;
    padding-left: var(--s-4);
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.45;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 8px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent);
    }
  }
}
</style>
