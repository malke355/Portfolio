import { answerQuestion } from '@/lib/answer'
import { profileData } from '@/lib/profile-data'
import { site } from '@/lib/site'
import type { DevBotLink, DevBotReply } from '@/lib/devbot/types'

const HIRE_PATTERN =
  /\b(hire|hiring|freelance|contract|job|opportunity|recruit|work together|available for work)\b/i

function uniqueLinks(links: DevBotLink[]): DevBotLink[] {
  const seen = new Set<string>()
  return links.filter((link) => {
    if (seen.has(link.href)) return false
    seen.add(link.href)
    return true
  })
}

function projectsAnswer(): DevBotReply {
  const lines = profileData.projects.map(
    (project, index) =>
      `${index + 1}. **${project.name}** — ${project.description} ([details](${project.anchor}))`,
  )
  return {
    content: `Melkamu has shipped these projects end to end:\n\n${lines.join('\n\n')}\n\nYou can browse them in the Projects section.`,
    links: uniqueLinks([
      { label: 'Projects', href: '#projects' },
      ...profileData.projects.map((project) => ({
        label: project.name,
        href: project.anchor,
      })),
    ]),
    mode: 'demo' as const,
  }
}

function achievementAnswer(): DevBotReply {
  const award = profileData.achievements[0]
  if (!award) {
    return {
      content: `I don't have that info, but you can reach Melkamu at ${site.email}.`,
      links: [{ label: 'Contact', href: '#contact' }],
      mode: 'demo',
    }
  }

  return {
    content: `Melkamu won **${award.place}** at the **${award.event}** (${award.dates} · ${award.venue} · ${award.city}). ${award.summary} The certificate was signed by ${award.signedBy.name}, ${award.signedBy.title}.`,
    links: [
      { label: 'Achievements', href: '#achievements' },
      { label: 'Contact', href: '#contact' },
    ],
    mode: 'demo',
  }
}

function backendAnswer(): DevBotReply {
  const backend = profileData.skills.find((group) => group.id === 'backend')
  return {
    content: backend
      ? `On the backend, Melkamu works with ${backend.items.join(', ')}. ${backend.blurb}`
      : `I don't have that info, but you can reach Melkamu at ${site.email}.`,
    links: [
      { label: 'Skills', href: '#skills' },
      { label: 'Projects', href: '#projects' },
    ],
    mode: 'demo',
  }
}

function whoAnswer(): DevBotReply {
  return {
    content: `${profileData.identity.name} is a ${profileData.identity.role} based in ${profileData.identity.location}. ${profileData.bio[0]}`,
    links: [
      { label: 'About', href: '#about' },
      { label: 'Home', href: '#home' },
    ],
    mode: 'demo',
  }
}

function contactAnswer(): DevBotReply {
  return {
    content: `You can email Melkamu at ${site.email}, or use the contact form on this site. GitHub: ${profileData.identity.socials.github}. LinkedIn: ${profileData.identity.socials.linkedin}. ${profileData.identity.availability}.`,
    links: [{ label: 'Contact', href: '#contact' }],
    mode: 'demo',
  }
}

function skillsAnswer(): DevBotReply {
  const lines = profileData.skills.map(
    (group) => `**${group.title}:** ${group.items.join(', ')}`,
  )
  return {
    content: `Melkamu works across:\n\n${lines.join('\n')}`,
    links: [{ label: 'Skills', href: '#skills' }],
    mode: 'demo',
  }
}

/**
 * Local demo mode: keyword routing first, then BM25 over the published
 * knowledge base. No network, no API key — works on static hosts.
 */
export function answerLocally(rawQuestion: string): DevBotReply {
  const question = rawQuestion.trim()
  const lower = question.toLowerCase()
  const wantsHire = HIRE_PATTERN.test(question)

  if (
    /\bwho is\b|\bwho'?s\b|\babout melkamu\b|\bintroduction\b/.test(lower) ||
    lower === 'who is melkamu?'
  ) {
    return { ...whoAnswer(), leadCapture: wantsHire }
  }

  if (
    /\bprojects?\b|\bbuilt\b|\bportfolio\b|\bgebeta\b|\byenecash\b|\bexpense\b|\bfilfilu\b|\bisms\b/.test(
      lower,
    )
  ) {
    if (
      /\bwhat projects\b|\bprojects has\b|\bbuilt\b|\blist\b|\ball projects\b/.test(
        lower,
      ) ||
      lower.includes('what projects')
    ) {
      return { ...projectsAnswer(), leadCapture: wantsHire }
    }
  }

  if (
    /\bhackathon\b|\bcursor ai\b|\bachievement\b|\baward\b|\b1st place\b|\bfirst place\b|\bcertificate\b/.test(
      lower,
    )
  ) {
    return { ...achievementAnswer(), leadCapture: wantsHire }
  }

  if (
    /\bbackend\b|\bnest\b|\bexpress\b|\bnode\.?js\b|\bapi\b|\bsql\b/.test(lower)
  ) {
    return { ...backendAnswer(), leadCapture: wantsHire }
  }

  if (
    /\btechnolog\b|\btech stack\b|\bskills?\b|\btools?\b|\bfrontend\b|\bstack\b/.test(
      lower,
    )
  ) {
    return { ...skillsAnswer(), leadCapture: wantsHire }
  }

  if (/\bcontact\b|\bemail\b|\breach\b|\bhire\b|\bavailable\b/.test(lower)) {
    return {
      ...contactAnswer(),
      leadCapture: wantsHire || /\bhire\b/.test(lower),
    }
  }

  const ranked = answerQuestion(question)
  if (ranked.confidence === 'none') {
    return {
      content: `I don't have that info, but you can reach Melkamu at ${site.email}.`,
      links: [{ label: 'Contact', href: '#contact' }],
      leadCapture: wantsHire,
      mode: 'demo',
    }
  }

  const links = uniqueLinks(
    ranked.sources
      .filter((source) => source.anchor)
      .map((source) => ({
        label: source.title,
        href: source.anchor as string,
      })),
  )

  return {
    content: ranked.answer,
    links: links.length > 0 ? links : [{ label: 'About', href: '#about' }],
    leadCapture: wantsHire,
    mode: 'demo',
  }
}
