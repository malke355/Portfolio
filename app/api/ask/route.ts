import { NextResponse } from 'next/server'
import { search } from '@/lib/search'

const MAX_QUESTION_LENGTH = 300

/**
 * Fixed-window limiter keyed by IP. This lives in process memory, so on a
 * serverless platform each instance keeps its own counter — enough to stop a
 * loop hammering the endpoint, not a substitute for a shared store.
 */
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 30
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimit(key: string) {
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfter: 0 }
  }

  entry.count += 1
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  return { allowed: true, retryAfter: 0 }
}

function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'local'
}

const SUGGESTIONS = [
  'What is your tech stack?',
  'Are you available for work?',
  'Tell me about the GebetaGo project',
  'What did you study?',
  'How is this site built?',
]

function answer(question: string) {
  const results = search(question, 3)

  if (results.length === 0) {
    return {
      question,
      answer:
        'I do not have anything on that. Everything I can answer comes from what is published on this site, so I would rather say nothing than guess. Try one of the suggested questions, or email me directly.',
      confidence: 'none' as const,
      sources: [],
      suggestions: SUGGESTIONS,
    }
  }

  const [best, ...rest] = results
  if (!best) {
    return {
      question,
      answer: 'Nothing matched.',
      confidence: 'none' as const,
      sources: [],
      suggestions: SUGGESTIONS,
    }
  }

  // A clear winner reads as one answer. Only a genuine near-tie justifies
  // stitching a second document on — beyond that the reply turns into a wall
  // of text, and the remaining matches are already listed as sources.
  const runnerUp = rest[0]
  const decisive = !runnerUp || best.score >= runnerUp.score * 1.2

  const body = decisive
    ? best.doc.body
    : [best.doc.body, runnerUp.doc.body].join('\n\n')

  return {
    question,
    answer: body,
    confidence: decisive ? ('high' as const) : ('medium' as const),
    sources: results.map((result) => ({
      id: result.doc.id,
      title: result.doc.title,
      section: result.doc.section,
      anchor: result.doc.anchor ?? null,
      score: Number(result.score.toFixed(3)),
    })),
    suggestions: [],
  }
}

function respond(question: unknown, request: Request) {
  if (typeof question !== 'string' || question.trim().length === 0) {
    return NextResponse.json(
      { error: 'Provide a non-empty "q" question string.' },
      { status: 400 },
    )
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Questions are limited to ${MAX_QUESTION_LENGTH} characters.` },
      { status: 413 },
    )
  }

  const limit = rateLimit(clientKey(request))
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Give it a minute.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  return NextResponse.json(answer(question.trim()), {
    headers: { 'Cache-Control': 'no-store' },
  })
}

/** GET keeps the endpoint curl-able: /api/ask?q=what+is+your+stack */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')
  return respond(q, request)
}

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Expected a JSON body.' },
      { status: 400 },
    )
  }

  const question =
    typeof payload === 'object' && payload !== null
      ? (payload as Record<string, unknown>).question
      : undefined

  return respond(question, request)
}
