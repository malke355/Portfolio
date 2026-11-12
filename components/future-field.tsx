'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Particle = {
  x: number
  y: number
  z: number
  r: number
  vx: number
  vy: number
}

type FutureFieldProps = {
  className?: string
  /** Keep particle count modest — this runs on the main thread. */
  density?: number
}

/**
 * Lightweight futuristic depth field (canvas 2D, not WebGL/Three).
 * Pointer parallax only — no scroll listeners — so it stays smooth.
 */
export function FutureField({ className, density = 48 }: FutureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const surface = canvas
    const paint = ctx

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let pointerX = 0.5
    let pointerY = 0.5
    let particles: Particle[] = []

    function resize() {
      const parent = surface.parentElement
      if (!parent) return
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      width = parent.clientWidth
      height = parent.clientHeight
      surface.width = Math.floor(width * dpr)
      surface.height = Math.floor(height * dpr)
      surface.style.width = `${width}px`
      surface.style.height = `${height}px`
      paint.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(
        24,
        Math.min(density, Math.floor((width * height) / 18000)),
      )
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.25 + Math.random() * 0.75,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }))
    }

    function draw() {
      if (!visible) {
        raf = window.requestAnimationFrame(draw)
        return
      }

      paint.clearRect(0, 0, width, height)
      const parallaxX = (pointerX - 0.5) * 28
      const parallaxY = (pointerY - 0.5) * 18
      const isDark = document.documentElement.classList.contains('dark')
      const stroke = isDark
        ? 'oklch(0.78 0.12 155 / 0.55)'
        : 'oklch(0.48 0.11 160 / 0.45)'
      const fill = isDark
        ? 'oklch(0.9 0.08 155 / 0.75)'
        : 'oklch(0.42 0.1 160 / 0.7)'

      for (const p of particles) {
        p.x += p.vx * p.z
        p.y += p.vy * p.z
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        const dx = p.x + parallaxX * p.z
        const dy = p.y + parallaxY * p.z
        paint.beginPath()
        paint.fillStyle = fill
        paint.globalAlpha = 0.25 + p.z * 0.55
        paint.arc(dx, dy, p.r * p.z, 0, Math.PI * 2)
        paint.fill()
      }

      paint.strokeStyle = stroke
      paint.lineWidth = 1
      let links = 0
      for (let i = 0; i < particles.length && links < 36; i++) {
        const a = particles[i]
        if (!a) continue
        for (let j = i + 1; j < particles.length && links < 36; j++) {
          const b = particles[j]
          if (!b) continue
          const ax = a.x + parallaxX * a.z
          const ay = a.y + parallaxY * a.z
          const bx = b.x + parallaxX * b.z
          const by = b.y + parallaxY * b.z
          const dist = Math.hypot(ax - bx, ay - by)
          if (dist > 110) continue
          paint.globalAlpha = (1 - dist / 110) * 0.22 * Math.min(a.z, b.z)
          paint.beginPath()
          paint.moveTo(ax, ay)
          paint.lineTo(bx, by)
          paint.stroke()
          links++
        }
      }
      paint.globalAlpha = 1

      raf = window.requestAnimationFrame(draw)
    }

    function onPointer(event: PointerEvent) {
      const rect = surface.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      pointerX = (event.clientX - rect.left) / rect.width
      pointerY = (event.clientY - rect.top) / rect.height
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting)
      },
      { threshold: 0.05 },
    )
    observer.observe(surface)

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      observer.disconnect()
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 h-full w-full',
        className,
      )}
    />
  )
}
