'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type RotatingPhraseProps = {
  phrases: readonly string[]
  /** Dwell time on each phrase before the next transition starts. */
  intervalMs?: number
  className?: string
}

const EXIT_MS = 480

/**
 * Premium vertical slide-up phrase cycle.
 * Uses a CSS-grid stack so the tallest phrase reserves height (no CLS),
 * and dual layers for overlapping out/in transitions.
 */
export function RotatingPhrase({
  phrases,
  intervalMs = 2800,
  className,
}: RotatingPhraseProps) {
  const [index, setIndex] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const indexRef = useRef(0)
  const transitioningRef = useRef(false)

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (phrases.length < 2) return

    let exitTimer = 0

    const tick = window.setInterval(() => {
      if (transitioningRef.current) return

      const current = indexRef.current
      const next = (current + 1) % phrases.length

      if (reducedMotion) {
        indexRef.current = next
        setOutgoing(null)
        setIndex(next)
        return
      }

      transitioningRef.current = true
      // Crossfade layers: outgoing keeps the old phrase, active advances now.
      setOutgoing(current)
      indexRef.current = next
      setIndex(next)

      exitTimer = window.setTimeout(() => {
        setOutgoing(null)
        transitioningRef.current = false
      }, EXIT_MS)
    }, intervalMs)

    return () => {
      window.clearInterval(tick)
      window.clearTimeout(exitTimer)
      transitioningRef.current = false
    }
  }, [phrases, intervalMs, reducedMotion])

  if (phrases.length === 0) return null

  const active = phrases[index]

  return (
    <div
      className={cn('rotating-phrase', className)}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Invisible sizers — same cell, tallest phrase owns the height. */}
      <span aria-hidden className="rotating-phrase-sizer">
        {phrases.map((phrase) => (
          <span key={phrase} className="rotating-phrase-measure">
            {phrase}
          </span>
        ))}
      </span>

      <span className="rotating-phrase-viewport">
        {outgoing !== null && !reducedMotion ? (
          <span
            key={`out-${outgoing}`}
            className="rotating-phrase-item rotating-phrase-exit"
            aria-hidden
          >
            {phrases[outgoing]}
          </span>
        ) : null}

        <span
          key={`in-${index}`}
          className={cn(
            'rotating-phrase-item',
            !reducedMotion && 'rotating-phrase-enter',
          )}
        >
          {active}
        </span>
      </span>
    </div>
  )
}
