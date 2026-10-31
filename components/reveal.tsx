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
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  )
  return sharedObserver
}

const hiddenByVariant: Record<RevealVariant, string> = {
  up: 'translate-y-12 opacity-0',
  left: '-translate-x-14 opacity-0',
  right: 'translate-x-14 opacity-0',
  scale: 'scale-[0.88] opacity-0',
  blur: 'translate-y-10 scale-[0.96] opacity-0 blur-md',
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  spotlight = false,
  variant = 'up',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

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
    const node = ref.current
    if (!node) return

    // Very old browsers and some embedded webviews lack the observer; showing
    // the content on the next frame keeps the setState out of the effect body.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = getSharedObserver()
    onIntersect.set(node, () => setVisible(true))
    observer.observe(node)

    return () => {
      onIntersect.delete(node)
      observer.unobserve(node)
    }
  }, [])

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
