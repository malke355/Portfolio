import { Code2, Server, Wrench } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import type { SkillGroup } from '@/content/skills'
import { skillGroups } from '@/content/skills'

const icons = {
  code: Code2,
  server: Server,
  wrench: Wrench,
} as const

function SkillIcon({ name }: { name: SkillGroup['icon'] }) {
  const Icon = icons[name]
  return <Icon className="size-5" />
}

export function Skills() {
  return (
    <section
      id="skills"
      className="border-border relative scroll-mt-24 border-y py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="The stack I build with every day"
          description="A focused toolkit, chosen for speed of delivery and long-term maintainability."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.id}
              delay={i * 110}
              className="group glass hover:border-primary/40 relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1.5"
            >
              <div
                aria-hidden
                className="bg-primary/10 absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="flex items-center gap-3">
                <span className="bg-primary/12 text-primary ring-primary/25 grid size-11 place-items-center rounded-2xl ring-1 transition-transform duration-500 group-hover:scale-110">
                  <SkillIcon name={group.icon} />
                </span>
                <div>
                  <h3 className="text-lg font-medium">{group.title}</h3>
                  <p className="text-muted-foreground text-xs">
                    {group.items.length} technologies
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                {group.blurb}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-border bg-secondary/50 text-foreground/90 hover:border-primary/40 hover:text-primary rounded-lg border px-2.5 py-1.5 text-xs transition-colors duration-300"
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
