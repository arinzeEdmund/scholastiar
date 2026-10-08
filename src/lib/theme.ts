/** Theme preference. "system" follows the device setting (prefers-color-scheme). */
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "sch-theme";

/** Browser theme-color per resolved theme (address bar / PWA status bar). */
export const THEME_COLORS: Record<ResolvedTheme, string> = { light: "#ffffff", dark: "#0b0d0c" };

/**
 * Runs in <head> before first paint so the page never flashes the wrong theme.
 * Kept dependency-free and tiny; mirrors applyTheme() in the theme provider.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");if(p!=="light"&&p!=="dark")p="system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
