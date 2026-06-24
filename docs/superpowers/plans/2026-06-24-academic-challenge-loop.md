# Academic Challenge Loop Implementation Plan

> **For agentic workers:** Execute inline under `$med-utopia-loop`; subagents are prohibited for this run. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a complete, accessible `/challenges` list → detail → related case/application → success-return loop using the approved “任务卷宗” previews.

**Architecture:** Add one typed Mock-data module and one pure URL-filter module, extend the existing finite router, and compose two route pages inside the existing `ProductShell`. Reuse the existing application form and case/gallery surfaces through explicit slugs and query parameters; do not add a router, state library, API, or generic content abstraction.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, JSDOM, existing CSS/token system.

## Global Constraints

- Work on `codex/work-gallery-final`; do not create a worktree or branch.
- Use TDD for every feature: add test, observe expected Red, implement minimum Green, run regression.
- Do not commit T02–T07 separately; the user authorized one exact stage commit only after all Tasks pass.
- Preserve unrelated untracked files and never use broad staging.
- Do not add dependencies, login, payment, upload, station submission, chat, profiles, ranking, marketplace, B2B admin, fake deadlines, or countdowns.
- Do not change the locked homepage composition or `/work` choreography.
- Match the approved preview with existing tokens; no raw colors, gradients, glass, wide shadows, oversized radii, or decorative motion.

---

### Task 1: Stage contract and approved specification

**Files:**
- Create: `docs/superpowers/specs/2026-06-24-academic-challenge-loop-design.md`
- Create: `docs/superpowers/plans/2026-06-24-academic-challenge-loop.md`
- Create: `docs/previews/academic-challenge-loop/direction-a-desktop-list-detail.png`
- Create: `docs/previews/academic-challenge-loop/direction-a-mobile-list-detail.png`

- [x] Verify live Git and baseline tests.
- [x] Generate desktop/mobile previews before UI code.
- [x] Obtain explicit user approval for Direction A.
- [ ] Self-review spec/plan for placeholders, contradictions, ambiguous fields, and scope drift.
- [ ] Resume loop and complete T01 with commit `none`.

### Task 2: Challenge content contract

**Files:**
- Create: `src/data/challenges.test.ts`
- Create: `src/data/challenges.ts`

**Interfaces:**
- Produces: `ChallengeRecord`, `challenges`, `getChallengeBySlug(slug)`.

- [ ] Write tests asserting exactly three approved IDs/slugs, all required content fields, `滚动招募`, valid related-case slugs, and lookup hit/miss.
- [ ] Run `pnpm test -- src/data/challenges.test.ts`; expect import/module Red because production data does not exist.
- [ ] Implement the typed records with reviewed Mock copy and no fabricated institutions/deadlines.
- [ ] Run the focused test and `src/data/cases.test.ts`; expect Green.
- [ ] Review diff, record evidence with commit `none`, then advance.

### Task 3: Routes and category filters

**Files:**
- Modify: `src/router.test.ts`, `src/router.ts`
- Create: `src/challengeFilters.test.ts`, `src/challengeFilters.ts`
- Modify: `src/components/ProductShell.test.tsx`, `src/components/ProductShell.tsx`

**Interfaces:**
- Produces router variants `{ name: 'challenges'; search: string }` and `{ name: 'challenge-detail'; challengeSlug: string }`.
- Produces `ChallengeFilters`, `parseChallengeFilters`, `filterChallenges`, `buildChallengeSearch`.

- [ ] Add route tests for list/detail/trailing slash/encoded slug and rejection of nested malformed routes; add active-nav detail test.
- [ ] Add pure filter tests for known/unknown category, three category outcomes, empty result, and deterministic query serialization.
- [ ] Run focused tests; expect Red because routes/filter module/current-path support are absent.
- [ ] Implement minimum parser variants, filter functions, and challenge active-path rule.
- [ ] Run focused tests plus full router/shell regression; expect Green.
- [ ] Review diff, record evidence with commit `none`, then advance.

### Task 4: Challenge detail reading path

**Files:**
- Create: `src/pages/ChallengeDetailPage.test.tsx`, `src/pages/ChallengeDetailPage.tsx`
- Modify: `src/App.test.tsx`, `src/App.tsx`, `src/product.css`

**Interfaces:**
- Consumes: `getChallengeBySlug`, `getCaseBySlug`, new router variant.
- Produces: `ChallengeDetailPage({ challengeSlug })`.

