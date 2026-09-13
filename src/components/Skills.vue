<script setup lang="ts">
import { useGitHubProfile } from "@/composables/useGitHubProfile";
import Reveal from "./Reveal.vue";

const { activeSkills, activeProfile } = useGitHubProfile();
</script>

<template>
  <section id="skills" class="section skills-sec">
    <span class="paper-note mono" aria-hidden="true">★</span>
    <div class="container">
      <Reveal>
        <span class="stack-tag mono">Technical Stack</span>
        <h2 class="skills-title">Skills</h2>
        <p class="skills-subtitle mono">
          // {{ (activeProfile.login || 'USER').toUpperCase() }} · REPOSITORIES &amp; AUDIO INTELLIGENCE ARCHITECTURE
        </p>
      </Reveal>

      <div class="sgrid">
        <Reveal v-for="(g, i) in activeSkills" :key="g.category" :delay="i * 0.04">
          <div class="sgroup">
            <div class="sgroup-head">
              <span class="sgroup-num mono">0{{ i + 1 }}</span>
              <h3 class="sgroup-t">{{ g.category }}</h3>
            </div>
            <div class="chips">
              <span v-for="item in g.items" :key="item" class="chip mono">{{ item }}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.skills-sec {
  @include manga-paper;
}

/* keep copy above the decorative star stamp */
.container {
  position: relative;
  z-index: 1;
}

/* tilted comic star stamp in the gutter */
.paper-note {
  @include manga-note(-7deg);
}

.stack-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sticky-1);
  background: var(--manga-ink);
  border: 2px solid var(--manga-ink);
  box-shadow: 3px 3px 0 rgba(28, 18, 6, 0.3);
  padding: 4px 12px;
  transform: rotate(-3deg);
}

.skills-title {
  font-family: var(--f-manga);
  font-weight: 400;
  font-size: clamp(3rem, 8vw, 5.5rem);
  line-height: 0.9;
  letter-spacing: 0.01em;
  color: var(--manga-ink);
  margin: var(--s-3) 0 var(--s-2);
  transform: rotate(-1.5deg);
  @include manga-pop;
}

.skills-subtitle {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #555;
  margin-bottom: var(--s-7);
  max-width: 600px;
}


/* even grid — equal-height rows, no ragged masonry bottoms */
.sgrid {
  display: grid;
  gap: var(--s-5);

  @include mq(sm) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include mq(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* each group fills its row's height so cards line up flush */
.sgrid :deep(.reveal) {
  height: 100%;
}

.sgroup {
  @include manga-card($border: 2.5px, $shadow: 5px);
  background: var(--nb-white);
  height: 100%;
  padding: var(--s-5);
  border-radius: var(--r-md);
  transition: transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);

  &:hover {
    transform: translate(-3px, -3px) !important;
    box-shadow: 8px 8px 0 var(--nb-black) !important;
  }
}

.sgroup-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--s-4);
  padding-bottom: 8px;
  border-bottom: 2px dashed #e2e8f0;
}

.sgroup-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  background: var(--nb-green);
  color: var(--nb-black);
  border: 1.5px solid var(--nb-black);
  box-shadow: 2px 2px 0 var(--nb-black);
  border-radius: 4px;
  padding: 2px 6px;
}

.sgroup-t {
  font-family: var(--f-sans);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--nb-black);
  margin: 0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  font-size: 12px;
  color: var(--manga-ink);
  background: #fff;
  border: 2px solid var(--manga-ink);
  box-shadow: 2px 2px 0 var(--manga-ink);
  border-radius: 999px;
  padding: 5px 13px;
  transition:
    transform var(--t-fast) var(--ease),
    box-shadow var(--t-fast) var(--ease);

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 var(--manga-ink);
  }

  @include reduce-motion {
    &:hover {
      transform: none;
    }
  }
}
</style>
