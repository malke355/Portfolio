'use client'

import { cn } from '@/lib/utils'

type DevBotRobotProps = {
  className?: string
  idle?: boolean
}

/**
 * Futuristic CSS-3D robot. Pure DOM/SVG — no Three.js — so mobile and
 * reduced-motion stay on the flat SVG layer without loading a 3D runtime.
 */
export function DevBotRobot({ className, idle = true }: DevBotRobotProps) {
  return (
    <div
      className={cn(
        'devbot-stage relative grid place-items-center',
        idle && 'devbot-idle',
        className,
      )}
      aria-hidden
    >
      <div className="devbot-halo" />
      <div className="devbot-rig">
        <svg
          viewBox="0 0 64 64"
          className="devbot-face relative z-10 size-full"
        >
          <defs>
            <linearGradient id="devbot-shell" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.12 155)" />
              <stop offset="55%" stopColor="oklch(0.58 0.11 160)" />
              <stop offset="100%" stopColor="oklch(0.42 0.1 165)" />
            </linearGradient>
            <linearGradient id="devbot-visor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.22 0.04 200)" />
              <stop offset="100%" stopColor="oklch(0.14 0.03 165)" />
            </linearGradient>
          </defs>
          <ellipse
            cx="32"
            cy="58"
            rx="14"
            ry="3"
            fill="currentColor"
            opacity="0.14"
            className="devbot-shadow"
          />
          <rect
            x="14"
            y="18"
            width="36"
            height="32"
            rx="12"
            fill="url(#devbot-shell)"
          />
          <rect
            x="20"
            y="26"
            width="24"
            height="14"
            rx="7"
            fill="url(#devbot-visor)"
          />
          <circle
            className="devbot-eye"
            cx="27"
            cy="33"
            r="2.5"
            fill="oklch(0.92 0.1 155)"
          />
          <circle
            className="devbot-eye"
            cx="37"
            cy="33"
            r="2.5"
            fill="oklch(0.92 0.1 155)"
          />
          <path
            d="M26 42c2.2 2.4 9.8 2.4 12 0"
            fill="none"
            stroke="oklch(0.96 0.03 155)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="32" cy="14" r="3.2" fill="url(#devbot-shell)" />
          <rect
            x="30.5"
            y="8"
            width="3"
            height="6"
            rx="1.5"
            fill="url(#devbot-shell)"
          />
          <circle
            cx="32"
            cy="7"
            r="2.1"
            fill="oklch(0.84 0.16 155)"
            className="devbot-antenna"
          />
          <rect
            className="devbot-arm-l"
            x="8"
            y="28"
            width="6"
            height="12"
            rx="3"
            fill="url(#devbot-shell)"
          />
          <rect
            className="devbot-arm-r"
            x="50"
            y="28"
            width="6"
            height="12"
            rx="3"
            fill="url(#devbot-shell)"
          />
        </svg>
      </div>
    </div>
  )
}
