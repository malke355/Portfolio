export type Education = {
  field: string
  institution: string
  status: string
  body: string
}

export const education: Education = {
  field: 'Information Technology',
  institution: 'Jimma University',
  status: 'In progress — not yet graduated',
  body: 'Studying information technology while building the full-stack projects listed on this site. Most of what I know about shipping software I learned by building and breaking things outside coursework.',
} as const
