'use client'

import { TerminalSquare } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { useTerminal } from '@/components/terminal/terminal-provider'
import { cn } from '@/lib/utils'

/**
 * The platform never changes, so there is nothing to subscribe to — but it is
 * still client-only state, and reading it through useSyncExternalStore keeps
 * the server render ('Ctrl') and the hydrated render in agreement.
 */
const noSubscribe = () => () => {}

function readModifier() {
  const platform = `${navigator.platform} ${navigator.userAgent}`
  return /Mac|iPhone|iPad/.test(platform) ? '⌘' : 'Ctrl'
}

function useModifierLabel() {
  return useSyncExternalStore(noSubscribe, readModifier, () => 'Ctrl')
}

export function TerminalTrigger({
  className,
  variant = 'compact',
}: {
  className?: string
  variant?: 'compact' | 'full'
}) {
  const { openTerminal } = useTerminal()
  const modifier = useModifierLabel()

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={openTerminal}
        aria-label="Open interactive terminal"
        title={`Open terminal (${modifier} K)`}
        className={cn(
          'border-border text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-ring grid size-9 place-items-center rounded-xl border transition-colors focus-visible:ring-2 focus-visible:outline-none',
          className,
        )}
      >
        <TerminalSquare className="size-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openTerminal}
      className={cn(
        'glass hover:border-primary/40 focus-visible:ring-ring group inline-flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
    >
      <TerminalSquare className="text-primary size-4" />
      Ask my terminal
      <kbd className="border-border text-muted-foreground group-hover:text-primary ml-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px]">
        {modifier} K
      </kbd>
    </button>
  )
}
