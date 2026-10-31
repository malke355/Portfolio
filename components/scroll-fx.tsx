'use client'

import { useEffect } from 'react'

/**
 * Global scroll mood engine.
 * Drives CSS variables + parallax/section transforms without React re-renders.
 */
export function ScrollFx() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const root = document.documentElement
    root.classList.add('scroll-fx')

    let frame = 0
    let lastY = window.scrollY
    let lastT = performance.now()
    let vel = 0
    let smoothVel = 0

    const parallaxNodes = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    const sceneNodes = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-scene]'))

    const update = (now = performance.now()) => {
      frame = 0
      const y = window.scrollY
      const vh = window.innerHeight || 1
      const max = Math.max(1, root.scrollHeight - vh)
      const progress = Math.min(1, Math.max(0, y / max))

      const dt = Math.max(16, now - lastT)
      const rawVel = ((y - lastY) / dt) * 16
      vel = rawVel
      smoothVel += (vel - smoothVel) * 0.12
      lastY = y
      lastT = now

      root.style.setProperty('--scroll-y', `${y.toFixed(1)}px`)
      root.style.setProperty('--scroll-progress', progress.toFixed(4))
      root.style.setProperty('--scroll-vel', smoothVel.toFixed(3))
      root.style.setProperty(
        '--scroll-abs-vel',
        Math.min(3, Math.abs(smoothVel)).toFixed(3),
      )

      for (const node of parallaxNodes()) {
        const speed = Number(node.dataset.parallax || 0.2)
        const rect = node.getBoundingClientRect()
        const center = rect.top + rect.height / 2 - vh / 2
        const shift = center * speed * -0.15
        node.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`)
      }

      for (const node of sceneNodes()) {
        const rect = node.getBoundingClientRect()
        // Center of the currently visible overlap — keeps tall sections stable.
        const clampedMid =
          rect.bottom < 0 || rect.top > vh
            ? rect.top + rect.height / 2
            : (Math.max(rect.top, 0) + Math.min(rect.bottom, vh)) / 2
        const dist = (clampedMid - vh / 2) / vh
        const visibility = Math.max(0.62, 1 - Math.abs(dist) * 0.55)
        const scale = 0.96 + visibility * 0.04
        const blur = Math.max(0, (1 - visibility) * 2.4)
        const rotate = dist * 1.6
        node.style.setProperty('--scene-opacity', visibility.toFixed(3))
        node.style.setProperty('--scene-scale', scale.toFixed(4))
        node.style.setProperty('--scene-blur', `${blur.toFixed(2)}px`)
        node.style.setProperty('--scene-rotate', `${rotate.toFixed(3)}deg`)
        node.style.setProperty('--scene-shift', `${(dist * 36).toFixed(2)}px`)
      }

      // Kick marquee speed with scroll energy.
      root.style.setProperty(
        '--marquee-boost',
        `${(1 + Math.min(2.4, Math.abs(smoothVel) * 1.8)).toFixed(3)}`,
      )
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
      root.classList.remove('scroll-fx')
      root.style.removeProperty('--scroll-y')
      root.style.removeProperty('--scroll-progress')
      root.style.removeProperty('--scroll-vel')
      root.style.removeProperty('--scroll-abs-vel')
      root.style.removeProperty('--marquee-boost')
    }
  }, [])

  return null
}
