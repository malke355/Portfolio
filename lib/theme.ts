export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'melkamu-theme'
export const VISITED_STORAGE_KEY = 'melkamu-visited'

/**
 * Runs inline in <head> before first paint. Anything here must be plain ES5
 * with no imports, and must never throw — a private-mode browser that blocks
 * storage should still get a usable page.
 *
 * Doing this in a script rather than in React avoids both a flash of the wrong
 * theme and a hydration mismatch, since the server cannot know either value.
 */
export const bootScript = `
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

  try {
    if (sessionStorage.getItem('${VISITED_STORAGE_KEY}')) {
      document.documentElement.classList.add('skip-intro');
    }
  } catch (error) {}
})();
`
  .trim()
  .replace(/\s+/g, ' ')
