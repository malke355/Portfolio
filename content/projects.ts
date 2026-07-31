import { site } from '@/lib/site'

/** Each project links to its own repository, not to the profile page. */
const repo = (name: string) => `https://github.com/${site.handle}/${name}`

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
    /**
     * Optional on purpose. A "Live demo" button that lands on a profile page
     * is worse than no button, so the UI hides it until there is a real URL.
     */
    demo?: string
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
    alt: 'GebetaGo food delivery landing page with Ethiopian cuisine',
    links: {
      github: repo('Food_delivery_platform'),
      demo: 'https://food-delivery-platform-sable.vercel.app/',
    },
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
    alt: 'Yenecash expense tracking landing page',
    links: {
      github: repo('Expense-manager'),
      demo: 'https://expense-tracker-u6mq.vercel.app/',
    },
  },
] as const

export function findProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
