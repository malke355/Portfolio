'use client'

import { RotateCcw, Send, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { DevBotRobot } from '@/components/devbot/devbot-robot'
import { askDevBot, openHireMailto } from '@/lib/devbot/client'
import {
  DEVBOT_SUGGESTIONS,
  MAX_DEVBOT_MESSAGE_LENGTH,
  type DevBotMessage,
} from '@/lib/devbot/types'
import { cn } from '@/lib/utils'

type DevBotPanelProps = {
  open: boolean
  onClose: () => void
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const WELCOME: DevBotMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm DevBot, Melkamu's assistant. Ask about his work, stack, achievements, or how to get in touch.",
}

export function DevBotPanel({ open, onClose }: DevBotPanelProps) {
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<DevBotMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [leadMode, setLeadMode] = useState(false)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadMessage, setLeadMessage] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, busy, leadMode])

  function reset() {
    abortRef.current?.abort()
    setMessages([WELCOME])
    setInput('')
    setBusy(false)
    setLeadMode(false)
    setLeadEmail('')
    setLeadMessage('')
  }

  async function send(text: string) {
    const cleaned = text.trim().slice(0, MAX_DEVBOT_MESSAGE_LENGTH)
    if (!cleaned || busy) return

    const userMessage: DevBotMessage = {
      id: newId(),
      role: 'user',
      content: cleaned,
    }
    const history = [...messages, userMessage]
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))

    const assistantId = newId()
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: 'assistant', content: '' },
    ])
    setInput('')
    setBusy(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const reply = await askDevBot(cleaned, history, {
        signal: controller.signal,
        onToken(token) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + token }
                : message,
            ),
          )
        },
      })

      setMessages((prev) =>
        prev.map((message) => {
          if (message.id !== assistantId) return message
          const withLinks =
            reply.links.length > 0
              ? `${reply.content}\n\n${reply.links
                  .map((link) => `→ ${link.label}: ${link.href}`)
                  .join('\n')}`
              : reply.content
          return { ...message, content: withLinks || reply.content }
        }),
      )

      if (reply.leadCapture) setLeadMode(true)
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content:
                  "Something went wrong on my side. Please try again, or use the contact form.",
              }
            : message,
        ),
      )
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  function submitLead(event: React.FormEvent) {
    event.preventDefault()
    if (!leadEmail.trim() || !leadMessage.trim()) return
    openHireMailto(leadEmail.trim(), leadMessage.trim())
    setLeadMode(false)
    setLeadEmail('')
    setLeadMessage('')
    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        role: 'assistant',
        content:
          'Thanks — I opened a pre-filled email so you can send your message to Melkamu.',
      },
    ])
  }

  return (
    <div
      className={cn(
        'border-border bg-surface-elevated fixed z-80 flex flex-col overflow-hidden shadow-lg transition-[opacity,transform] duration-300',
        'inset-0 rounded-none sm:inset-auto sm:right-6 sm:bottom-28 sm:h-[min(34rem,calc(100vh-8rem))] sm:w-[24rem] sm:rounded-2xl sm:border',
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      hidden={!open}
    >
      <header className="border-border flex items-center gap-3 border-b px-4 py-3">
        <span className="bg-accent grid size-10 place-items-center rounded-xl">
          <DevBotRobot className="size-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-sm font-medium tracking-tight">
            DevBot
          </h2>
          <p className="text-muted-foreground text-xs">
            Melkamu&apos;s portfolio assistant
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-muted-foreground hover:bg-secondary focus-visible:ring-ring grid size-9 place-items-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Reset conversation"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:bg-secondary focus-visible:ring-ring grid size-9 place-items-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Close DevBot"
        >
          <X className="size-4" />
        </button>
      </header>

      <div
        ref={scrollerRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-muted text-foreground',
            )}
          >
            {message.content || (busy ? '…' : '')}
          </div>
        ))}
        {busy ? (
          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="devbot-typing inline-flex gap-1" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            DevBot is typing
          </p>
        ) : null}
      </div>

      {!busy && messages.length <= 2 ? (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {DEVBOT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void send(suggestion)}
              className="border-border hover:border-primary/40 hover:bg-accent focus-visible:ring-ring rounded-full border px-2.5 py-1 text-[11px] transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      {leadMode ? (
        <form
          onSubmit={submitLead}
          className="border-border space-y-2 border-t px-4 py-3"
        >
          <p className="text-muted-foreground text-xs">
            Leave your email and a short note — I&apos;ll open Melkamu&apos;s
            contact flow.
          </p>
          <input
            type="email"
            required
            value={leadEmail}
            onChange={(event) => setLeadEmail(event.target.value)}
            placeholder="you@company.com"
            className="border-border bg-background focus:border-primary/50 focus:ring-ring w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          <textarea
            required
            rows={2}
            value={leadMessage}
            onChange={(event) => setLeadMessage(event.target.value)}
            placeholder="What would you like to build together?"
            className="border-border bg-background focus:border-primary/50 focus:ring-ring w-full resize-none rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          <button
            type="submit"
            className="btn-sheen bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
          >
            Send via email
            <Send className="size-3.5" />
          </button>
        </form>
      ) : (
        <form
          className="border-border flex items-center gap-2 border-t px-3 py-3"
          onSubmit={(event) => {
            event.preventDefault()
            void send(input)
          }}
        >
          <label className="sr-only" htmlFor="devbot-input">
            Ask DevBot
          </label>
          <input
            id="devbot-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={MAX_DEVBOT_MESSAGE_LENGTH}
            placeholder="Ask about Melkamu…"
            disabled={busy}
            className="border-border bg-background focus:border-primary/50 focus:ring-ring min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm focus:ring-2 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="bg-primary text-primary-foreground focus-visible:ring-ring grid size-10 shrink-0 place-items-center rounded-xl transition-opacity disabled:opacity-40 focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Send message"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}
    </div>
  )
}
