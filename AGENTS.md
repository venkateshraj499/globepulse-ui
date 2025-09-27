# Repository Guidelines

## Project Structure & Module Organization
The React application lives in `src/`, with `main.jsx` bootstrapping and `App.jsx` hosting the UI layout. Component-level tests pair with source files using the `.test.jsx` suffix (for example, `App.test.jsx`). Shared test configuration resides in `src/setupTests.js`. Build artefacts land in `dist/`; most should stay untracked. `coverage/` stores Vitest reports for quick inspection, while `screenshots/` and the wireframe documents capture UX references. Keep assets colocated with the component that owns them, and promote shared utilities into clearly named subfolders when they appear in three or more modules.

## Build, Test, and Development Commands
- `npm install`: install dependencies defined in `package.json`.
- `npm run dev`: start the Vite dev server with fast refresh on `http://localhost:5173`.
- `npm run build`: generate a production bundle into `dist/` for deployment previews.
- `npm run preview`: serve the last production build locally; use this to sanity-check optimized output.
- `npm run test`: execute the Vitest suite once with coverage output in `coverage/`.
- `npm run test:watch`: run the same tests in watch mode during active development.

## Coding Style & Naming Conventions
Prefer 2-space indentation and ES module syntax. Author React function components in PascalCase files (`FeaturePanel.jsx`), and export a single component per file when possible. Keep hooks and helpers in camelCase. Styling uses MUI with Emotion; continue leveraging `makeStyles` or MUI SX consistently, and extract shared tokens into dedicated helpers before duplication spreads. Run Prettier (if configured locally) before committing to maintain consistent formatting.

## Testing Guidelines
Vitest with Testing Library is the primary stack. Name spec files `<Component>.test.jsx` and colocate them beside the component. Aim to cover critical branches, especially validation logic in `App.jsx`. Run `npm run test` before pushing; inspect `coverage/index.html` to confirm meaningful lines stay above ~80% coverage. Use Testing Library queries that mirror user behaviour (`findByRole`, `getByLabelText`) to avoid brittle selectors.

## Commit & Pull Request Guidelines
The distributed archive lacks Git history, so treat Conventional Commits as the baseline: `type(optional-scope): succinct summary` (example: `feat(form): validate passwords`). Reference any related issue IDs in the body and note UX-impacting changes with screenshots from `npm run preview`. Pull requests should list testing performed, mention coverage deltas when relevant, and highlight any new environment variables or configuration steps contributors must perform.
