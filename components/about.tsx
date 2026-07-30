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
    <section id="about" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden
        className="bg-primary/5 ambient-layer pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full blur-[130px]"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          title="A developer who cares about the details"
          description="I design and build products that feel fast, look considered and hold up in production."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <Reveal className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
            {bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal
            delay={90}
            spotlight
            className="glass flex flex-col rounded-3xl p-6 sm:p-8"
          >
            <h3 className="text-muted-foreground font-mono text-[10px] tracking-[0.25em] uppercase">
              At a glance
            </h3>

            <dl className="mt-6 flex flex-col gap-5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-muted-foreground text-xs">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <p className="text-muted-foreground border-border mt-auto border-t pt-5 text-xs leading-relaxed">
              {remoteNote}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
