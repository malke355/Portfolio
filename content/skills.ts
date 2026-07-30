export type SkillGroup = {
  id: 'frontend' | 'backend' | 'cloud' | 'tools'
  title: string
  icon: 'code' | 'server' | 'cloud' | 'wrench'
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
    id: 'cloud',
    title: 'Cloud & DevOps',
    icon: 'cloud',
    blurb: 'The infrastructure and pipelines that ship it.',
    items: [
      'AWS',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Ansible',
      'Linux',
      'Prometheus',
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    icon: 'wrench',
    blurb: 'The workflow around shipping software.',
    items: [
      'Git',
      'GitHub Actions',
      'Jenkins',
      'CircleCI',
      'SonarQube',
      'Firebase',
      'Figma',
    ],
  },
] as const

/** Rotating strip in the hero. */
export const heroStack = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'MongoDB',
  'AWS',
  'Docker',
  'Kubernetes',
  'Terraform',
] as const

export const allSkills = [
  ...new Set(skillGroups.flatMap((group) => group.items)),
] as const
