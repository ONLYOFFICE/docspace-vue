import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

// Separate from vite.config.ts: that one is set up to emit the library bundle,
// with Vue and the DocSpace SDK marked external.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.{ts,vue}"],
      reporter: ["text", "html"],
    },
  },
});
