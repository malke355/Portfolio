'use client'

import { useEffect, useState } from 'react'
import { site } from '@/lib/site'
import { VISITED_STORAGE_KEY } from '@/lib/theme'

export function PageLoader() {
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    // The boot script has already added .skip-intro when this is a repeat
    // visit, so CSS has hidden the overlay. Recording the visit is all that
    // is left to do here.
    try {
      sessionStorage.setItem(VISITED_STORAGE_KEY, '1')
    } catch {
      // Storage blocked: the intro simply plays again next time.
    }

    const ticks = [26, 54, 78, 94, 100]
    const timers = ticks.map((value, index) =>
      setTimeout(() => setProgress(value), 90 + index * 130),
    )
    const finish = setTimeout(() => setDone(true), 900)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finish)
    }
  }, [])

  return (
    <div
      aria-hidden
      className={`page-loader bg-background pointer-events-none fixed inset-0 z-100 flex items-center justify-center transition-opacity duration-500 ${
        done ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ visibility: done ? 'hidden' : 'visible' }}
    >
      <div className="flex w-56 flex-col items-center gap-4">
        <span className="text-muted-foreground font-mono text-xs tracking-[0.35em] uppercase">
          {site.initials}
        </span>
        <div className="bg-border h-px w-full overflow-hidden">
          <div
            className="bg-primary h-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-muted-foreground font-mono text-[11px]">
          loading portfolio…
        </span>
      </div>
    </div>
  )
}
