export type Stat = {
  value: string
  label: string
  hint: string
}

export type TimelineEntry = {
  year: string
  title: string
  body: string
}

export const bio = [
  "I'm Melkamu Teshome, a full-stack developer and AI enthusiast focused on the JavaScript ecosystem. I work across the whole stack — React and Next.js on the front end, Node.js, Express and MongoDB on the back end, and React Native when the product belongs in someone's pocket.",
  "What I enjoy most is the point where engineering meets product: turning a rough idea into a clean interface, a sane data model and an API that other developers actually enjoy using. Lately I've been building AI-assisted features that make everyday workflows dramatically faster.",
] as const

export const stats: readonly Stat[] = [
  { value: '15+', label: 'Projects shipped', hint: 'web · mobile · internal' },
  { value: '20+', label: 'Technologies', hint: 'frontend to infrastructure' },
  { value: '3+', label: 'Years experience', hint: 'freelance & team work' },
] as const

export const timeline: readonly TimelineEntry[] = [
  {
    year: '2021',
    title: 'Started with the web',
    body: 'Fell in love with JavaScript, built my first responsive sites and learned Git the hard way.',
  },
  {
    year: '2022',
    title: 'Went full-stack',
    body: 'Node.js, Express and MongoDB — designing REST APIs and authentication flows end to end.',
  },
  {
    year: '2023',
    title: 'Shipped to production',
    body: 'Delivered client dashboards and a food delivery platform with Next.js and React Native.',
  },
  {
    year: '2024',
    title: 'AI-assisted products',
    body: 'Integrated LLM features, vector search and automation into real product workflows.',
  },
] as const

export const currentFocus = 'Building AI-powered products'

export const remoteNote =
  'Available for remote work across EMEA and US time zones, with overlap hours for standups and pairing.'
