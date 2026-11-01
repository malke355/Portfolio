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
  return (
    <Icon className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
  )
}

export function Skills() {
  return (
    <section
      id="skills"
      className="border-border relative scroll-mt-24 overflow-hidden border-y bg-transparent py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="ambient-orb ambient-orb-a pointer-events-none top-[-20%] right-[-10%] size-[22rem] opacity-45"
      />
      <div
        aria-hidden
        className="ambient-orb ambient-orb-b pointer-events-none bottom-[-30%] left-[-12%] size-[18rem] opacity-30"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="The stack I build with every day"
          description="A focused toolkit, chosen for speed of delivery and long-term maintainability."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.id}
              delay={i * 90}
              variant={i === 1 ? 'scale' : i === 2 ? 'right' : 'left'}
              spotlight
              className="surface card-lift group flex flex-col rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="bg-accent text-accent-foreground grid size-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105">
                  <SkillIcon name={group.icon} />
                </span>
                <div>
                  <h3 className="text-base font-medium tracking-tight">
                    {group.title}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {group.items.length} technologies
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                {group.blurb}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item, itemIndex) => (
                  <li
                    key={item}
                    className="skill-chip border-border bg-background text-foreground/90 rounded-full border px-2.5 py-1 text-xs"
                    style={{
                      animationDelay: `${180 + i * 90 + itemIndex * 45}ms`,
                    }}
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
