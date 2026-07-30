import { socials } from '@/lib/site'

export type Project = {
  slug: string
  name: string
  /** Short label rendered as a badge over the cover image. */
  tag: string
  description: string
  highlights: readonly string[]
  stack: readonly string[]
  image: string
  alt: string
  links: {
    github: string
    demo: string
  }
}

export const projects: readonly Project[] = [
  {
    slug: 'gebetago',
    name: 'GebetaGo Food Delivery Platform',
    tag: 'Web + Mobile',
    description:
      'A multi-vendor food delivery product with restaurant onboarding, live order tracking, driver assignment and a merchant dashboard. Built as a Next.js web app with a React Native customer app on a shared Node.js API.',
    highlights: ['Live order tracking', 'Multi-vendor', 'Role-based access'],
    stack: ['Next.js', 'React Native', 'Node.js', 'Express', 'MongoDB'],
    image: '/images/project-gebetago.png',
    alt: 'GebetaGo food delivery dashboard and mobile app interface',
    links: { github: socials.github.href, demo: socials.github.href },
  },
  {
    slug: 'expense-manager',
    name: 'Expense Manager',
    tag: 'Product',
    description:
      'A personal finance tracker that turns raw transactions into clear monthly insight — budgets, recurring detection, category analytics and exportable reports, all in a fast dashboard.',
    highlights: ['Budget analytics', 'Recurring detection', 'CSV export'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    image: '/images/project-expense.png',
    alt: 'Expense manager dashboard with spending charts',
    links: { github: socials.github.href, demo: socials.github.href },
  },
  {
    slug: 'sacco',
    name: 'SACCO Management Platform',
    tag: 'Enterprise',
    description:
      'A savings and credit cooperative platform handling member records, share contributions, loan applications and approval workflows with a full audit trail and admin reporting.',
    highlights: ['Loan workflows', 'Audit trail', 'Member portal'],
    stack: ['Next.js', 'TypeScript', 'Express', 'MongoDB', 'Docker'],
    image: '/images/project-sacco.png',
    alt: 'SACCO management platform admin interface with member table',
    links: { github: socials.github.href, demo: socials.github.href },
  },
] as const

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
