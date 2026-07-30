'use client'

import { useEffect, useState } from 'react'

export function PageLoader() {
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const ticks = [22, 48, 71, 92, 100]
    const timers = ticks.map((value, i) =>
      setTimeout(() => setProgress(value), 120 + i * 170),
    )
    const finish = setTimeout(() => setDone(true), 1250)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finish)
    }
  }, [])

  return (
    <div
      aria-hidden={done}
      className={`pointer-events-none fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity duration-500 ${
        done ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ visibility: done ? 'hidden' : 'visible' }}
    >
      <div className="flex w-56 flex-col items-center gap-4">
        <span className="font-mono text-xs tracking-[0.35em] text-muted-foreground uppercase">
          MT
        </span>
        <div className="h-px w-full overflow-hidden bg-border">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          loading portfolio…
        </span>
      </div>
    </div>
  )
}
