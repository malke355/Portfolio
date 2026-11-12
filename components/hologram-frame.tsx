'use client'

import { cn } from '@/lib/utils'

type HologramFrameProps = {
  children: React.ReactNode
  className?: string
}

/** Decorative CSS-3D ring stack around hero media — GPU-friendly transforms only. */
export function HologramFrame({ children, className }: HologramFrameProps) {
  return (
    <div className={cn('hologram-scene relative', className)}>
      <div aria-hidden className="hologram-ring hologram-ring-a" />
      <div aria-hidden className="hologram-ring hologram-ring-b" />
      <div aria-hidden className="hologram-ring hologram-ring-c" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
