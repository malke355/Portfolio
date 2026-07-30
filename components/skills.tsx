import { Code2, Server, Wrench } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const groups = [
  {
    title: 'Frontend',
    Icon: Code2,
    blurb: 'Interfaces that feel instant and accessible.',
    items: ['React', 'Next.js', 'React Native', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    Icon: Server,
    blurb: 'APIs and data models built to scale.',
    items: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
  },
  {
    title: 'Tools',
    Icon: Wrench,
    blurb: 'The workflow around shipping software.',
    items: ['Git', 'GitHub', 'Figma', 'Firebase', 'Docker'],
  },
]

export function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-24 border-y border-border py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="The stack I build with every day"
          description="A focused toolkit, chosen for speed of delivery and long-term maintainability."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {groups.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 110}
              className="group glass relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40"
            >
              <div
                aria-hidden
                className="absolute -top-16 -right-16 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25 transition-transform duration-500 group-hover:scale-110">
                  <group.Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-medium">{group.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {group.items.length} technologies
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {group.blurb}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs text-foreground/90 transition-colors duration-300 hover:border-primary/40 hover:text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
