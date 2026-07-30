'use client'

import { CornerDownLeft, TerminalSquare, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BlockView } from '@/components/terminal/blocks'
import { site } from '@/lib/site'
import { commands, completions, resolve } from '@/lib/terminal/commands'
import type { Block, CommandContext, Entry } from '@/lib/terminal/types'

const PROMPT = 'guest@melkamu.dev'

const QUICK_ACTIONS = [
  'help',
  'ask are you available for work',
  'gh',
  'projects',
  'ask what is your tech stack',
] as const

const WELCOME: Block[] = [
  {
    kind: 'text',
    text: `${site.name} — melkamu.sh`,
    tone: 'primary',
  },
  {
    kind: 'text',
    text: 'Ask me anything in plain English, or type `help` for commands.',
    tone: 'muted',
  },
  {
    kind: 'text',
    text: 'Answers are drawn only from what is published on this site — nothing is generated.',
    tone: 'muted',
  },
]

type TerminalProps = {
  open: boolean
  onClose: () => void
}

export function Terminal({ open, onClose }: TerminalProps) {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 'welcome', blocks: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const entryIdRef = useRef(0)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  // Keep the newest output in view without yanking the page itself around.
  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [entries])

  useEffect(() => {
    if (!open) return

    restoreFocusRef.current = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      abortRef.current?.abort()
      restoreFocusRef.current?.focus()
    }
  }, [open])

  const goto = useCallback(
    (target: string) => {
      onClose()
      // Wait for the overlay to unmount and the scroll lock to lift.
      requestAnimationFrame(() => {
        if (target.startsWith('#')) {
          document
            .querySelector(target)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.location.assign(target)
        }
      })
    },
    [onClose],
  )

  const execute = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim()
      if (!trimmed) return

      // A new command supersedes anything still in flight.
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setHistory((prev) => [...prev, trimmed])
      setHistoryIndex(null)
      setInput('')

      const resolved = resolve(trimmed)
      if (!resolved) return

      entryIdRef.current += 1
      const id = `entry-${entryIdRef.current}`
      setEntries((prev) => [...prev, { id, prompt: trimmed, blocks: [] }])

      const patch = (next: (blocks: Block[]) => Block[]) =>
        setEntries((prev) =>
          prev.map((entry) =>
            entry.id === id ? { ...entry, blocks: next(entry.blocks) } : entry,
          ),
        )

      const context: CommandContext = {
        print: (...blocks) => patch((current) => [...current, ...blocks]),
        replace: (...blocks) => patch(() => blocks),
        clearScreen: () => setEntries([]),
        goto,
        close: onClose,
        history,
        signal: controller.signal,
      }

      try {
        setBusy(true)
        await resolved.command.run(resolved.args, context)
      } catch (error) {
        if (!controller.signal.aborted) {
          patch((current) => [
            ...current,
            {
              kind: 'text',
              text: error instanceof Error ? error.message : 'Command failed.',
              tone: 'error',
            },
          ])
        }
      } finally {
        setBusy(false)
      }
    },
    [goto, history, onClose],
  )

  const complete = useCallback(() => {
    const [head, ...rest] = input.split(/\s+/)
    if (!head || rest.length > 0) return

    const matches = completions.filter((name) => name.startsWith(head))
    const [only] = matches

    if (matches.length === 1 && only) {
      setInput(`${only} `)
      return
    }

    if (matches.length > 1) {
      entryIdRef.current += 1
      setEntries((prev) => [
        ...prev,
        {
          id: `entry-${entryIdRef.current}`,
          blocks: [{ kind: 'tags', items: matches }],
        },
      ])
    }
  }, [input])

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' && input.trim().length > 0) {
      event.preventDefault()
      complete()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (history.length === 0) return
      const next =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(history[next] ?? '')
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex === null) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(null)
        setInput('')
        return
      }
      setHistoryIndex(next)
      setInput(history[next] ?? '')
      return
    }

    // Terminal muscle memory: Ctrl+L clears, Ctrl+C cancels.
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      setEntries([])
      return
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault()
      abortRef.current?.abort()
      setInput('')
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-200 flex items-start justify-center p-3 sm:p-6 sm:pt-[8vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
    >
      <button
        type="button"
        aria-label="Close terminal"
        onClick={onClose}
        className="bg-background/70 absolute inset-0 cursor-default backdrop-blur-sm"
      />

      {/* Escape is handled globally by TerminalProvider. */}
      <div className="glass animate-in fade-in slide-in-from-top-2 relative flex h-[min(80vh,40rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)] duration-200">
        <header className="border-border/80 flex shrink-0 items-center gap-3 border-b px-4 py-3">
          <span aria-hidden className="flex gap-1.5">
            <span className="bg-destructive/70 size-2.5 rounded-full" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="bg-primary/70 size-2.5 rounded-full" />
          </span>
          <p className="text-muted-foreground flex-1 truncate text-center font-mono text-xs">
            {PROMPT} — melkamu.sh
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-4" />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
        >
          {entries.map((entry) => (
            <div key={entry.id} className="space-y-2">
              {entry.prompt !== undefined && (
                <p className="flex gap-2 font-mono text-xs">
                  <span className="text-primary shrink-0">$</span>
                  <span className="text-foreground/70 break-all">
                    {entry.prompt}
                  </span>
                </p>
              )}
              {entry.blocks.map((block, index) => (
                <BlockView key={`${entry.id}-${index}`} block={block} />
              ))}
            </div>
          ))}
        </div>

        <div className="border-border/80 shrink-0 border-t">
          <ul className="flex scrollbar-none gap-1.5 overflow-x-auto px-4 pt-3 pb-1 sm:px-5">
            {QUICK_ACTIONS.map((action) => (
              <li key={action}>
                <button
                  type="button"
                  onClick={() => void execute(action)}
                  className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-ring rounded-full border px-2.5 py-1 font-mono text-[11px] whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {action}
                </button>
              </li>
            ))}
          </ul>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              void execute(input)
            }}
            className="flex items-center gap-2 px-4 py-3 sm:px-5"
          >
            <label htmlFor="terminal-input" className="sr-only">
              Enter a command or question
            </label>
            <span
              aria-hidden
              className="text-primary shrink-0 font-mono text-xs"
            >
              $
            </span>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={
                busy ? 'Working… (Ctrl+C to cancel)' : 'Ask me anything…'
              }
              className="placeholder:text-muted-foreground/60 min-w-0 flex-1 bg-transparent font-mono text-[13px] outline-none"
            />
            <button
              type="submit"
              aria-label="Run"
              className="text-muted-foreground hover:text-primary focus-visible:ring-ring rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <CornerDownLeft className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

/** Count shown on the launcher, so the trigger advertises what is inside. */
export const commandCount = commands.filter((command) => !command.hidden).length

export { TerminalSquare as TerminalIcon }
