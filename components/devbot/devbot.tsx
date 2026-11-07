'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { DevBotRobot } from '@/components/devbot/devbot-robot'
import { cn } from '@/lib/utils'

const DevBotPanel = dynamic(
  () =>
    import('@/components/devbot/devbot-panel').then((mod) => mod.DevBotPanel),
  { ssr: false },
)

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', onStoreChange)
  return () => media.removeEventListener('change', onStoreChange)
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function DevBot() {
  const [open, setOpen] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  )

  useEffect(() => {
    const delay = reducedMotion ? 0 : 1800
    const timer = window.setTimeout(() => setShowInvite(true), delay)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])

  return (
    <>
      <div className="fixed right-4 bottom-4 z-70 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
        {showInvite && !open ? (
          <p
            role="status"
            className="border-border bg-surface-elevated text-foreground animate-in fade-in slide-in-from-bottom-2 max-w-[14rem] rounded-2xl border px-3 py-2 text-xs shadow-md duration-300"
          >
            Have questions? Ask DevBot!
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="devbot-panel"
          className={cn(
            'border-border bg-surface-elevated text-foreground focus-visible:ring-ring grid size-14 place-items-center rounded-2xl border shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none',
            open && 'ring-primary/30 ring-2',
          )}
          aria-label={open ? 'Close DevBot' : 'Open DevBot'}
        >
          <DevBotRobot className="size-9" idle={!reducedMotion && !open} />
        </button>
      </div>

      <div id="devbot-panel">
        <DevBotPanel open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  )
}
