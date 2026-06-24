# Expert Curation Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a traceable `/curators` index that connects three Mock experts to curated cases, in-context commentary, and a no-login curation application path.

**Architecture:** Add one canonical typed expert module and reciprocal curator slugs on existing cases. Keep the UI as one route rendered by `CuratorsPage`; reuse the existing router, shell, case filters, application state, and product-gallery destination maps. No expert-detail route or new dependency is introduced.

**Tech Stack:** React 18, TypeScript 5.6, Vite 5, Vitest/jsdom, existing CSS design tokens.

## Global Constraints

- Follow the approved preview `docs/previews/expert-curation-loop/direction-a-desktop-mobile-board.png` before writing curator UI.
- Chinese-first, restrained, academic-medical, high-signal, and concise.
- All identities and content remain visibly Mock; no real authority claims.
- No login, payment, upload, chat, consultation, profiles, rankings, talent marketplace, B2B admin, or new dependency.
- No homepage composition or `/work` choreography changes.
- Use RED → GREEN for every behavior change; run focused tests before regression checks.
- Do not commit T02-T07 separately. Stage one exact allowlist only in T08, then verify from a clean HEAD snapshot and push the current branch.

---

### Task 1: Approved design and execution contract

**Files:**
- Create: `docs/previews/expert-curation-loop/direction-a-desktop-mobile-board.png`
- Create: `docs/superpowers/specs/2026-06-24-expert-curation-loop-design.md`
- Create: `docs/superpowers/plans/2026-06-24-expert-curation-loop.md`

**Interfaces:**
- Consumes: approved visual direction A and IA v1.
- Produces: exact page hierarchy, query names, routes, exclusions, and test matrix used by Tasks 2-8.

- [x] Generate desktop/mobile preview before UI code.
- [x] Obtain explicit user approval.
- [x] Write the design specification and implementation plan.
- [ ] Run placeholder and interface consistency scans.

### Task 2: Expert content contract

**Files:**
- Create: `src/data/experts.test.ts`
- Create: `src/data/experts.ts`
- Modify: `src/data/cases.ts`
- Modify: `src/data/cases.test.ts`

**Interfaces:**
- Produces: `ExpertRecord`, `experts`, `expertSlugs`, `getExpertBySlug(slug)`, and `CaseRecord.curatorSlug`.

- [ ] Add failing tests requiring exactly three unique expert records and valid reciprocal case/commentary relations.
- [ ] Run `npm test -- --run src/data/experts.test.ts src/data/cases.test.ts`; expect failure because `./experts` and `curatorSlug` do not exist.
- [ ] Implement the exact `ExpertRecord` contract from the design spec and add one curator slug to each case.
- [ ] Re-run the focused command; expect all tests to pass.
- [ ] Review only the four Task 2 files and record RED/GREEN evidence with commit `none`.

### Task 3: Curator route and navigation

**Files:**
- Modify: `src/router.test.ts`
- Modify: `src/router.ts`
- Modify: `src/components/ProductShell.test.tsx`
- Modify: `src/components/ProductShell.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `AppRoute` member `{ name: 'curators' }` and `/curators` rendering branch.

- [ ] Add failing assertions for `/curators`, rejection of `/curators/:slug`, active curator navigation, and a curator-page render hook.
- [ ] Run `npm test -- --run src/router.test.ts src/components/ProductShell.test.tsx src/App.test.tsx`; expect route/navigation/page failures.
- [ ] Add the finite route, exact current-path match, `CuratorsPage` import, and render branch. A temporary import error is resolved in the same GREEN step by Task 4's page module only after its own RED test exists.
- [ ] Re-run focused router/shell assertions that do not require the page module; expect them to pass.

### Task 4: Expert curation reading surface

**Files:**
- Create: `src/pages/CuratorsPage.test.tsx`
- Create: `src/pages/CuratorsPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/product.css`

**Interfaces:**
- Consumes: `experts`, `getCaseBySlug`, `/curators` route.
- Produces: `<CuratorsPage />` with three `article[data-expert-slug]` records and approved link targets.

- [ ] Add a failing page test for one h1, exact intro/disclaimer, three records, data relationships, real CTAs, and absence of profile/social/consultation controls.
- [ ] Run `npm test -- --run src/pages/CuratorsPage.test.tsx src/App.test.tsx`; expect failure because the page is absent.
- [ ] Implement the minimal semantic page. Each record links to `/cases?curator=...`, `/cases/...#expert-commentary`, and `/apply?source=curators&type=curation&expert=...`.
- [ ] Add approved responsive styles using existing tokens only: three-column ledger on desktop, one-column dossier on mobile, teal curation spine, visible focus, 44px actions.
- [ ] Re-run focused tests and `npm run build`; expect pass.
- [ ] Verify desktop/mobile and light/dark against the approved preview before marking GREEN.

