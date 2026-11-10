'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'
import { VISITED_STORAGE_KEY } from '@/lib/theme'

const HOLD_MS = 3000
const EXIT_MS = 700

type Phase = 'playing' | 'exiting' | 'done'

export function PageLoader() {
  const [phase, setPhase] = useState<Phase>('playing')
  const phaseRef = useRef<Phase>('playing')
  const exitTimerRef = useRef<number | null>(null)
  const doneTimerRef = useRef<number | null>(null)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    // The boot script has already added .skip-intro when this is a repeat
    // visit, so CSS has hidden the overlay. Recording the visit is all that
    // is left to do here.
    try {
      sessionStorage.setItem(VISITED_STORAGE_KEY, '1')
    } catch {
      // Storage blocked: the intro simply plays again next time.
    }

    const root = document.documentElement
    // Repeat visits and reduced-motion users already hide the overlay via CSS
    // (.skip-intro / prefers-reduced-motion). Avoid timers and scroll locking.
    if (
      root.classList.contains('skip-intro') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const clearTimers = () => {
      if (exitTimerRef.current !== null)
        window.clearTimeout(exitTimerRef.current)
      if (doneTimerRef.current !== null)
        window.clearTimeout(doneTimerRef.current)
      exitTimerRef.current = null
      doneTimerRef.current = null
    }

    const beginExit = () => {
      if (phaseRef.current !== 'playing') return
      phaseRef.current = 'exiting'
      setPhase('exiting')
      doneTimerRef.current = window.setTimeout(() => {
        phaseRef.current = 'done'
        setPhase('done')
        root.style.overflow = previousOverflow
      }, EXIT_MS)
    }

    exitTimerRef.current = window.setTimeout(beginExit, HOLD_MS)

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'Escape' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault()
        clearTimers()
        beginExit()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimers()
      window.removeEventListener('keydown', onKeyDown)
      root.style.overflow = previousOverflow
    }
  }, [])

  const dismiss = () => {
    if (phaseRef.current !== 'playing') return
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current)
    if (doneTimerRef.current !== null) window.clearTimeout(doneTimerRef.current)
    exitTimerRef.current = null
    doneTimerRef.current = null

    phaseRef.current = 'exiting'
    setPhase('exiting')
    doneTimerRef.current = window.setTimeout(() => {
      phaseRef.current = 'done'
      setPhase('done')
      document.documentElement.style.overflow = ''
    }, EXIT_MS)
  }

  return (
    <div
      aria-hidden={phase === 'done'}
      role="dialog"
      aria-modal={phase !== 'done'}
      aria-label="Welcome"
      className={`page-loader welcome-intro fixed inset-0 z-100 flex items-center justify-center overflow-hidden ${
        phase === 'exiting' ? 'welcome-intro-exit' : ''
      } ${phase === 'done' ? 'welcome-intro-done' : ''}`}
      style={{
        visibility: phase === 'done' ? 'hidden' : 'visible',
        pointerEvents: phase === 'done' ? 'none' : 'auto',
      }}
    >
      <div aria-hidden className="welcome-atmosphere">
        <div className="welcome-grid" />
        <div className="welcome-glow welcome-glow-a" />
        <div className="welcome-glow welcome-glow-b" />
        <div className="welcome-glow welcome-glow-c" />
        <span className="welcome-particle welcome-particle-1" />
        <span className="welcome-particle welcome-particle-2" />
        <span className="welcome-particle welcome-particle-3" />
        <span className="welcome-particle welcome-particle-4" />
        <span className="welcome-particle welcome-particle-5" />
        <span className="welcome-particle welcome-particle-6" />
      </div>

      <div className="welcome-stage">
        <div className="welcome-scene" aria-hidden>
          <div className="welcome-orbit welcome-orbit-outer" />
          <div className="welcome-orbit welcome-orbit-inner" />
          <div className="welcome-cube">
            <div className="welcome-face welcome-face-front">
              {site.initials}
            </div>
            <div className="welcome-face welcome-face-back">
              {site.initials}
            </div>
            <div className="welcome-face welcome-face-right" />
            <div className="welcome-face welcome-face-left" />
            <div className="welcome-face welcome-face-top" />
            <div className="welcome-face welcome-face-bottom" />
          </div>
        </div>

        <div className="welcome-copy">
          <p className="welcome-kicker">Welcome</p>
          <h1 className="welcome-name">{site.name}</h1>
          <p className="welcome-line">
            Build boldly. Ship clean systems. Turn ambition into working
            software.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="welcome-skip"
        onClick={dismiss}
        aria-label="Skip welcome and enter portfolio"
      >
        Enter portfolio
        <span aria-hidden>→</span>
      </button>
    </div>
  )
}
