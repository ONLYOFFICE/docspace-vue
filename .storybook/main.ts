import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.ts"],
  addons: ["@storybook/addon-docs"],
  // Storybook phones home with anonymous usage data by default.
  core: { disableTelemetry: true },
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  viteFinal: (config) => {
    // vite.config.ts is set up to emit the library bundle; Storybook builds an
    // app, so drop the library-specific build options it would otherwise inherit.
    delete config.build?.lib;
    delete config.build?.rollupOptions;
    return config;
  },
};

export default config;