### Task 5: Curator-filtered case discovery

**Files:**
- Modify: `src/caseFilters.test.ts`
- Modify: `src/caseFilters.ts`
- Modify: `src/pages/CasesPage.test.tsx`

**Interfaces:**
- Extends `CaseFilters` with `curator: string` and uses `expertSlugs` as the approved enum.

- [ ] Add failing tests for `?curator=zhou-heng`, deterministic serialization, unknown-curator recovery, and page result count.
- [ ] Run `npm test -- --run src/caseFilters.test.ts src/pages/CasesPage.test.tsx`; expect failures because curator is ignored.
- [ ] Parse, filter, and serialize the curator field without changing `CasesPage` composition; existing select changes preserve the curator value through `buildCaseSearch`.
- [ ] Re-run focused tests; expect pass with all existing filter behavior green.

### Task 6: Expert-aware application handoff

**Files:**
- Modify: `src/router.test.ts`
- Modify: `src/router.ts`
- Modify: `src/applyForm.test.ts`
- Modify: `src/applyForm.ts`
- Modify: `src/pages/ApplyPage.test.tsx`
- Modify: `src/pages/ApplyPage.tsx`

**Interfaces:**
- Extends `ApplyQuery` and `getApplyContext` with `expertSlug: string | null`.

- [ ] Add failing tests for approved `expert` parsing, selected expert copy, only “专家策展” preselected, preserved success query, and `/curators` return link.
- [ ] Run `npm test -- --run src/router.test.ts src/applyForm.test.ts src/pages/ApplyPage.test.tsx`; expect expert-context failures.
- [ ] Read the expert with `getExpertBySlug`, show `来自策展：{name}`, preserve `expert`, preselect expert curation for `type=curation`, and return to curators on success.
- [ ] Re-run focused tests and existing case/challenge application tests; expect pass and no fetch call.

### Task 7: Existing gallery entry

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/ProductGallery.tsx`

**Interfaces:**
- Extends `workDestinations` with `专家策展: '/curators'`.

- [ ] Add a failing App assertion that the existing expert-curation slab has one `/curators` link.
- [ ] Run `npm test -- --run src/App.test.tsx`; expect the new assertion to fail.
- [ ] Add only the destination-map entry; do not modify gallery layout, styles, motion, content, or homepage.
- [ ] Re-run App and motion tests; expect pass.

### Task 8: Closure, commit, clean-HEAD verification, and push

**Files:**
- Modify: `docs/HANDOFF.md`
- Create: `docs/superpowers/evidence/2026-06-24-expert-curation-loop/**`
- Include: exact files produced by Tasks 1-7.

**Interfaces:**
- Produces: canonical handoff, reproducible evidence, one stage commit, and matching local/remote branch refs.

- [ ] Run focused curator tests, then `npm test` and record the exact pass count.
- [ ] Run token tests, `node scripts/validate-design-tokens.mjs`, `npm run build`, and `git diff --check`.
- [ ] Browser-QA `/curators`, `/cases?curator=zhou-heng`, and expert-aware `/apply` at 1280×720 and 390×844 in Light/Dark; record screenshots and console/overflow/44px evidence.
- [ ] Review the aggregate diff against the spec and build an exact stage allowlist; exclude `.agents`, `.impeccable`, `.planning`, backups, root notes, `skills-lock.json`, and unrelated `tmp`.
- [ ] Commit once with `feat: close expert curation loop`.
- [ ] Export `HEAD` into a temporary clean directory, install from lockfile, and rerun full tests, token validation, TypeScript, and production build.
- [ ] Push `codex/work-gallery-final`; verify local HEAD, upstream ref, and remote ref are identical.

## Plan self-review

- Spec coverage: data, route, page, case query, apply query, gallery entry, browser QA, docs, clean-HEAD closure, and push are each assigned once.
- Placeholder scan: no TBD/TODO or unnamed implementation step remains.
- Type consistency: `curator` is the case query key; `expert` is the application query key; `expertSlug` is the internal field name; all CTA targets match the design spec.
- Scope correction: no reverse case-detail-to-curator link is added because it was not shown in the approved preview or required by IA v1.
