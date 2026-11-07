import { answerLocally } from '@/lib/devbot/demo-engine'
import { checkRateLimit, clientIp } from '@/lib/devbot/rate-limit'
import {
  MAX_DEVBOT_HISTORY,
  MAX_DEVBOT_MESSAGE_LENGTH,
} from '@/lib/devbot/types'
import { DEVBOT_SYSTEM_RULES } from '@/lib/profile-data'

export const runtime = 'nodejs'

type Body = {
  message?: unknown
  history?: unknown
}

function readHistory(raw: unknown) {
  if (!Array.isArray(raw)) return [] as { role: 'user' | 'assistant'; content: string }[]
  return raw
    .slice(-MAX_DEVBOT_HISTORY)
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const role = (item as { role?: unknown }).role
      const content = (item as { content?: unknown }).content
      if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
        return null
      }
      return {
        role,
        content: content.trim().slice(0, MAX_DEVBOT_MESSAGE_LENGTH),
      }
    })
    .filter((item): item is { role: 'user' | 'assistant'; content: string } =>
      Boolean(item && item.content),
    )
}

export async function POST(request: Request) {
  const limited = checkRateLimit(clientIp(request))
  if (!limited.ok) {
    return Response.json(
      {
        error: 'rate_limited',
        content:
          'Too many messages. Please wait a moment, or use the contact form instead.',
      },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfterSec) },
      },
    )
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 })
  }

  const message =
    typeof body.message === 'string'
      ? body.message.trim().slice(0, MAX_DEVBOT_MESSAGE_LENGTH)
      : ''

  if (!message) {
    return Response.json({ error: 'empty_message' }, { status: 400 })
  }

  const history = readHistory(body.history)
  const apiKey = process.env.DEVBOT_API_KEY?.trim()
  const model = process.env.DEVBOT_MODEL?.trim() || 'gpt-4o-mini'
  const baseUrl = (
    process.env.DEVBOT_BASE_URL?.trim() || 'https://api.openai.com/v1'
  ).replace(/\/$/, '')

  // No key configured → local knowledge engine (demo mode).
  if (!apiKey) {
    const local = answerLocally(message)
    return Response.json(local)
  }

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          { role: 'system', content: DEVBOT_SYSTEM_RULES },
          ...history.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          { role: 'user', content: message },
        ],
      }),
    })

    if (!upstream.ok || !upstream.body) {
      const local = answerLocally(message)
      return Response.json({ ...local, mode: 'demo', fallback: true })
    }

    const encoder = new TextEncoder()
    const reader = upstream.body.getReader()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue
              const payload = trimmed.slice(5).trim()
              if (payload === '[DONE]') continue
              try {
                const parsed = JSON.parse(payload) as {
                  choices?: { delta?: { content?: string } }[]
                }
                const token = parsed.choices?.[0]?.delta?.content
                if (token) controller.enqueue(encoder.encode(token))
              } catch {
                // Skip malformed SSE chunks.
              }
            }
          }
        } catch {
          const local = answerLocally(message)
          controller.enqueue(encoder.encode(local.content))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    const local = answerLocally(message)
    return Response.json({ ...local, mode: 'demo', fallback: true })
  }
}
