import { BizekaThemeToggle, type BizekaThemeToggleOptions } from "./BizekaThemeToggle";
import { unwatchDatePopupViewport, watchDatePopupViewport } from "./DatePopupViewport";

export type BizekaThemeMode = "light" | "dark" | "system";

export interface BizekaThemeOptions {
    /** Accent color accepted by CSS.supports("color", value). */
    accent?: string;
    /** `system` resolves from the current operating-system color preference. */
    mode?: BizekaThemeMode;
    /** Save the selected mode and accent in local storage. Defaults to true. */
    persist?: boolean;
}

export interface AppliedBizekaTheme {
    accent: string | null;
    mode: BizekaThemeMode;
    resolvedMode: Exclude<BizekaThemeMode, "system">;
}

const storageKey = "bizeka.theme.bizeka";
const legacyStorageKey = "bizeka_theme_mode";
const themeAttribute = "data-bizeka-theme";
const modeAttribute = "data-bizeka-mode";

function resolveMode(mode: BizekaThemeMode): Exclude<BizekaThemeMode, "system"> {
    if (mode !== "system")
        return mode;

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function canUseAccent(accent: string): boolean {
    return typeof CSS !== "undefined" && CSS.supports("color", accent);
}

export function readStoredTheme(): Pick<BizekaThemeOptions, "accent" | "mode"> {
    try {
        let legacyMode = window.localStorage.getItem(legacyStorageKey) as BizekaThemeMode | null;
        const value = window.localStorage.getItem(storageKey);
        let parsed: BizekaThemeOptions = {};
        if (value) {
            try { parsed = JSON.parse(value); } catch {}
        }
        const mode = parsed.mode || (legacyMode === "light" || legacyMode === "dark" || legacyMode === "system" ? legacyMode : undefined);
        return {
            accent: typeof parsed.accent === "string" && canUseAccent(parsed.accent) ? parsed.accent : undefined,
            mode
        };
    } catch {
        return {};
    }
}

/**
 * Enables the Bizeka soft preset without replacing Serenity's layout CSS.
 * Load the companion CSS after Serenity's `common-theme.css` and SlickGrid base CSS.
 */
export function applyBizekaTheme(options: BizekaThemeOptions = {}): AppliedBizekaTheme {
    const saved = options.persist === false ? {} : readStoredTheme();
    const mode = options.mode ?? saved.mode ?? "system";
    const accent = options.accent ?? saved.accent;
    const root = document.documentElement;

    root.setAttribute(themeAttribute, "bizeka");
    root.setAttribute(modeAttribute, resolveMode(mode));
    watchDatePopupViewport();

    if (accent && canUseAccent(accent))
        root.style.setProperty("--bizeka-accent", accent);
    else
        root.style.removeProperty("--bizeka-accent");

    if (options.persist !== false) {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ accent: accent ?? null, mode }));
            window.localStorage.setItem(legacyStorageKey, mode);
            document.cookie = `bizeka_theme_mode=${mode}; path=/; max-age=31536000; SameSite=Lax`;
        } catch {
            // Storage can be disabled; applying the theme must still succeed.
        }
    }

    return { accent: accent ?? null, mode, resolvedMode: resolveMode(mode) };
}

/** Removes only this package's attributes and inline accent token. */
export function clearBizekaTheme(): void {
    unwatchDatePopupViewport();
    const root = document.documentElement;
    root.removeAttribute(themeAttribute);
    root.removeAttribute(modeAttribute);
    root.style.removeProperty("--bizeka-accent");

    try {
        window.localStorage.removeItem(storageKey);
        window.localStorage.removeItem(legacyStorageKey);
        document.cookie = "bizeka_theme_mode=; path=/; max-age=0; SameSite=Lax";
    } catch {
        // No storage access is a non-fatal browser configuration.
    }
}

let systemWatch: MediaQueryList | null = null;

function onSystemChange() {
    if ((readStoredTheme().mode ?? "system") === "system")
        document.documentElement.setAttribute(modeAttribute, resolveMode("system"));
}

export interface InitBizekaThemeOptions extends BizekaThemeToggleOptions {
    /** Adds the light / dark / system menu to the header. Defaults to true. */
    headerToggle?: boolean;
}

/**
 * One call for the host's ScriptInit: applies the saved mode and accent, follows
 * operating-system changes while the mode is "system", and adds the header menu.
 */
export function initBizekaTheme(options: InitBizekaThemeOptions = {}): void {
    applyBizekaTheme();

    if (!systemWatch && window.matchMedia) {
        systemWatch = window.matchMedia("(prefers-color-scheme: dark)");
        systemWatch.addEventListener("change", onSystemChange);
    }

    if (options.headerToggle === false)
        return;

    const inject = () => BizekaThemeToggle.injectToHeader(options);
    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", inject, { once: true });
    else
        inject();
}

export * from "./BizekaThemeToggle";
