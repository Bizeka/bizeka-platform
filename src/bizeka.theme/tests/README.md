# Bizeka.Theme visual and contrast tests

The theme tests are intentionally dependency-light so they can run in a clean
Node install without a browser or an OS-specific screenshot renderer.

```sh
npm run test:theme
npm run test:hygiene
npm run test:components
npm run test:contrast:strict
npm run test:visual:update   # approve an intentional token/snapshot change
```

`test:contrast` parses the light and dark token blocks, calculates WCAG
relative luminance/contrast ratios, checks that dark surfaces are not light
surfaces in disguise, verifies that dark semantic tokens have explicit
counterparts, and verifies that every contrast-sensitive component has an
override. It also reports foreground/background pairs that are both light
toned. `--strict` promotes the recommended 4.5:1 accent text check from a
warning to a failure.

`test:components` checks the Serenity integration aliases and representative
selectors for checkboxes, toolbar actions, tabs, and upload editors. This is a
static contract; it deliberately complements (rather than pretends to replace)
browser computed-style tests.

`test:hygiene` parses the override cascade and fails when the same selector
assigns the same property more than once. This catches stale copy/paste blocks
and declarations that silently depend on source order. Intentional state
overrides (for example `:hover`, `:focus`, and `:disabled`) remain separate
selectors, so they are not collapsed into a single ambiguous rule.

`test:visual` writes deterministic SVG baselines to `tests/snapshots`. The
fixtures show canvas/surface/text, muted text, input/select borders, accent
button text, alternating grid rows, checkbox, delete action, and upload
surfaces. SVG avoids font rasterization and browser-version noise while still
producing reviewable visual artifacts in CI. The `test:theme` suite runs
contract, component, contrast, and visual checks independently,
so a contrast failure does not prevent the visual artifacts from being produced.

## Stabilization roadmap

1. Run `npm run test:theme` on every pull request and publish the two SVG files
   as CI artifacts. Do not update snapshots automatically in CI.
2. Resolve every contrast failure/warning in `tokens.css`, then enable
   `npm run test:theme:strict` as the required theme gate.
3. Add computed-style checks for representative Serenity controls (native
   select, Select2, Flatpickr, SlickGrid, dialog) using a pinned browser once
   the token baseline is clean.
4. Add Playwright screenshots only for the small set of layout breakpoints
   (desktop, tablet, mobile); pin the browser version and use a fixed font,
   viewport, device scale, and reduced-motion setting.
5. Treat snapshot diffs as reviewed design changes: update the SVG baseline and
   record the token/selector reason in the pull request.
