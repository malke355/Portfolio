/**
 * Single source of truth for identity, canonical URLs and social links.
 * Everything else in the app (metadata, sitemap, JSON-LD, OG images, the
 * terminal knowledge base) reads from here so there is exactly one place
 * to update when something changes.
 */

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  // Vercel exposes the deployment host but not the protocol.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`

  return 'http://localhost:3000'
}

export const siteUrl = resolveSiteUrl()

export const site = {
  url: siteUrl,
  name: 'Melkamu Teshome',
  initials: 'MT',
  handle: 'malke355',
  role: 'Full-Stack Developer',
  tagline: 'Full-Stack Developer',
  title: 'Melkamu Teshome — Full-Stack Developer',
  description:
    'Full-stack developer building modern web and mobile applications with React, Next.js, React Native and Node.js.',
  summary:
    'Full-stack developer building modern web and mobile applications — from pixel-precise interfaces to reliable APIs, shipped with clean architecture and a product mindset.',
  location: 'Addis Ababa, Ethiopia',
  locationNote: 'Addis Ababa, Ethiopia · Remote friendly',
  availability: 'Open to work',
  email: 'melkamu372@gmail.com',
  keywords: [
    'Melkamu Teshome',
    'Full-Stack Developer',
    'Software Engineer',
    'Next.js',
    'React',
    'React Native',
    'Node.js',
    'TypeScript',
    'MongoDB',
    'Portfolio',
    'Ethiopia',
  ],
} as const

export const socials = {
  github: {
    label: 'GitHub',
    handle: '@malke355',
    href: 'https://github.com/malke355',
  },
  linkedin: {
    label: 'LinkedIn',
    handle: '/in/melkamu-teshome',
    href: 'https://www.linkedin.com/in/melkamu-teshome',
  },
  email: {
    label: 'Email',
    handle: site.email,
    href: `mailto:${site.email}`,
  },
} as const

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'github', label: 'GitHub' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString()
}
