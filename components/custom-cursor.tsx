'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Custom cursor mood: a tight primary core + a lagging ring that blooms
 * over interactive targets. Desktop / fine-pointer only.
 */
export function CustomCursor() {
  const coreRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => setEnabled(fine.matches && !reduce.matches)
    sync()

    fine.addEventListener('change', sync)
    reduce.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      reduce.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const core = coreRef.current
    const ring = ringRef.current
    if (!core || !ring) return

    document.documentElement.classList.add('cursor-mood')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let hovering = false
    let frame = 0

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false
      return Boolean(
        target.closest(
          'a, button, [role="button"], input, textarea, select, summary, label, .tilt-card, .card-lift',
        ),
      )
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      core.style.transform = `translate3d(${x}px, ${y}px, 0)`
      hovering = isInteractive(event.target)
      document.documentElement.classList.toggle('cursor-mood-hover', hovering)
    }

    const onDown = () => {
      document.documentElement.classList.add('cursor-mood-down')
    }
    const onUp = () => {
      document.documentElement.classList.remove('cursor-mood-down')
    }

    const tick = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.classList.remove(
        'cursor-mood',
        'cursor-mood-hover',
        'cursor-mood-down',
      )
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="cursor-mood-layer">
      <div ref={ringRef} className="cursor-mood-ring" />
      <div ref={coreRef} className="cursor-mood-core" />
    </div>
  )
}
