// Applies the saved mode and accent before the first paint. Load it as a plain, blocking
// script in <head>: initBizekaTheme() runs from a deferred module, too late to prevent a
// page that starts in the wrong mode. Reads what applyBizekaTheme() saves, and writes nothing.
(function () {
    var root = document.documentElement;
    var mode;
    var accent;

    try {
        var saved = {};
        try { saved = JSON.parse(window.localStorage.getItem("bizeka.theme.bizeka")) || {}; } catch (e) {}
        mode = saved.mode || window.localStorage.getItem("bizeka_theme_mode");
        accent = saved.accent;
    } catch (e) {
        // Storage can be disabled; the page still follows the operating system.
    }

    if (mode !== "light" && mode !== "dark") {
        mode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    root.setAttribute("data-bizeka-theme", "bizeka");
    root.setAttribute("data-bizeka-mode", mode);

    if (typeof accent === "string" && typeof CSS !== "undefined" && CSS.supports("color", accent)) {
        root.style.setProperty("--bizeka-accent", accent);
    }
})();
