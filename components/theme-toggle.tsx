'use client'

import { Moon, Sun } from 'lucide-react'
import { useCallback, useSyncExternalStore } from 'react'
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

/**
 * The <html> class is the source of truth — the inline head script sets it
 * before first paint, so React reads it as external state rather than owning
 * a duplicate copy that could disagree with what is on screen.
 */
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

function hasExplicitChoice() {
  try {
    return Boolean(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return true // Treat unreadable storage as "leave it alone".
  }
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)

  // Follow the OS only until the visitor picks a theme themselves.
  const media = window.matchMedia('(prefers-color-scheme: light)')
  const onMediaChange = (event: MediaQueryListEvent) => {
    if (hasExplicitChoice()) return
    apply(event.matches ? 'light' : 'dark')
    notify()
  }
  media.addEventListener('change', onMediaChange)

  return () => {
    listeners.delete(onStoreChange)
    media.removeEventListener('change', onMediaChange)
  }
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** The server cannot know the theme, so render the neutral state. */
function getServerSnapshot(): Theme | null {
  return null
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const root = document.documentElement
    const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark'

    // Without this, every themed element animates its colour at once and the
    // switch reads as a smear rather than a flip.
    root.classList.add('theme-switching')
    apply(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Ignore: the theme still applies for this page view.
    }
    notify()

    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove('theme-switching')),
    )
  }, [])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === null
          ? 'Toggle theme'
          : `Switch to ${isDark ? 'light' : 'dark'} theme`
      }
      className={cn(
        'border-border text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-ring relative grid size-9 place-items-center overflow-hidden rounded-xl border transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
    >
      <Sun
        aria-hidden
        className={cn(
          'absolute size-4 transition-all duration-300 motion-reduce:transition-none',
          isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0',
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          'absolute size-4 transition-all duration-300 motion-reduce:transition-none',
          isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90 opacity-0',
        )}
      />
    </button>
  )
}
