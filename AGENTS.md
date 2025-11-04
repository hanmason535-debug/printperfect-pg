This repo is used with AI coding agents (e.g., Codex/ChatGPT). These notes help agents navigate and contribute safely.

Project Overview
- Stack: Vite + React + TypeScript + Tailwind + Radix UI + framer-motion
- App source: `src/`
  - Components: `src/components/`
  - UI primitives: `src/components/ui/`
  - Hooks: `src/hooks/`
  - Libs: `src/lib/`
  - Types: `src/types/`
  - Tests: colocated `*.test.tsx` under component dirs
- Build output: `dist/` (ignored)
- Test coverage: `coverage/` (ignored)

Testing
- Runner: Vitest (jsdom)
- Commands:
  - `npm run test` – CI mode
  - `npm run test:watch` – watch mode
  - `npm run test:coverage` – coverage (v8 provider)
- Setup: `vitest.config.ts` + `src/setupTests.ts` (reduces motion for stability)

Conventions
- Use path alias `@` for `src` (see `vitest.config.ts` and Vite config).
- Prefer role/label queries in tests (RTL best practices).
- Keep changes minimal and consistent with surrounding style.

CI
- Workflow runs typecheck + tests before build (see `.github/workflows/`).

Notes for agents
- Do not create or use nested project roots like `home/user/project/...`. Place all code under `src/`.
- Avoid committing build artifacts or large binaries.
- If adding new components, include focused tests where feasible.

