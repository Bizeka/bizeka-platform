# Bizeka.Theme

[![Serenity](https://img.shields.io/badge/Platform-Serenity-success.svg)](https://github.com/serenity-is/Serenity)

`Bizeka.Theme` is a small, token-driven **Serene** preset for Serenity applications. It is designed as an override layer, not a replacement theme: Serenity's standard layout, menu, Bootstrap dialog behavior, `common-theme.css`, and `slick.grid.base.css` remain the source of structural truth.

The package deliberately contains one community preset with one configurable accent. Light and dark mode are implemented through semantic CSS tokens, so component colors remain consistent without a matrix of duplicate themes.

## Install

Install the NuGet package and, if you use the optional runtime helper, the NPM package:

```sh
dotnet add package Bizeka.Theme
npm install @bizeka/theme
```

Load the stylesheet **after** Serenity's `common-theme.css` and `slick.grid.base.css`:

```html
<link rel="stylesheet" href="/_content/Bizeka.Theme/bizeka-theme/bizeka-theme.css" />
```

For an application-local project reference, use the static asset path exposed by that project's static-web-asset manifest.

## Activate the preset

Static activation needs no JavaScript:

```html
<html data-bizeka-theme="bizeka" data-bizeka-mode="light">
```

Or use the small browser helper. `system` is the default mode and resolves to the operating-system preference. Only color values supported by the browser are accepted as accent inputs.

```ts
import { applyBizekaTheme } from "@bizeka/theme";

applyBizekaTheme({
    mode: "system",
    accent: "#5267ed"
});
```

The helper stores its choice in `localStorage`; pass `persist: false` for a session-only change. `clearBizekaTheme()` removes only the attributes and inline accent written by this package.

## Host setup in one call

In a Serene host, call `initBizekaTheme()` once from `Modules/Common/ScriptInit.ts`. It applies the saved mode and accent, follows operating-system changes while the mode is `system`, and adds a light / dark / system menu to the header actions, next to the language and user menus:

```ts
import { initBizekaTheme } from "@bizeka/theme";

initBizekaTheme();
```

`ScriptInit` runs as a deferred module, after the page has started to paint, so add the small init script to `<head>`. It applies the saved mode and accent first, and a saved dark mode does not flash light on each page:

```html
<script src="/_content/Bizeka.Theme/bizeka-theme/bizeka-theme-init.js"></script>
```

Register the module in `Startup.cs` with `services.AddBizekaTheme();` so Serenity finds its local texts (the menu labels). The full host setup, including the layout attributes, is in [adding the modules to a Serene host](../../docs/host-integration.md).

## Design contract

- **Tokens first:** `tokens.css` owns canvas, surface, text, border, shadow, overlay, and accent values for light and dark modes.
- **Safe visual overrides:** `bizeka-overrides.css` changes color, border, radius, and shadow. It does not set layout geometry for the Serenity shell, menus, dialogs, or SlickGrid, with one exception: the sidebar menu scrolls inside its pane, which Serene's own styles do not do.
- **One public preset:** `data-bizeka-theme="bizeka"` plus `--bizeka-accent`; this module has no further surface families and no theme customizer.
- **Accessible defaults:** native color schemes, visible keyboard focus, and reduced-motion-friendly behavior are included.

## Development

```sh
npm install
npm run test:contract
npm run test:hygiene
npm run test:components
npm run test:theme
npm run build
dotnet build Bizeka.Theme.csproj
```

The theme test suite includes token contrast checks, Serenity component
contracts, CSS cascade hygiene checks, and deterministic light/dark SVG
snapshots under `tests/snapshots`. The hygiene check rejects repeated
selector/property declarations so stale overrides do not silently win by
source order.
Use `npm run test:visual:update` only when a token or selector change is
intentional. The SVG suite is reviewable and stable, while real browser
computed-style/screenshot coverage remains the next pinned-browser step; see
`tests/README.md` for the thresholds and stabilization roadmap.

Released under the [MIT license](../../LICENSE). This is an alpha (`0.1.3-alpha`), not production-certified; see the [public gate](../../docs/release/public-gate.md).

TR: Bu modül özel ön sürümdür. Kurulum ve yayın koşulları için kök README ve release kontrol listesini izleyin.
