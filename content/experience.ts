export type Education = {
  field: string
  institution: string
  /** Kept separate from status so other surfaces can compose them freely. */
  year: string
  status: string
  body: string
}

export const education: Education = {
  field: 'Information Technology',
  institution: 'Jimma University',
  year: '3rd year',
  status: 'Not yet graduated',
  body: 'A third-year information technology student, building the full-stack projects listed on this site alongside coursework. Most of what I know about shipping software I picked up by building and breaking things outside the curriculum.',
} as const
