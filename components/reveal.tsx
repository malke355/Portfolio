'use client'

import type { ElementType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'blur'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'span'
  /** Track the pointer and light the surface under it. */
  spotlight?: boolean
  variant?: RevealVariant
  /**
   * Show as soon as the component mounts (hero / above-the-fold).
   * Avoids content getting stuck invisible if IntersectionObserver is flaky
   * (some GitHub mobile webviews).
   */
  eager?: boolean
}

/**
 * A single IntersectionObserver shared by every Reveal on the page. Pages here
 * mount dozens of animated blocks, and one observer with many targets is
 * considerably cheaper than one observer per target.
 */
let sharedObserver: IntersectionObserver | null = null
const onIntersect = new WeakMap<Element, () => void>()

function getSharedObserver() {
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        onIntersect.get(entry.target)?.()
        onIntersect.delete(entry.target)
        sharedObserver?.unobserve(entry.target)
      }
    },
    // threshold 0 = any visible pixel counts. Positive bottom rootMargin was
    // previously shrinking the hit area and could leave in-view blocks hidden.
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  )
  return sharedObserver
}

const hiddenByVariant: Record<RevealVariant, string> = {
  up: 'translate-y-6 opacity-0',
  left: '-translate-x-6 opacity-0',
  right: 'translate-x-6 opacity-0',
  scale: 'scale-[0.94] opacity-0',
  blur: 'translate-y-4 scale-[0.98] opacity-0 blur-sm',
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  spotlight = false,
  variant = 'up',
  eager = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(eager)

  // Writes two custom properties so the browser only has to repaint a
  // gradient. Going through state here would re-render on every pointer move.
  const onPointerMove = spotlight
    ? (event: React.PointerEvent<HTMLElement>) => {
        const node = ref.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
        node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
      }
    : undefined

  useEffect(() => {
    if (eager) {
      setVisible(true)
      return
    }

    const node = ref.current
    if (!node) return

    // Safety net: never leave content stuck at opacity 0.
    const fallback = window.setTimeout(() => setVisible(true), 900)

    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => {
        window.clearTimeout(fallback)
        cancelAnimationFrame(frame)
      }
    }

    const observer = getSharedObserver()
    onIntersect.set(node, () => {
      window.clearTimeout(fallback)
      setVisible(true)
    })
    observer.observe(node)

    return () => {
      window.clearTimeout(fallback)
      onIntersect.delete(node)
      observer.unobserve(node)
    }
  }, [eager])

  const Tag = as as ElementType

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'reveal-base motion-reduce:!translate-x-0 motion-reduce:!translate-y-0 motion-reduce:!scale-100 motion-reduce:!opacity-100 motion-reduce:!blur-none motion-reduce:transition-none',
        spotlight && 'spotlight-surface',
        visible
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-none'
          : hiddenByVariant[variant],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
