'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type RotatingPhraseProps = {
  phrases: readonly string[]
  /** Dwell time on each phrase before the next transition starts. */
  intervalMs?: number
  className?: string
}

const EXIT_MS = 500

/**
 * Cycles phrases with a smooth upward slide + fade.
 * Grid sizers keep height stable so different lengths don't shift layout.
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
  const busyRef = useRef(false)

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
      if (busyRef.current) return

      const current = indexRef.current
      const next = (current + 1) % phrases.length

      if (reducedMotion) {
        indexRef.current = next
        setOutgoing(null)
        setIndex(next)
        return
      }

      busyRef.current = true
      setOutgoing(current)
      indexRef.current = next
      setIndex(next)

      exitTimer = window.setTimeout(() => {
        setOutgoing(null)
        busyRef.current = false
      }, EXIT_MS)
    }, intervalMs)

    return () => {
      window.clearInterval(tick)
      window.clearTimeout(exitTimer)
      busyRef.current = false
    }
  }, [phrases, intervalMs, reducedMotion])

  if (phrases.length === 0) return null

  return (
    <div
      className={cn('rotating-phrase', className)}
      aria-live="polite"
      aria-atomic="true"
    >
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
            className="rotating-phrase-item phrase-accent-text rotating-phrase-exit"
            aria-hidden
          >
            {phrases[outgoing]}
          </span>
        ) : null}

        <span
          key={`in-${index}`}
          className={cn(
            'rotating-phrase-item phrase-accent-text',
            !reducedMotion && outgoing !== null && 'rotating-phrase-enter',
          )}
        >
          {phrases[index]}
        </span>
      </span>
    </div>
  )
}
