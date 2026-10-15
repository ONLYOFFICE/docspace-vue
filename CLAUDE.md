# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@onlyoffice/docspace-vue` — a Vue 3 library that publishes a single `DocSpace` component wrapping the ONLYOFFICE Apps (formerly DocSpace) JS SDK (`@onlyoffice/docspace-sdk-js`). It is a library, not an app: there is no `index.html` and no dev server other than Storybook.

## Commands

Node version is pinned in `.nvmrc` (24).

- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm test` — Vitest once (jsdom); `npm run test:watch`, `npm run test:coverage`
- Single test: `npx vitest run tests/DocSpace.test.ts -t "renders the element"`
- `npx vue-tsc -b --force` — full typecheck, as CI runs it (covers `src`, `stories`, `tests`, `.storybook`, and the Vite configs — wider than the build)
- `npm run build` — `vue-tsc -b` → `vite build` (ESM `dist/index.js` + CJS `dist/index.cjs`) → `vue-tsc -p tsconfig.build.json` (declarations only, `src` only, into `dist`)
- `npm run storybook` / `npm run build-storybook` — needs `.env` copied from `.env.example` with `VITE_DOCSPACE_URL` (and `VITE_DOCSPACE_FILE_ID` for the Editor story) pointing at a real ONLYOFFICE Apps instance

## Architecture

- `src/index.ts` → `src/components/DocSpace/index.ts` re-exports `DocSpace` and the `DocSpaceProps` / `DocSpaceEmits` types. Public API changes go through both barrels.
- `DocSpace.vue` lifecycle: on mount, `new SDK().initFrame(props.config)` and emit `set-docspace-instance` with the `SDKInstance`; on unmount, `destroyFrame()`. The `config` prop is **deliberately not watched** — recreating the frame would discard the user's session; consumers call `instance.setConfig(...)` instead. Don't add a watcher.
- The template is a single-root wrapper `div` sized from `config.width`/`config.height` (default `100%`) with `line-height: 0` (prevents the inline iframe's descender gap from overflowing the wrapper), containing `<div :id="config.frameId">` that the SDK mounts into. Keep it single-root — comments are placed outside `<template>` on purpose, since a comment inside would make the component multi-root and break attribute inheritance.
- SDK types are imported from deep paths: `@onlyoffice/docspace-sdk-js/dist/types/instance` and `.../dist/types/types` (`TFrameConfig`).
- `vue` and `@onlyoffice/docspace-sdk-js` are **peer dependencies** and marked external in `vite.config.ts`; never bundle them. The SDK is also a devDependency for building/tests.
- Three separate Vite contexts: `vite.config.ts` (library build), `vitest.config.ts` (separate on purpose, no lib/external settings), and `.storybook/main.ts` (strips `build.lib` / `rollupOptions` in `viteFinal`).
- Tests mock the SDK with `vi.mock("@onlyoffice/docspace-sdk-js", ...)` using `vi.hoisted` spies for `initFrame` / `destroyFrame`, and render via `@testing-library/vue`; `tests/setup.ts` wires up jest-dom matchers.
- TypeScript project references: `tsconfig.json` → `tsconfig.lib.json` (sources, stories, tests, `.storybook` files listed individually because TS wildcards skip dot-dirs) + `tsconfig.node.json` (Vite/Vitest configs). `verbatimModuleSyntax` and `erasableSyntaxOnly` are on — use `import type` and avoid enums/namespaces/parameter properties.

## Conventions

- Every source file starts with the Ascensio System SIA Apache-2.0 license header (copy from an existing file).
- Lint enforces double quotes (also in Vue templates) and semicolons.
- Commits follow Conventional Commits (`feat:`, `chore(deps):`, `ci(release):` …).

## Release flow

Version lives only in `package.json`. Bumping it on `master` (on the internal, non-github.com mirror) triggers `create-tag.yml`, which requires a matching `## <version>` section in `CHANGELOG.md` and pushes tag `v<version>`. On github.com, the `v*` tag triggers `release.yml`: checks tag == package version, runs tests, `npm publish --provenance` (build happens via `prepack`), and creates a GitHub release from that CHANGELOG section. So a release = bump `package.json` version + add a `CHANGELOG.md` section.
