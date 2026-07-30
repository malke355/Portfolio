import { education, roles } from '@/content/experience'
import { bio, remoteNote, stats, timeline } from '@/content/profile'
import { projects } from '@/content/projects'
import { skillGroups } from '@/content/skills'
import { site, socials } from '@/lib/site'

export type KnowledgeSection =
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'education'
  | 'contact'
  | 'meta'

export type KnowledgeDoc = {
  id: string
  title: string
  section: KnowledgeSection
  /** Prose returned verbatim as the answer, so nothing is ever fabricated. */
  body: string
  /** Extra terms that should match this document but do not appear in body. */
  keywords: readonly string[]
  /** In-page anchor or route the reader can follow for the full context. */
  anchor?: string
}

/**
 * Every answer the terminal can give is derived from the same content that
 * renders the page, so the two can never drift apart — and the assistant is
 * physically unable to invent a fact that is not published on the site.
 */
export const knowledge: readonly KnowledgeDoc[] = [
  {
    id: 'identity',
    title: 'Who I am',
    section: 'about',
    body: `${site.name} — ${site.role} based in ${site.location}. ${site.summary}`,
    keywords: ['who', 'name', 'introduction', 'bio', 'yourself', 'melkamu'],
    anchor: '#home',
  },
  ...bio.map((paragraph, index) => ({
    id: `bio-${index + 1}`,
    title: index === 0 ? 'Background' : 'What I care about',
    section: 'about' as const,
    body: paragraph,
    keywords: ['about', 'background', 'story', 'philosophy', 'approach'],
    anchor: '#about',
  })),
  {
    id: 'availability',
    title: 'Availability',
    section: 'contact',
    body: `${site.availability}. Open to full-stack roles, freelance projects and AI product collaborations. ${remoteNote} I usually reply within a day.`,
    keywords: [
      'available',
      'availability',
      'hire',
      'hiring',
      'freelance',
      'contract',
      'remote',
      'job',
      'work',
      'open',
      'timezone',
    ],
    anchor: '#contact',
  },
  {
    id: 'contact',
    title: 'How to reach me',
    section: 'contact',
    body: `Email ${site.email}, GitHub ${socials.github.href}, LinkedIn ${socials.linkedin.href}. The contact form on this site opens a pre-filled email.`,
    keywords: [
      'contact',
      'reach',
      'email',
      'mail',
      'github',
      'linkedin',
      'social',
      'message',
      'talk',
    ],
    anchor: '#contact',
  },
  {
    id: 'location',
    title: 'Location',
    section: 'contact',
    body: `Based in ${site.location}. ${remoteNote}`,
    keywords: [
      'where',
      'location',
      'based',
      'city',
      'country',
      'ethiopia',
      'addis',
      'relocate',
    ],
    anchor: '#contact',
  },
  {
    id: 'stack-overview',
    title: 'Tech stack',
    section: 'skills',
    body: skillGroups
      .map((group) => `${group.title}: ${group.items.join(', ')}`)
      .join('. '),
    keywords: [
      'stack',
      'tech',
      'technology',
      'technologies',
      'skills',
      'tools',
      'overview',
      'use',
      'using',
      'languages',
      'frameworks',
    ],
    anchor: '#skills',
  },
  ...skillGroups.map((group) => ({
    id: `skills-${group.id}`,
    title: `${group.title} skills`,
    section: 'skills' as const,
    body: `${group.blurb} ${group.title}: ${group.items.join(', ')}.`,
    keywords: [
      'skill',
      'skills',
      'stack',
      'technology',
      'technologies',
      'tools',
      group.title.toLowerCase(),
      ...group.items.map((item) => item.toLowerCase()),
    ],
    anchor: '#skills',
  })),
  ...projects.map((project) => ({
    id: `project-${project.slug}`,
    title: project.name,
    section: 'projects' as const,
    body: `${project.description} Highlights: ${project.highlights.join(', ')}. Built with ${project.stack.join(', ')}.`,
    keywords: [
      'project',
      'projects',
      'built',
      'work',
      'portfolio',
      'shipped',
      project.tag.toLowerCase(),
      ...project.stack.map((item) => item.toLowerCase()),
    ],
    anchor: `/projects/${project.slug}`,
  })),
  ...roles.map((role, index) => ({
    id: `role-${index + 1}`,
    title: `${role.role} · ${role.org} (${role.period})`,
    section: 'experience' as const,
    body: `${role.period} — ${role.role} at ${role.org}. ${role.body} ${role.points.join('. ')}.`,
    keywords: [
      'experience',
      'job',
      'role',
      'career',
      'employment',
      'history',
      'worked',
      role.role.toLowerCase(),
      role.org.toLowerCase(),
    ],
    anchor: '#experience',
  })),
  {
    id: 'education',
    title: 'Education',
    section: 'education',
    body: `${education.degree}, ${education.institution}. ${education.body} ${education.achievements.join('. ')}.`,
    keywords: [
      'education',
      'degree',
      'university',
      'study',
      'studied',
      'school',
      'graduate',
      'bsc',
      'college',
    ],
    anchor: '#experience',
  },
  {
    id: 'timeline',
    title: 'How I got here',
    section: 'about',
    body: timeline
      .map((entry) => `${entry.year}: ${entry.title} — ${entry.body}`)
      .join(' '),
    keywords: ['timeline', 'journey', 'started', 'learning', 'progress'],
    anchor: '#about',
  },
  {
    id: 'stats',
    title: 'By the numbers',
    section: 'about',
    body: stats
      .map((stat) => `${stat.value} ${stat.label} (${stat.hint})`)
      .join(', '),
    keywords: [
      'stats',
      'numbers',
      'how many',
      'years',
      'experience',
      'count',
      'projects',
    ],
    anchor: '#about',
  },
  {
    id: 'this-site',
    title: 'How this site is built',
    section: 'meta',
    body: 'This portfolio runs on Next.js 16 with the App Router, React 19 server components and Tailwind CSS v4 driven by OKLCH design tokens. The terminal you are using searches a knowledge base built from the same typed content that renders the page, using a BM25 ranking function implemented from scratch — no third-party search service and no language model, so it cannot invent an answer. It ships a Content-Security-Policy, Person JSON-LD, a generated OG image, and CI that blocks a merge on a formatting, lint, type or build failure.',
    keywords: [
      'site',
      'website',
      'portfolio',
      'built',
      'source',
      'stack',
      'nextjs',
      'next',
      'tailwind',
      'terminal',
      'how',
      'meta',
      'code',
    ],
  },
] as const