- [ ] Add page tests for known content, anchor IDs `answer-sample`/`expert-note`/`related-case`, real related-case/application URLs, preview state without application link, and unknown-slug recovery.
- [ ] Add App route-render test and run focused tests; expect Red because page/render branch is absent.
- [ ] Implement semantic detail DOM in approved order, then add token-only desktop/mobile styles matching the approved preview.
- [ ] Run focused tests and App regression; expect Green.
- [ ] Verify list-independent detail route in browser at 1280 and 390, light/dark; record evidence and commit `none`.

### Task 5: Challenge list discovery path

**Files:**
- Create: `src/pages/ChallengesPage.test.tsx`, `src/pages/ChallengesPage.tsx`
- Modify: `src/challengeFilters.test.ts`, `src/challengeFilters.ts`
- Modify: `src/App.test.tsx`, `src/App.tsx`, `src/product.css`

**Interfaces:**
- Consumes: `challenges`, filter functions, `navigate`.
- Produces: `ChallengesPage({ search })`.

- [ ] Correct the approved filter contract to include `病例复盘`; its lack of a matching Mock record intentionally drives the empty reset state.
- [ ] Add tests for three rows, query-filtered results, result announcement, empty reset, and real detail links; add App render test.
- [ ] Run focused tests; expect Red because the page/render branch is absent.
- [ ] Implement native select, archive rows, mobile labels, and clear-filter button; add approved token-only responsive styles.
- [ ] Run focused tests and App regression; expect Green.
- [ ] Verify at 1280 and 390 in both themes; record evidence and commit `none`.

### Task 6: Challenge participation handoff

**Files:**
- Modify: `src/router.test.ts`, `src/router.ts`, `src/applyForm.test.ts`, `src/applyForm.ts`
- Modify: `src/pages/ApplyPage.test.tsx`, `src/pages/ApplyPage.tsx`, `src/product.css`

**Interfaces:**
- Extends `ApplyQuery` and `getApplyContext` with `challengeSlug: string | null`.

- [ ] Add Red tests for parsing/preserving `challenge`, challenge title context, academic-module preselection, and success return link.
- [ ] Run focused tests; expect assertions to fail because challenge context is dropped.
- [ ] Add the query field, challenge lookup/context line, lazy initial module selection, success query preservation, and `/challenges` return link.
- [ ] Run apply/router focused tests and existing case-application tests; expect Green.
- [ ] Browser-check challenge → apply → success without network activity; record evidence and commit `none`.

### Task 7: Cross-module closure

**Files:**
- Modify: `src/data/cases.test.ts`, `src/data/cases.ts`
- Modify: `src/pages/CaseDetailPage.test.tsx`, `src/pages/CaseDetailPage.tsx`
- Modify: `src/galleryContent.ts`, `src/ProductGallery.tsx`, `src/App.test.tsx`, `src/product.css`

**Interfaces:**
- Extends every `CaseRecord` with `relatedChallengeSlug`.
- Makes the existing gallery challenge record expose `/challenges` without changing selection/motion behavior.

- [ ] Add Red tests for all case relationships, case-detail related challenge link, and gallery challenge destination.
- [ ] Run focused tests; expect missing fields/links.
- [ ] Add exact slug relationships, related-challenge section, and existing gallery href only.
- [ ] Run focused and motion regression tests; expect Green.
- [ ] Browser-check case → challenge and gallery → challenge while preserving locked visuals; record evidence and commit `none`.

### Task 8: Dependency closure, exact commit, and push

**Files:**
- Modify: `docs/HANDOFF.md`
- Create: `docs/superpowers/evidence/2026-06-24-academic-challenge-loop/*`
- Stage only files listed by T01–T08.

- [ ] Read `references/completion-contract.md` and `verification-before-completion` before claims.
- [ ] Run focused stage tests, full `pnpm test`, token tests, token synchronization, and `pnpm build` using the bundled runtime PATH.
- [ ] Run browser QA at 1280×720 and 390×844 in light/dark; verify overflow, console, headings, focus targets, and approved-preview fidelity; save evidence screenshots.
- [ ] Update `docs/HANDOFF.md` with current verified state, exact test counts, branch, HEAD, and next scope boundary.
- [ ] Review `git diff --check`, tracked/untracked allowlist, and dependency closure; stage exact paths only.
- [ ] Commit once with `feat: close academic challenge loop`.
- [ ] Re-run clean-HEAD verification, push `codex/work-gallery-final`, and verify remote branch matches local HEAD.
