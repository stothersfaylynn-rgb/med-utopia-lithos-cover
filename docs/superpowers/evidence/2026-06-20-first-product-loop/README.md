# First Product Loop Verification

## Commit and scope

- Commit under test: `fb035c3` (`fix: honor motion preference on locked surfaces`).
- Task 11 working changes under test: `src/App.test.tsx`, `src/components/ProductShell.tsx`, `src/HomePage.tsx`, `src/ProductGallery.tsx` and `src/product.css`.
- No screenshot was generated or overwritten during Task 11.
- Gate status: **ready to commit**. The user authorized the keyboard-order and hit-area corrections after the first browser audit exposed them.

## Automated gates

Commands run from `/Users/eliyah/Documents/理想国`:

```text
pnpm test
```

- Vitest: 12 files passed, 84/84 tests passed.
- The new full-loop test covers Home -> Cases -> Case Detail -> Apply -> Success and verifies that no file input is introduced.
- Red evidence before the integration fix: 1 new failure at `/cases/acute-aortic-dissection-triage`; the original 80 tests passed.
- Keyboard-order Red: one new test failed because the desktop apply action preceded the theme control; the other 81 tests passed.
- Hit-area Red: two new tests failed because locked Home and `/work` controls had no 44px hit-area contract; the other 82 tests passed.
- Final Green: 84/84 passed.

```text
node --test scripts/validate-design-tokens.node.mjs
```

- Token tests: 3/3 passed, 0 failed.

```text
node scripts/validate-design-tokens.mjs
```

- Result: references resolved, component values tokenized, CSS synchronized.

```text
pnpm build
```

- Production build: passed; 1,599 modules transformed.
- CSS: 99.15 kB, gzip 17.85 kB.
- JS: 185.80 kB, gzip 61.52 kB.
- HTML: 0.89 kB, gzip 0.65 kB.

## Browser loop and history

- Browser URL: `http://127.0.0.1:5173/`.
- Home -> Cases -> representative Case Detail -> contextual Apply -> Success: passed with real links and form controls.
- Submitted URL: `/apply?status=success&source=case-detail&type=contributor&case=acute-aortic-dissection-triage`.
- Filter history: Back restored `/cases?department=急诊医学`; Forward restored `/cases/acute-aortic-dissection-triage`.
- Console errors: none.
- Deferred controls: no file input, password, payment, login, chat, talent-marketplace or B2B control was found in the tested loop.

## Keyboard evidence

- Escape closes the 390px homepage mobile menu and restores focus to `打开主菜单`: passed in the browser.
- The tested controls are semantic native links, buttons, selects and checkboxes; the full-loop test verifies their application behavior.
- Enter uses native `<a href>` controls; Space uses native `<button>` and checkbox controls. No custom keyboard-only control was introduced.
- The in-app browser `press()` operation focused these controls but did not synthesize native Enter-click or Space-toggle default actions; application behavior was therefore verified through semantic DOM inspection plus the integration tests.
- Rendered desktop DOM order on `/cases` is: skip link -> brand -> primary navigation -> theme -> apply CTA -> page controls.
- Result: keyboard-order and focus-restoration gates passed.

## Responsive and touch evidence

- Widths tested: 320, 390, 768 and 1280 CSS px.
- Routes tested at every width: `/`, `/work`, `/cases`, representative case detail, contextual apply and apply success.
- Horizontal overflow: none at every route and width (`scrollWidth === clientWidth`).
- Every rendered interactive target passed the effective 44×44 rule at every tested route and width. Checkbox/radio targets were measured through their clickable labels.
- Locked Home and `/work` controls use a transparent 44×44 pseudo-element hit area. Their visible rectangles remain unchanged: Home case link 88×32, Home apply 104×40, `/work` brand 93.2×24 and `/work` case link 57×25.
- Result: global effective target and zero-overflow gates passed without changing the locked default composition.

## Contrast and focus

- Dark body text/surface: 17.96:1.
- Dark secondary navigation text/surface: 9.88:1.
- Dark primary action text/surface: 10.26:1.
- Light body text/surface: 15.46:1.
- Light secondary navigation text/surface: 7.05:1.
- Light primary action text/surface: 5.54:1.
- Light focus outline/surface: 4.22:1 with a 2px outline.
- Result: sampled text pairs meet 4.5:1 and the sampled focus pair meets 3:1.

## Reduced motion

- Automated motion coverage passed: `src/motion.test.tsx` has 7 passing tests and the App regression suite verifies static Home and directly selectable `/work` states.
- Covered shutdown behavior: particle RAF, pointer RAF, parallax/depth mapping, scroll mapping and continuous reveal serialization.
- The in-app browser exposes viewport control but no reduced-motion media emulation. Runtime reduced-motion behavior was therefore verified by the automated media-query tests, not by changing the user's system preference.

## Approved visual evidence

All files below predate Task 11 and were not regenerated.

### Cases list

Approved source: the cases-list desktop/mobile regions in `docs/previews/direction-a-dark-clinical-archive.png` and `docs/previews/direction-b-medical-archive.png`.

- `cases-desktop-light.png`
- `cases-desktop-dark.png`
- `cases-mobile-light.png`
- `cases-mobile-dark.png`

### Case detail

Approved source: `docs/previews/dual-theme-case-detail.png` and the detail regions in the two approved direction boards.

- `case-detail-desktop-light.png`
- `case-detail-desktop-dark.png`
- `case-detail-mobile-light.png`
- `case-detail-mobile-dark.png`

### Apply

Approved source: `docs/previews/first-loop-apply-desktop.png` and `docs/previews/first-loop-apply-mobile.png`.

- `apply-desktop-light.png`
- `apply-desktop-dark.png`
- `apply-mobile-light.png`
- `apply-mobile-dark.png`

### Home

Approved source: the locked current homepage plus `docs/previews/direction-a-dark-clinical-archive.png` and `docs/previews/direction-b-medical-archive.png`.

- `home-desktop-light.png`
- `home-desktop-dark.png`
- `home-mobile-light.png`
- `home-mobile-dark.png`

## Final gate

- Automated tests, Token checks, build, full product loop, history restoration, console, exact desktop keyboard order, horizontal overflow, effective 44×44 targets and sampled contrast: pass.
- Browser-driver limitations for native Enter/Space default synthesis and reduced-motion emulation are recorded above; semantic controls and automated media-query coverage pass.
- Task 11 is ready for exact staging and commit.
