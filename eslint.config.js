import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "storybook-static", "coverage"]),
  {
    files: ["**/*.{ts,vue}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      pluginVue.configs["flat/recommended"],
    ],
    languageOptions: {
      globals: globals.browser,
      // vue-eslint-parser, which the Vue config installs, parses the single-file
      // component and hands the script blocks over to the parser named here.
      parserOptions: { parser: tseslint.parser },
    },
    rules: {
      "vue/html-quotes": ["error", "double"],
    },
  },
  {
    files: ["**/*.{js,ts,vue}"],
    rules: {
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
    },
  },
]);
