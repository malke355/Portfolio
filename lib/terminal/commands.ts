import { education, roles } from '@/content/experience'
import { bio, currentFocus, stats, timeline } from '@/content/profile'
import { findProject, projects } from '@/content/projects'
import { skillGroups } from '@/content/skills'
import { navLinks, site, socials } from '@/lib/site'
import type { Block, Command, CommandContext } from '@/lib/terminal/types'

type AskResponse = {
  answer: string
  confidence: 'high' | 'medium' | 'none'
  sources: { title: string; anchor: string | null }[]
  suggestions: string[]
}

const help: Command = {
  name: 'help',
  aliases: ['?', 'h'],
  summary: 'List every command',
  run: (_args, ctx) => {
    ctx.print(
      {
        kind: 'text',
        text: `${site.name} — interactive shell`,
        tone: 'primary',
      },
      {
        kind: 'text',
        text: 'Type a command, or ask a question in plain English.',
        tone: 'muted',
      },
      { kind: 'divider' },
      {
        kind: 'pairs',
        items: commands
          .filter((command) => !command.hidden)
          .map((command) => ({
            label: command.usage ?? command.name,
            value: command.summary,
          })),
      },
      { kind: 'divider' },
      {
        kind: 'text',
        text: 'Tab completes · ↑ ↓ walks history · Esc closes',
        tone: 'muted',
      },
    )
  },
}

const about: Command = {
  name: 'about',
  summary: 'Who I am and how I work',
  run: (_args, ctx) => {
    ctx.print(
      { kind: 'heading', text: site.name },
      {
        kind: 'text',
        text: `${site.role} · ${site.location}`,
        tone: 'primary',
      },
      { kind: 'divider' },
      ...bio.map((text): Block => ({ kind: 'text', text })),
      { kind: 'divider' },
      {
        kind: 'pairs',
        items: stats.map((stat) => ({
          label: stat.value,
          value: `${stat.label} — ${stat.hint}`,
        })),
      },
      { kind: 'text', text: `Currently: ${currentFocus}`, tone: 'primary' },
    )
  },
}

const skillsCommand: Command = {
  name: 'skills',
  usage: 'skills [frontend|backend|tools]',
  summary: 'The stack I build with',
  run: (args, ctx) => {
    const filter = args[0]?.toLowerCase()
    const groups = filter
      ? skillGroups.filter((group) => group.id === filter)
      : skillGroups

    if (groups.length === 0) {
      ctx.print({
        kind: 'text',
        text: `Unknown group "${filter}". Try: frontend, backend, tools.`,
        tone: 'error',
      })
      return
    }

    for (const group of groups) {
      ctx.print(
        { kind: 'heading', text: group.title },
        { kind: 'text', text: group.blurb, tone: 'muted' },
        { kind: 'tags', items: group.items },
      )
    }
  },
}

const projectsCommand: Command = {
  name: 'projects',
  usage: 'projects [slug]',
  aliases: ['work'],
  summary: 'Selected work, shipped end to end',
  run: (args, ctx) => {
    const slug = args[0]?.toLowerCase()

    if (!slug) {
      ctx.print(
        { kind: 'heading', text: `${projects.length} selected projects` },
        {
          kind: 'pairs',
          items: projects.map((project) => ({
            label: project.slug,
            value: `${project.name} — ${project.tag}`,
          })),
        },
        {
          kind: 'text',
          text: 'Run `projects <slug>` for the detail.',
          tone: 'muted',
        },
      )
      return
    }

    const project = findProject(slug)
    if (!project) {
      ctx.print(
        {
          kind: 'text',
          text: `No project "${slug}".`,
          tone: 'error',
        },
        {
          kind: 'text',
          text: `Known slugs: ${projects.map((p) => p.slug).join(', ')}.`,
          tone: 'muted',
        },
      )
      return
    }

    ctx.print(
      { kind: 'heading', text: project.name },
      { kind: 'text', text: project.tag, tone: 'primary' },
      { kind: 'text', text: project.description },
      { kind: 'bullets', items: project.highlights },
      { kind: 'tags', items: project.stack },
      { kind: 'link', label: 'View on GitHub', href: project.links.github },
    )
  },
}

const experience: Command = {
  name: 'experience',
  aliases: ['work-history'],
  summary: 'Where I have been building',
  run: (_args, ctx) => {
    for (const role of roles) {
      ctx.print(
        { kind: 'heading', text: `${role.role} · ${role.org}` },
        { kind: 'text', text: role.period, tone: 'primary' },
        { kind: 'text', text: role.body },
        { kind: 'bullets', items: role.points },
        { kind: 'divider' },
      )
    }
  },
}

const educationCommand: Command = {
  name: 'education',
  summary: 'Degree and academic background',
  run: (_args, ctx) => {
    ctx.print(
      { kind: 'heading', text: education.degree },
      { kind: 'text', text: education.institution, tone: 'primary' },
      { kind: 'text', text: education.body },
      { kind: 'bullets', items: education.achievements },
    )
  },
}

const timelineCommand: Command = {
  name: 'timeline',
  summary: 'How I got here, year by year',
  run: (_args, ctx) => {
    ctx.print({
      kind: 'pairs',
      items: timeline.map((entry) => ({
        label: entry.year,
        value: `${entry.title} — ${entry.body}`,
      })),
    })
  },
}

