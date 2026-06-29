/** Maps a persisted ui.theme value to its wrapper CSS class (see styles/obsidian.css). */
export const THEME_CLASS: Record<string, string> = {
  'obsidian-dark': 'theme-dark',
  'obsidian-light': 'theme-light',
  'catppuccin-mocha': 'theme-ctp-mocha',
  'catppuccin-macchiato': 'theme-ctp-macchiato',
  'catppuccin-frappe': 'theme-ctp-frappe',
  'catppuccin-latte': 'theme-ctp-latte',
};

export const themeClass = (t?: string): string => THEME_CLASS[t ?? ''] ?? 'theme-light';

/** The app's theme wrapper element — it carries the active theme class and its CSS
 *  vars. Located by a stable `theme-host` class so it resolves for ANY theme
 *  (Obsidian + Catppuccin flavors), unlike querying `.theme-light, .theme-dark`,
 *  which misses the Catppuccin classes and falls back to an unthemed document.body. */
export const themeHost = (): HTMLElement =>
  (document.querySelector('.theme-host') as HTMLElement | null) ?? document.body;

/** Whether the active theme is dark, from the wrapper's computed color-scheme. */
export const isDarkTheme = (): boolean =>
  getComputedStyle(themeHost()).colorScheme.includes('dark');
