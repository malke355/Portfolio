export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'melkamu-theme'

/**
 * Runs inline in <head> before first paint. Anything here must be plain ES5
 * with no imports, and must never throw — a private-mode browser that blocks
 * localStorage should still get a usable theme.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
})();
`
  .trim()
  .replace(/\s+/g, ' ')
