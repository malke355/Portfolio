export type Role = {
  period: string
  role: string
  org: string
  body: string
  points: readonly string[]
}

export type Education = {
  degree: string
  institution: string
  body: string
  achievements: readonly string[]
}

export const roles: readonly Role[] = [
  {
    period: '2024 — Present',
    role: 'Full-Stack Developer',
    org: 'Freelance / Contract',
    body: 'Designing and shipping web and mobile products for clients across delivery, fintech and cooperative finance. Owning architecture, UI implementation, API design and deployment.',
    points: [
      'Led delivery of 3 production platforms with Next.js and Node.js',
      'Integrated LLM-powered assistants and search into client workflows',
      'Containerised services with Docker for predictable deploys',
    ],
  },
  {
    period: '2023 — 2024',
    role: 'Frontend Developer',
    org: 'Product Team',
    body: 'Built and maintained component libraries and dashboards, focusing on accessibility, responsive layout and perceived performance.',
    points: [
      'Rebuilt core dashboard, cutting first-load bundle significantly',
      'Established reusable design-system components in TypeScript',
      'Partnered with designers in Figma from concept to handoff',
    ],
  },
  {
    period: '2022 — 2023',
    role: 'Junior Web Developer',
    org: 'Agency Work',
    body: 'Delivered marketing sites and internal tools, learning production discipline: code review, Git workflow and shipping on deadline.',
    points: [
      'Shipped 10+ responsive client sites',
      'Wrote REST endpoints with Express and MongoDB',
      'Adopted Git-based review workflow across the team',
    ],
  },
] as const

export const education: Education = {
  degree: 'BSc in Software Engineering',
  institution: 'Bahir Dar University · Institute of Technology',
  body: 'Studied software design, data structures, databases and distributed systems, with a final-year focus on applied machine learning for web products.',
  achievements: [
    'Graduated with distinction in core software engineering coursework',
    'Led final-year team project on an AI-assisted web platform',
    'Active open-source contributor and campus tech community mentor',
  ],
} as const
