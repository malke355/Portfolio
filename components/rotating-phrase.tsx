'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type RotatingPhraseProps = {
  phrases: readonly string[]
  /** Dwell time on each phrase before the next scroll starts. */
  intervalMs?: number
  className?: string
}

const SCROLL_MS = 850

/**
 * True vertical reel: phrases are stacked and the track scrolls upward
 * so one line is replaced by the next with a continuous slide.
 */
export function RotatingPhrase({
  phrases,
  intervalMs = 2800,
  className,
}: RotatingPhraseProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [slotHeight, setSlotHeight] = useState(0)
  const [offset, setOffset] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const offsetRef = useRef(0)
  const lockedRef = useRef(false)

  // Append the first phrase so we can scroll past the last into a clone,
  // then snap back to the real first without a visible jump.
  const reel = useMemo(
    () => (phrases.length > 0 ? [...phrases, phrases[0]] : []),
    [phrases],
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const measure = () => {
      const next = Math.ceil(root.getBoundingClientRect().height)
      if (next > 0) setSlotHeight(next)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [phrases, className])

  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  useEffect(() => {
    if (phrases.length < 2 || slotHeight === 0) return

    let snapTimer = 0

    const tick = window.setInterval(() => {
      if (lockedRef.current) return

      if (reducedMotion) {
        const next = (offsetRef.current + 1) % phrases.length
        setAnimate(false)
        setOffset(next)
        offsetRef.current = next
        return
      }

      lockedRef.current = true
      setAnimate(true)
      const next = offsetRef.current + 1
      setOffset(next)
      offsetRef.current = next

      // Landed on the cloned first phrase — snap to real index 0.
      if (next === phrases.length) {
        snapTimer = window.setTimeout(() => {
          setAnimate(false)
          setOffset(0)
          offsetRef.current = 0
          // Re-enable transitions on the next frame after the snap.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setAnimate(true)
              lockedRef.current = false
            })
          })
        }, SCROLL_MS)
      } else {
        snapTimer = window.setTimeout(() => {
          lockedRef.current = false
        }, SCROLL_MS)
      }
    }, intervalMs)

    return () => {
      window.clearInterval(tick)
      window.clearTimeout(snapTimer)
      lockedRef.current = false
    }
  }, [phrases, intervalMs, reducedMotion, slotHeight])

  if (phrases.length === 0) return null

  const liveIndex = offset % phrases.length

  return (
    <div
      ref={rootRef}
      className={cn('rotating-phrase', className)}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Tallest phrase owns the visible height (no layout shift). */}
      <span aria-hidden className="rotating-phrase-sizer">
        {phrases.map((phrase) => (
          <span key={phrase} className="rotating-phrase-measure">
            {phrase}
          </span>
        ))}
      </span>

      <div className="rotating-phrase-viewport">
        <div
          ref={trackRef}
          className={cn(
            'rotating-phrase-track',
            animate && !reducedMotion && 'rotating-phrase-track-animate',
          )}
          style={{
            transform:
              slotHeight > 0
                ? `translate3d(0, ${-offset * slotHeight}px, 0)`
                : undefined,
          }}
        >
          {reel.map((phrase, i) => (
            <span
              key={`${phrase}-${i}`}
              className="rotating-phrase-slot"
              style={slotHeight > 0 ? { height: slotHeight } : undefined}
              aria-hidden={i !== liveIndex}
            >
              {phrase}
            </span>
          ))}
        </div>
      </div>

      <span className="sr-only">{phrases[liveIndex]}</span>
    </div>
  )
}
