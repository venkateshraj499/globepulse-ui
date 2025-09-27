# Test Agent Guide

This repository now ships with Vitest, React Testing Library, and jsdom so a dedicated unit-test agent can operate autonomously while feature development continues in parallel.

## Mission
- **Auto-generate tests:** Whenever new implementation files are created or existing ones change, immediately author the matching `*.test.jsx` (or `.ts(x)`) file.
- **Keep coverage current:** Expand or refactor tests so that every executable branch introduced by the feature author is exercised.
- **Run a live watcher:** After adding or updating tests, start `npm run test:watch` and keep it running to surface regressions in real time.

## Stack Overview
- **Runner:** Vitest (`npm run test` for CI-style runs, `npm run test:watch` for active development)
- **Renderer:** React Testing Library with jsdom environment
- **Matchers:** `@testing-library/jest-dom` preloaded via `src/setupTests.js`
- **Coverage:** Enabled by default; watch mode reports incremental coverage

## Placement & Naming
- Co-locate tests next to their subjects: `src/<Feature>/<Component>.test.jsx`
- Mirror the component file name and extension; use `.tsx` for TypeScript files
- Prefer React Testing Library queries over implementation-specific selectors; avoid snapshots unless design-locked

## Minimum Expectations Per File
1. **Render smoke test** ensuring component mounts without errors
2. **State coverage** for validation errors, loading/disabled states, success banners, etc.
3. **Accessibility checks** (roles, labels, keyboard behavior)
4. **Critical styling assertions** only when behavior depends on CSS (e.g., gradient background class triggers)

## Standard Workflow
1. Pull latest changes and ensure dependencies are installed (`npm install`).
2. Detect newly added or modified UI modules—create or revise their companion test files immediately.
3. Launch a dedicated watcher terminal: `npm run test:watch`. Keep it running; address any failing suites before handing work back.
4. For bulk edits, narrow the watcher with a pattern (`npm run test:watch -- src/App.test.jsx`) while authoring, then revert to the full suite.
5. When coverage gaps remain, add focused tests until lines/branches for the new work are executed.
6. Summarize results to the feature developer (files tested, scenarios covered, outstanding TODOs or blocked cases).

## Helpful Conventions
- Import through public component entry points to mirror real usage paths.
- Use `user-event` for interactions (typing, clicks, keyboard navigation) to simulate realistic input.
- Mock timers, network, and randomizers to keep tests deterministic.
- Encapsulate provider wrappers (ThemeProvider, Router, etc.) inside helper functions in the test file for clarity.

Following this guide, the testing agent can autonomously create and maintain comprehensive unit coverage while continuously running `npm run test:watch` in its own terminal.
