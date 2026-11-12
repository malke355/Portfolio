import { answerLocally } from '@/lib/devbot/demo-engine'
import type { DevBotHistoryItem, DevBotReply } from '@/lib/devbot/types'
import {
  MAX_DEVBOT_HISTORY,
  MAX_DEVBOT_MESSAGE_LENGTH,
} from '@/lib/devbot/types'
import { site } from '@/lib/site'

export type StreamHandlers = {
  onToken?: (token: string) => void
  signal?: AbortSignal
}

function trimHistory(history: DevBotHistoryItem[]): DevBotHistoryItem[] {
  return history.slice(-MAX_DEVBOT_HISTORY).map((item) => ({
    role: item.role,
    content: item.content.slice(0, MAX_DEVBOT_MESSAGE_LENGTH),
  }))
}

/**
 * Prefer the streaming API when an LLM key is configured on the host.
 * Fall back to the local knowledge engine on any failure (including static
 * GitHub Pages hosts that have no /api routes).
 */
export async function askDevBot(
  message: string,
  history: DevBotHistoryItem[] = [],
  handlers: StreamHandlers = {},
): Promise<DevBotReply> {
  const cleaned = message.trim().slice(0, MAX_DEVBOT_MESSAGE_LENGTH)
  if (!cleaned) {
    return answerLocally('help')
  }

  try {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
    const response = await fetch(`${base}/api/devbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: cleaned,
        history: trimHistory(history),
      }),
      signal: handlers.signal,
    })

    if (!response.ok) {
      return answerLocally(cleaned)
    }

    const contentType = response.headers.get('content-type') ?? ''

    if (
      contentType.includes('text/event-stream') ||
      contentType.includes('text/plain')
    ) {
      const reader = response.body?.getReader()
      if (!reader) return answerLocally(cleaned)

      const decoder = new TextDecoder()
      let content = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        content += chunk
        handlers.onToken?.(chunk)
      }

      return {
        content: content.trim() || answerLocally(cleaned).content,
        links: [],
        mode: 'llm',
        leadCapture: /\bhire|freelance|contract|job\b/i.test(cleaned),
      }
    }

    const data = (await response.json()) as {
      content?: string
      links?: DevBotReply['links']
      leadCapture?: boolean
      mode?: 'demo' | 'llm'
    }

    if (data.content) {
      if (handlers.onToken) handlers.onToken(data.content)
      return {
        content: data.content,
        links: data.links ?? [],
        leadCapture: data.leadCapture,
        mode: data.mode ?? 'llm',
      }
    }

    return answerLocally(cleaned)
  } catch {
    const local = answerLocally(cleaned)
    if (handlers.onToken) handlers.onToken(local.content)
    return local
  }
}

export function openHireMailto(email: string, message: string) {
  const subject = encodeURIComponent('Hire enquiry via DevBot')
  const body = encodeURIComponent(`${message}\n\n— Visitor (${email})`)
  window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
}
