import { createApp } from "vue";
import { inject as injectAnalytics } from "@vercel/analytics";
import "./styles/index.scss";
import App from "./App.vue";
import { vMagnetic, vTilt, vParallax } from "./directives";

// Vercel Web Analytics — framework-agnostic (no vue-router here; it auto-tracks our
// history.pushState/popstate navigations). Only sends data on the Vercel prod deploy.
injectAnalytics();

createApp(App)
  .directive("magnetic", vMagnetic)
  .directive("tilt", vTilt)
  .directive("parallax", vParallax)
  .mount("#app");
