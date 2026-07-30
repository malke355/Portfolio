'use client'

import { useEffect, useRef } from 'react'

/**
 * Reading-progress bar. Writes straight to the DOM node inside a rAF instead
 * of going through React state — this fires on every scroll frame, and a
 * re-render per frame is wasted work for a single transform.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const node = barRef.current
      if (!node) return

      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0

      node.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5"
    >
      <div
        ref={barRef}
        className="from-primary/40 via-primary to-primary/40 h-full origin-left scale-x-0 bg-gradient-to-r"
      />
    </div>
  )
}