const contact: Command = {
  name: 'contact',
  aliases: ['hire', 'email'],
  summary: 'How to reach me',
  run: (_args, ctx) => {
    ctx.print(
      { kind: 'heading', text: 'Let us build something' },
      { kind: 'text', text: site.availability, tone: 'success' },
      { kind: 'link', label: site.email, href: socials.email.href },
      { kind: 'link', label: socials.github.handle, href: socials.github.href },
      {
        kind: 'link',
        label: socials.linkedin.handle,
        href: socials.linkedin.href,
      },
      {
        kind: 'text',
        text: 'Run `goto contact` for the form.',
        tone: 'muted',
      },
    )
  },
}

const ask: Command = {
  name: 'ask',
  usage: 'ask <question>',
  summary: 'Ask anything about my work',
  run: async (args, ctx) => {
    const question = args.join(' ').trim()
    if (!question) {
      ctx.print(
        {
          kind: 'text',
          text: 'Ask me something — e.g. `ask what is your stack`.',
          tone: 'muted',
        },
        {
          kind: 'text',
          text: 'Answers come only from what is published on this site.',
          tone: 'muted',
        },
      )
      return
    }

    ctx.print({ kind: 'spinner', text: 'Searching…' })

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: ctx.signal,
      })

      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        ctx.replace({
          kind: 'text',
          text: problem?.error ?? `Request failed (${response.status}).`,
          tone: 'error',
        })
        return
      }

      const data = (await response.json()) as AskResponse

      const blocks: Block[] = [{ kind: 'text', text: data.answer }]

      if (data.sources.length > 0) {
        blocks.push({
          kind: 'text',
          text: `Source: ${data.sources.map((source) => source.title).join(' · ')}`,
          tone: 'muted',
        })
      }

      if (data.suggestions.length > 0) {
        blocks.push({ kind: 'bullets', items: data.suggestions })
      }

      ctx.replace(...blocks)
    } catch (error) {
      if (ctx.signal.aborted) return
      ctx.replace({
        kind: 'text',
        text: error instanceof Error ? error.message : 'Something went wrong.',
        tone: 'error',
      })
    }
  },
}

const github: Command = {
  name: 'gh',
  aliases: ['github'],
  summary: 'Live GitHub activity',
  run: (_args, ctx) => {
    // The rich renderer owns fetching and its own loading state.
    ctx.print({ kind: 'github' })
  },
}

const goto: Command = {
  name: 'goto',
  usage: 'goto <section>',
  summary: 'Jump to a section of the page',
  run: (args, ctx) => {
    const target = args[0]?.toLowerCase()
    const sections = navLinks.map((link) => link.id)

    if (!target || !sections.some((section) => section === target)) {
      ctx.print({
        kind: 'text',
        text: `Sections: ${sections.join(', ')}.`,
        tone: target ? 'error' : 'muted',
      })
      return
    }

    ctx.goto(`#${target}`)
  },
}

const clear: Command = {
  name: 'clear',
  aliases: ['cls'],
  summary: 'Clear the screen',
  run: (_args, ctx) => ctx.clearScreen(),
}

const exit: Command = {
  name: 'exit',
  aliases: ['quit', 'q'],
  summary: 'Close the terminal',
  run: (_args, ctx) => ctx.close(),
}

const historyCommand: Command = {
  name: 'history',
  hidden: true,
  summary: 'Show commands run this session',
  run: (_args, ctx) => {
    if (ctx.history.length === 0) {
      ctx.print({ kind: 'text', text: 'Nothing yet.', tone: 'muted' })
      return
    }
    ctx.print({
      kind: 'pairs',
      items: ctx.history.map((entry, index) => ({
        label: String(index + 1),
        value: entry,
      })),
    })
  },
}

const whoami: Command = {
  name: 'whoami',
  hidden: true,
  summary: 'Identify the current user',
  run: (_args, ctx) => {
    ctx.print(
      { kind: 'text', text: 'guest', tone: 'primary' },
      {
        kind: 'text',
        text: 'A very welcome one. Try `ask` if you are hiring.',
        tone: 'muted',
      },
    )
  },
}

const sudo: Command = {
  name: 'sudo',
  hidden: true,
  summary: 'Elevate privileges',
  run: (_args, ctx) => {
    ctx.print({
      kind: 'text',
      text: 'guest is not in the sudoers file. This incident has been logged.',
      tone: 'error',
    })
  },
}

export const commands: readonly Command[] = [
  help,
  ask,
  about,
  skillsCommand,
  projectsCommand,
  experience,
  educationCommand,
  timelineCommand,
  github,
  contact,
  goto,
  clear,
  exit,
  historyCommand,
  whoami,
  sudo,
]

export function findCommand(name: string) {
  const needle = name.toLowerCase()
  return commands.find(
    (command) =>
      command.name === needle || command.aliases?.includes(needle) === true,
  )
}

/** Every name and alias, for tab completion. */
export const completions = commands
  .flatMap((command) => [command.name, ...(command.aliases ?? [])])
  .sort()

/**
 * Anything that is not a known command is treated as a question, so a visitor
 * who types "are you available?" gets an answer instead of "command not
 * found". This is the behaviour people actually expect from a prompt on a
 * portfolio.
 */
export function resolve(input: string): {
  command: Command
  args: readonly string[]
} | null {
  const parts = input.trim().split(/\s+/).filter(Boolean)
  const [head, ...rest] = parts
  if (!head) return null

  const command = findCommand(head)
  if (command) return { command, args: rest }

  return { command: ask, args: parts }
}

export type { CommandContext }
