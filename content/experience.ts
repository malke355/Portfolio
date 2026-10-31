export type Education = {
  field: string
  institution: string
  year: string
  body: string
}

export const education: Education = {
  field: 'Information Technology',
  institution: 'Jimma University',
  year: 'Final year',
  body: 'A final-year information technology student, building the full-stack projects listed on this site alongside coursework. Most of what I know about shipping software I picked up by building and breaking things outside the curriculum.',
} as const
