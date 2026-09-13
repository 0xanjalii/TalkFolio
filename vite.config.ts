import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // mixins/functions only (no CSS output) so injecting per-file is safe
        additionalData: `@use "/src/styles/mixins.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap"],
          vendor: ["vue", "lenis"],
        },
      },
    },
  },
});
