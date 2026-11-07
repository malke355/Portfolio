import { Award, GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { achievements } from '@/content/achievements'
import { education } from '@/content/experience'

const timeline = [
  {
    id: 'education',
    icon: GraduationCap,
    eyebrow: education.year,
    title: education.field,
    subtitle: education.institution,
    body: education.body,
    href: undefined as string | undefined,
  },
  ...achievements.map((item) => ({
    id: item.id,
    icon: Award,
    eyebrow: `${item.place} · ${item.dates}`,
    title: item.event,
    subtitle: `${item.venue} · ${item.city}`,
    body: item.summary,
    href: '#achievements' as string | undefined,
  })),
]

export function Education() {
  return (
    <section
      id="education"
      className="border-border relative scroll-mt-24 border-t py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Study and milestones"
          description="Education in progress, plus recognitions earned while building in public."
        />

        <ol className="relative mt-12 max-w-3xl space-y-0">
          <span
            aria-hidden
            className="bg-border absolute top-3 bottom-3 left-[1.35rem] w-px sm:left-[1.6rem]"
          />
          {timeline.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal
                as="li"
                key={item.id}
                delay={index * 80}
                variant="left"
                className="relative flex gap-4 py-5 sm:gap-6"
              >
                <span className="border-border bg-surface-elevated text-primary relative z-10 grid size-11 shrink-0 place-items-center rounded-xl border shadow-sm sm:size-12">
                  <Icon className="size-5" />
                </span>
                <div className="surface card-lift min-w-0 flex-1 rounded-2xl p-5 shadow-sm sm:p-6">
                  <p className="text-primary text-[11px] font-medium tracking-wide uppercase">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-1.5 text-lg font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {item.subtitle}
                  </p>
                  <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
                    {item.body}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-primary mt-3 inline-flex text-sm font-medium hover:underline"
                    >
                      View certificate
                    </a>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
