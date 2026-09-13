<script setup lang="ts">
import CustomCursor from "./components/CustomCursor.vue";
import AvatarCallout from "./components/AvatarCallout.vue";
import AppHeader from "./components/AppHeader.vue";
import IntroStage from "./components/IntroStage.vue";
import Experience from "./components/Experience.vue";
import Skills from "./components/Skills.vue";
import Contact from "./components/Contact.vue";
import SiteFooter from "./components/Footer.vue";
import ProfileFetcherModal from "./components/ProfileFetcherModal.vue";
import { useScroll } from "./composables/useScroll";
import { useRoute } from "./composables/useRoute";
import { useSounds } from "./composables/useSounds";

useScroll();
useRoute();
useSounds();
</script>

<template>
  <CustomCursor />
  <AvatarCallout />
  <ProfileFetcherModal />
  <div class="home-wrapper">
    <AppHeader />
    <main>
      <IntroStage />
      <Experience />
      <Skills />
      <Contact />
    </main>
    <SiteFooter />
  </div>
</template>
