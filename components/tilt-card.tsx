'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

type TiltCardProps = {
  children: React.ReactNode
  className?: string
  /** Max tilt in degrees. */
  maxTilt?: number
}

/**
 * Lightweight pointer-driven 3D tilt. Updates CSS variables directly so
 * React does not re-render on every move.
 */
export function TiltCard({ children, className, maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * (maxTilt * 2)
    const rotateX = (0.5 - y) * (maxTilt * 2)

    node.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`)
    node.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`)
    node.style.setProperty('--tilt-px', `${(x * 100).toFixed(1)}%`)
    node.style.setProperty('--tilt-py', `${(y * 100).toFixed(1)}%`)
  }

  const onPointerLeave = () => {
    const node = ref.current
    if (!node) return
    node.style.setProperty('--tilt-x', '0deg')
    node.style.setProperty('--tilt-y', '0deg')
    node.style.setProperty('--tilt-px', '50%')
    node.style.setProperty('--tilt-py', '50%')
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn('tilt-card', className)}
      style={
        {
          '--tilt-x': '0deg',
          '--tilt-y': '0deg',
          '--tilt-px': '50%',
          '--tilt-py': '50%',
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
