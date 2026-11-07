export type DevBotRole = 'user' | 'assistant' | 'system'

export type DevBotMessage = {
  id: string
  role: Exclude<DevBotRole, 'system'>
  content: string
}

export type DevBotLink = {
  label: string
  href: string
}

export type DevBotReply = {
  content: string
  links: DevBotLink[]
  /** When true, the UI should collect hire lead details. */
  leadCapture?: boolean
  mode: 'demo' | 'llm'
}

export type DevBotHistoryItem = {
  role: 'user' | 'assistant'
  content: string
}

export const DEVBOT_SUGGESTIONS = [
  'Who is Melkamu?',
  'What projects has he built?',
  'What technologies does he use?',
  'Tell me about his Cursor AI Hackathon achievement.',
  'What backend technologies does he work with?',
  'How can I contact him?',
] as const

export const MAX_DEVBOT_MESSAGE_LENGTH = 500
export const MAX_DEVBOT_HISTORY = 12
export const MAX_DEVBOT_MESSAGES_PER_MINUTE = 10
