'use client'

import { cn } from '@/lib/utils'

type DevBotRobotProps = {
  className?: string
  idle?: boolean
}

/** Lightweight SVG robot — no 3D dependency; CSS handles idle motion. */
export function DevBotRobot({ className, idle = true }: DevBotRobotProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden
      className={cn(idle && 'devbot-idle', className)}
    >
      <defs>
        <linearGradient id="devbot-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.1 160)" />
          <stop offset="100%" stopColor="oklch(0.48 0.11 160)" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="58" rx="14" ry="3" fill="currentColor" opacity="0.12" />
      <rect
        x="14"
        y="18"
        width="36"
        height="32"
        rx="12"
        fill="url(#devbot-shell)"
      />
      <rect x="20" y="26" width="24" height="14" rx="7" fill="oklch(0.18 0.02 165)" />
      <circle className="devbot-eye" cx="27" cy="33" r="2.4" fill="oklch(0.9 0.08 155)" />
      <circle className="devbot-eye" cx="37" cy="33" r="2.4" fill="oklch(0.9 0.08 155)" />
      <path
        d="M26 42c2.2 2.4 9.8 2.4 12 0"
        fill="none"
        stroke="oklch(0.95 0.02 155)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="32" cy="14" r="3.2" fill="url(#devbot-shell)" />
      <rect x="30.5" y="8" width="3" height="6" rx="1.5" fill="url(#devbot-shell)" />
      <circle cx="32" cy="7" r="2" fill="oklch(0.78 0.14 155)" className="devbot-antenna" />
      <rect x="8" y="28" width="6" height="12" rx="3" fill="url(#devbot-shell)" />
      <rect x="50" y="28" width="6" height="12" rx="3" fill="url(#devbot-shell)" />
    </svg>
  )
}
