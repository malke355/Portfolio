import { search } from '@/lib/search'

/**
 * Answering is pure: BM25 over a corpus that is compiled into the bundle, with
 * no network call and no server. That is what lets the site ship as static
 * files and still answer questions — and it means the terminal keeps working
 * offline once the page has loaded.
 */

export const MAX_QUESTION_LENGTH = 300

const SUGGESTIONS = [
  'What is your tech stack?',
  'Are you available for work?',
  'Tell me about the GebetaGo project',
  'What did you study?',
  'How is this site built?',
]

const NO_MATCH =
  'I do not have anything on that. Everything I can answer comes from what is published on this site, so I would rather say nothing than guess. Try one of the suggested questions, or email me directly.'

export type Answer = {
  question: string
  answer: string
  confidence: 'high' | 'medium' | 'none'
  sources: {
    id: string
    title: string
    section: string
    anchor: string | null
    score: number
  }[]
  suggestions: string[]
}

export function answerQuestion(rawQuestion: string): Answer {
  const question = rawQuestion.trim().slice(0, MAX_QUESTION_LENGTH)
  const results = search(question, 3)
  const [best, ...rest] = results

  if (!best) {
    return {
      question,
      answer: NO_MATCH,
      confidence: 'none',
      sources: [],
      suggestions: SUGGESTIONS,
    }
  }

  // A clear winner reads as one answer. Only a genuine near-tie justifies
  // stitching a second document on — beyond that the reply turns into a wall
  // of text, and the remaining matches are already listed as sources.
  const runnerUp = rest[0]
  const decisive = !runnerUp || best.score >= runnerUp.score * 1.2

  return {
    question,
    answer: decisive
      ? best.doc.body
      : [best.doc.body, runnerUp.doc.body].join('\n\n'),
    confidence: decisive ? 'high' : 'medium',
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
