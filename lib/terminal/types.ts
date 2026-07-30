export type Tone = 'default' | 'muted' | 'primary' | 'success' | 'error'

/**
 * Output is a list of structured blocks rather than pre-formatted strings, so
 * the renderer controls typography and the commands stay presentation-free.
 */
export type Block =
  | { kind: 'text'; text: string; tone?: Tone }
  | { kind: 'heading'; text: string }
  | { kind: 'bullets'; items: readonly string[] }
  | { kind: 'pairs'; items: readonly { label: string; value: string }[] }
  | { kind: 'tags'; items: readonly string[] }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'divider' }
  | { kind: 'spinner'; text: string }

export type Entry = {
  id: string
  /** The command as typed, echoed above its output. */
  prompt?: string
  blocks: Block[]
}

export type CommandContext = {
  /** Append blocks to the current entry. */
  print: (...blocks: Block[]) => void
  /** Replace everything printed by the current command so far. */
  replace: (...blocks: Block[]) => void
  clearScreen: () => void
  /** Scroll the page to a section or navigate to a route, then close. */
  goto: (target: string) => void
  close: () => void
  history: readonly string[]
  signal: AbortSignal
}

export type Command = {
  name: string
  aliases?: readonly string[]
  summary: string
  usage?: string
  /** Hidden from `help` but still runnable. */
  hidden?: boolean
  run: (args: readonly string[], ctx: CommandContext) => void | Promise<void>
}
