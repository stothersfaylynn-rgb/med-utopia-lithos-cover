# Default Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing dark theme the first-visit default while preserving explicit saved choices.

**Architecture:** Keep theme ownership inside the existing `ThemeProvider`. Replace only the no-preference fallback in `getInitialTheme`; do not change theme tokens, page components, or persistence behavior.

**Tech Stack:** React 18, TypeScript, Vitest, Vite

## Global Constraints

- A valid persisted `light` or `dark` choice always wins.
- Without a valid persisted choice, the theme is always `dark`.
- Do not add dependencies or change visual tokens and CSS.

---

### Task 1: Default to dark without overriding saved choices

**Files:**
- Modify: `src/theme.test.tsx`
- Modify: `src/theme.tsx`
- Modify: `src/components/ProductShell.test.tsx`

**Interfaces:**
- Consumes: browser `localStorage` key `med-utopia-theme`.
- Produces: existing `ThemeProvider` behavior with `dark` as the no-preference fallback.

- [x] **Step 1: Write the failing test**

Replace the system-preference table with a test that stubs a light system preference, renders without saved state, expects `dark`, and expects `matchMedia` not to be called. Update the ProductShell theme-control expectation so the initial dark state offers “切换为浅色主题”.

- [x] **Step 2: Run the focused test to verify Red**

Run: `pnpm test -- src/theme.test.tsx`

Expected: the no-preference assertion fails because current code returns `light` and calls `matchMedia`.

- [x] **Step 3: Implement the minimal fallback**

Change the final return of `getInitialTheme()` from the system preference expression to `return 'dark';`.

- [x] **Step 4: Verify Green and regressions**

Run the focused theme test, full Vitest suite, design-token tests, synchronization validation, TypeScript check, and production build.

- [x] **Step 5: Verify live preview**

Clear `med-utopia-theme` in the local preview, reload `/`, and verify `data-theme="dark"` and the light-theme toggle label.

- [ ] **Step 6: Publish**

Stage only the two theme files plus this design and plan, commit tersely, push `codex/work-gallery-final`, and verify the remote SHA.
