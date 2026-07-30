import { knowledge, type KnowledgeDoc } from '@/content/knowledge'

/**
 * A small BM25 search engine over the knowledge base.
 *
 * BM25 rather than plain term overlap because it does the two things that
 * matter on a corpus this small: it discounts terms that appear in most
 * documents (every document here says "developer"), and it stops long
 * documents from winning purely for being long.
 */

const STOPWORDS = new Set([
  'a',
  'about',
  'all',
  'am',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'been',
  'but',
  'by',
  'can',
  'did',
  'do',
  'does',
  'for',
  'from',
  'had',
  'has',
  'have',
  'he',
  'her',
  'his',
  'how',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'me',
  'my',
  'of',
  'on',
  'or',
  'so',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'to',
  'us',
  'was',
  'we',
  'were',
  'what',
  'when',
  'which',
  'who',
  'will',
  'with',
  'you',
  'your',
])

/**
 * Words that mean the same thing collapse to one canonical token, applied to
 * both the index and the query. This has to be two-way: a one-way query alias
 * of tech -> technology still ranked the education document first for "tech
 * stack", because "campus tech community" was the only literal "tech" in the
 * corpus and so carried a high IDF.
 */
const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ['technology', 'tech', 'technologies'],
  ['javascript', 'js'],
  ['typescript', 'ts'],
  ['nextjs', 'next'],
  ['nodejs', 'node'],
  ['mongodb', 'mongo'],
  ['resume', 'cv'],
  ['ai', 'llm'],
  ['location', 'located', 'based', 'live', 'living', 'where'],
  ['education', 'study', 'studied', 'university', 'school', 'college', 'uni'],
  ['availability', 'available'],
  ['contact', 'reach', 'mail'],
]

const CANONICAL = new Map<string, string>()
for (const group of SYNONYM_GROUPS) {
  const [canonical] = group
  if (!canonical) continue
  for (const word of group) CANONICAL.set(word, canonical)
}

/**
 * One-way broadening applied to queries only, for words that signal an intent
 * rather than name a thing. "What's your rate?" should find the availability
 * document even though it never uses the word "rate".
 */
const QUERY_EXPANSIONS: Record<string, readonly string[]> = {
  salary: ['availability', 'hire', 'freelance'],
  rate: ['availability', 'hire', 'freelance'],
  cost: ['availability', 'hire', 'freelance'],
  price: ['availability', 'hire', 'freelance'],
  hire: ['availability', 'freelance'],
  hiring: ['availability', 'freelance'],
  stack: ['technology', 'skill'],
  skill: ['technology'],
  tool: ['technology'],
  degree: ['education'],
  rn: ['react', 'native'],
  db: ['database', 'mongodb'],
  ml: ['ai', 'machine', 'learning'],
  app: ['mobile', 'react', 'native'],
  mobile: ['react', 'native'],
  frontend: ['react', 'interface'],
  backend: ['nodejs', 'api', 'database'],
  devops: ['docker', 'tool'],
  css: ['tailwind'],
  postgres: ['database'],
}

/**
 * Deliberately crude suffix stripping rather than a real stemmer. On a corpus
 * of ~20 short documents a full Porter stemmer is more code and more risk
 * than it is worth; collapsing plurals and gerunds gets nearly all the recall.
 */
function stem(token: string) {
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`
  if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3)
  if (token.length > 4 && token.endsWith('ed')) return token.slice(0, -2)
  if (token.length > 4 && token.endsWith('es')) return token.slice(0, -2)
  if (token.length > 3 && token.endsWith('s') && !token.endsWith('ss')) {
    return token.slice(0, -1)
  }
  return token
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/[\s\-.]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
}

/** Collapse a raw token to the form stored in the index. */
function normalise(token: string) {
  return CANONICAL.get(token) ?? CANONICAL.get(stem(token)) ?? stem(token)
}

function indexTerms(text: string) {
  return tokenize(text).map(normalise)
}

function queryTerms(text: string) {
  const out: string[] = []
  for (const token of tokenize(text)) {
    out.push(normalise(token))
    for (const extra of QUERY_EXPANSIONS[token] ??
      QUERY_EXPANSIONS[stem(token)] ??
      []) {
      out.push(normalise(extra))
    }
  }
  return out
}

type IndexedDoc = {
  doc: KnowledgeDoc
  length: number
  frequencies: Map<string, number>
}

type Index = {
  docs: readonly IndexedDoc[]
  documentFrequency: Map<string, number>
  averageLength: number
}

function buildIndex(): Index {
  const documentFrequency = new Map<string, number>()

  const docs = knowledge.map((doc) => {
    // Title and keywords are repeated so that a hit there outweighs a passing
    // mention in the body.
    const searchable = [
      doc.title,
      doc.title,
      doc.keywords.join(' '),
      doc.keywords.join(' '),
      doc.body,
    ].join(' ')

    const tokens = indexTerms(searchable)
    const frequencies = new Map<string, number>()
    for (const token of tokens) {
      frequencies.set(token, (frequencies.get(token) ?? 0) + 1)
    }
    for (const token of frequencies.keys()) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1)
    }

    return { doc, length: tokens.length, frequencies }
  })

  const totalLength = docs.reduce((sum, entry) => sum + entry.length, 0)

  return {
    docs,
    documentFrequency,
    averageLength: docs.length > 0 ? totalLength / docs.length : 0,
  }
}

// The corpus is static, so the index is built once per server process.
let cachedIndex: Index | null = null

function getIndex() {
  cachedIndex ??= buildIndex()
  return cachedIndex
}

const K1 = 1.5
const B = 0.75

export type SearchResult = {
  doc: KnowledgeDoc
  score: number
}

export function search(query: string, limit = 3): SearchResult[] {
  const terms = queryTerms(query)
  if (terms.length === 0) return []

  const { docs, documentFrequency, averageLength } = getIndex()
  const total = docs.length

  const scored = docs.map(({ doc, length, frequencies }) => {
    let score = 0

    for (const term of new Set(terms)) {
      const termFrequency = frequencies.get(term)
      if (!termFrequency) continue

      const docsWithTerm = documentFrequency.get(term) ?? 0
      const idf = Math.log(
        1 + (total - docsWithTerm + 0.5) / (docsWithTerm + 0.5),
      )
      const normalisation =
        termFrequency + K1 * (1 - B + (B * length) / (averageLength || 1))

      score += idf * ((termFrequency * (K1 + 1)) / normalisation)
    }

    return { doc, score }
  })

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/** Section labels to offer when a query matches nothing. */
export function topics() {
  return [...new Set(knowledge.map((doc) => doc.section))]
}
