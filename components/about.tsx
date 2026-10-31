import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { education } from '@/content/experience'
import { bio } from '@/content/profile'
import { site } from '@/lib/site'

type GlanceItem = {
  label: string
  value: string
  detail?: string
}

export function About() {
  const facts: GlanceItem[] = [
    { label: 'Based in', value: site.location },
    {
      label: 'Education',
      value: `Final-Year ${education.field} Student`,
      detail: education.institution,
    },
    {
      label: 'Specialization',
      value: 'Full-Stack & Backend Development',
    },
    {
      label: 'Currently exploring',
      value: 'Artificial Intelligence & Machine Learning',
    },
    {
      label: 'Availability',
      value: 'Open to Work & Collaboration',
    },
  ]

  return (
    <section id="about" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          title="A developer who cares about the details"
          description="I design and build products that feel fast, look considered and hold up in production."
        />

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <Reveal
            variant="blur"
            spotlight
            className="surface card-lift flex h-full flex-col gap-5 rounded-2xl p-6 shadow-sm sm:p-8"
          >
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
            delay={100}
            variant="scale"
            spotlight
            className="surface-muted card-lift flex h-full flex-col rounded-2xl p-6 sm:p-8"
          >
            <h3 className="text-sm font-medium tracking-tight">At a glance</h3>

            <dl className="mt-6 flex flex-1 flex-col justify-between gap-0">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border-border flex flex-1 flex-col justify-center border-b py-4 first:pt-0 last:border-0 last:pb-2"
                >
                  <dt className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-snug font-medium sm:text-base">
                    {fact.value}
                  </dd>
                  {fact.detail ? (
                    <dd className="text-muted-foreground mt-1 text-sm leading-snug">
                      {fact.detail}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>

            <a
              href="#skills"
              aria-label="Continue to skills"
              className="border-border text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:ring-ring mx-auto mt-4 grid size-9 place-items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ChevronDown className="size-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
