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
    blurb: 'Interfaces that feel instant and accessible.',
    items: ['React', 'Next.js', 'React Native', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: 'server',
    blurb: 'APIs and data models built to scale.',
    items: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
  },
  {
    id: 'tools',
    title: 'Tools',
    icon: 'wrench',
    blurb: 'The workflow around shipping software.',
    items: ['Git', 'GitHub', 'Figma', 'Firebase', 'Docker'],
  },
] as const

/** Rotating strip in the hero. */
export const heroStack = [
  'React',
  'Next.js',
  'React Native',
  'TypeScript',
  'Node.js',
  'MongoDB',
  'Tailwind CSS',
  'Docker',
] as const

export const allSkills = [
  ...new Set(skillGroups.flatMap((group) => group.items)),
] as const
