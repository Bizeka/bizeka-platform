import { localText } from "@serenity-is/corelib";
import { applyBizekaTheme, BizekaThemeMode, readStoredTheme } from "./index";

export interface BizekaThemeToggleOptions {
    /**
     * Selector for the header action list the toggle is added to.
     * Defaults to Serene's `.s-sidebar-header-actions`, then common navbar lists.
     */
    targetSelector?: string;
}

const defaultTarget = ".s-sidebar-header-actions, .navbar-custom-menu .navbar-nav, .s-navbar-nav, .navbar-nav";

const modes: { mode: BizekaThemeMode; icon: string; text: () => string }[] = [
    { mode: "light", icon: "fa-sun", text: () => localText("Site.Theme.Light", "Light") },
    { mode: "dark", icon: "fa-moon", text: () => localText("Site.Theme.Dark", "Dark") },
    { mode: "system", icon: "fa-desktop", text: () => localText("Site.Theme.System", "System") }
];

function iconOf(mode: BizekaThemeMode) {
    return modes.find(x => x.mode === mode)?.icon ?? "fa-desktop";
}

export class BizekaThemeToggle {

    /**
     * Adds a light / dark / system menu to the application header, in the same
     * markup as Serene's language and user menus, before the existing actions.
     */
    static injectToHeader(options?: BizekaThemeToggleOptions): HTMLElement | null {
        let mode = readStoredTheme().mode || "system";
        applyBizekaTheme({ mode });

        const container = document.querySelector(options?.targetSelector || defaultTarget);
        if (!container) {
            console.warn("BizekaThemeToggle: no header action list found for the theme menu.");
            return null;
        }

        const existing = container.querySelector<HTMLElement>(".bizeka-theme-menu");
        if (existing)
            return existing;

        const icon = <i class={`fa ${iconOf(mode)}`} aria-hidden="true"></i> as HTMLElement;
        const items = modes.map(x =>
            <button type="button" class="dropdown-item bizeka-theme-option" data-mode={x.mode}
                onClick={() => select(x.mode)}>
                <i class={`fa ${x.icon}`} aria-hidden="true"></i>
                <span>{x.text()}</span>
            </button> as HTMLButtonElement);

        const sync = () => {
            icon.className = `fa ${iconOf(mode)}`;
            for (const item of items) {
                const active = item.dataset.mode === mode;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", active ? "true" : "false");
            }
        };

        function select(next: BizekaThemeMode) {
            mode = next;
            applyBizekaTheme({ mode });
            sync();
        }

        const title = localText("Site.Theme.Settings", "Theme");
        const li = (
            <li class="bizeka-theme-menu">
                <div class="dropdown">
                    <a class="s-sidebar-header-link bizeka-theme-link" href="#" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false" title={title} aria-label={title}
                        onClick={(e: Event) => e.preventDefault()}>
                        {icon}
                    </a>
                    <div class="dropdown-menu dropdown-menu-end bizeka-theme-dropdown">
                        {items}
                    </div>
                </div>
            </li>
        ) as HTMLElement;

        sync();
        container.insertBefore(li, container.firstChild);
        return li;
    }
}
