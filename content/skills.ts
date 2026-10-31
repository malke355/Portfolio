export type SkillGroup = {
  id: 'frontend' | 'backend' | 'tools'
  title: string
  icon: 'code' | 'server' | 'wrench'
  blurb: string
  items: readonly string[]
}

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'code',
    blurb: 'Modern, responsive user experiences.',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'React Native'],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: 'server',
    blurb: 'APIs, data, and scalable server-side systems.',
    items: ['Node.js', 'Express', 'NestJS', 'REST APIs', 'SQL', 'MongoDB'],
  },
  {
    id: 'tools',
    title: 'Tools & AI',
    icon: 'wrench',
    blurb: 'The workflow around building and shipping software.',
    items: ['Git', 'GitHub', 'Docker', 'Figma', 'AI APIs'],
  },
] as const

/** Every skill across Frontend, Backend, and Tools & AI (source for SEO + hero). */
export const allSkills = [
  ...new Set(skillGroups.flatMap((group) => [...group.items])),
] as const

/** Rotating strip in the hero — mirrors allSkills so the marquee stays complete. */
export const heroStack = allSkills
