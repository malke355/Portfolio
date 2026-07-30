import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { bio, stats, timeline } from '@/content/profile'

export function About() {
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

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="flex flex-col gap-6">
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

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={i * 90}
                  spotlight
                  className="glass group hover:border-primary/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                >
                  <p className="text-primary text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium">{stat.label}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {stat.hint}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <ol className="border-border relative border-l pl-6 sm:pl-8">
            {timeline.map((item, i) => (
              <Reveal
                as="li"
                key={item.year}
                delay={i * 100}
                className="group relative pb-9 last:pb-0"
              >
                <span
                  aria-hidden
                  className="bg-primary ring-primary/15 absolute top-1.5 -left-[calc(1.5rem+5px)] size-2.5 rounded-full ring-4 transition-transform duration-300 group-hover:scale-125 sm:-left-[calc(2rem+5px)]"
                />
                <p className="text-primary font-mono text-xs tracking-widest">
                  {item.year}
                </p>
                <h3 className="mt-1.5 text-base font-medium">{item.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
