import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { education } from '@/content/experience'
import { bio, currentFocus, remoteNote } from '@/content/profile'
import { site } from '@/lib/site'

export function About() {
  const facts = [
    { label: 'Based in', value: site.location },
    {
      label: 'Studying',
      value: `${education.year} ${education.field}, ${education.institution}`,
    },
    { label: 'Focus', value: currentFocus },
    { label: 'Availability', value: site.availability },
  ]

  return (
    <section id="about" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          title="A developer who cares about the details"
          description="I design and build products that feel fast, look considered and hold up in production."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <Reveal className="surface flex flex-col gap-5 rounded-2xl p-6 shadow-sm sm:p-8">
            {bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-muted-foreground text-[15px] leading-relaxed sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal
            delay={80}
            className="surface-muted flex flex-col rounded-2xl p-6 sm:p-8"
          >
            <h3 className="text-sm font-medium tracking-tight">At a glance</h3>

            <dl className="mt-6 flex flex-col gap-5">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border-border border-b pb-4 last:border-0 last:pb-0"
                >
                  <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-snug font-medium">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-muted-foreground mt-auto pt-6 text-xs leading-relaxed">
              {remoteNote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
