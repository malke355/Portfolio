'use client'

import type { ElementType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'span'
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

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

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
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:transition-none',
        visible
          ? 'translate-y-0 opacity-100 blur-none'
          : 'translate-y-6 opacity-0 blur-[2px]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
