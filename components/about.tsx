import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const stats = [
  { value: '15+', label: 'Projects shipped', hint: 'web · mobile · internal' },
  { value: '20+', label: 'Technologies', hint: 'frontend to infrastructure' },
  { value: '3+', label: 'Years experience', hint: 'freelance & team work' },
]

const timeline = [
  {
    year: '2021',
    title: 'Started with the web',
    body: 'Fell in love with JavaScript, built my first responsive sites and learned Git the hard way.',
  },
  {
    year: '2022',
    title: 'Went full-stack',
    body: 'Node.js, Express and MongoDB — designing REST APIs and authentication flows end to end.',
  },
  {
    year: '2023',
    title: 'Shipped to production',
    body: 'Delivered client dashboards and a food delivery platform with Next.js and React Native.',
  },
  {
    year: '2024',
    title: 'AI-assisted products',
    body: 'Integrated LLM features, vector search and automation into real product workflows.',
  },
]

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-primary/5 blur-[130px]"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          title="A developer who cares about the details"
          description="I design and build products that feel fast, look considered and hold up in production."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="flex flex-col gap-6">
            <Reveal className="glass rounded-3xl p-6 sm:p-8">
              <p className="leading-relaxed text-muted-foreground">
                I&apos;m Melkamu Teshome, a full-stack developer and AI
                enthusiast focused on the JavaScript ecosystem. I work across the
                whole stack — React and Next.js on the front end, Node.js,
                Express and MongoDB on the back end, and React Native when the
                product belongs in someone&apos;s pocket.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                What I enjoy most is the point where engineering meets product:
                turning a rough idea into a clean interface, a sane data model
                and an API that other developers actually enjoy using. Lately
                I&apos;ve been building AI-assisted features that make everyday
                workflows dramatically faster.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={i * 90}
                  className="glass group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
                >
                  <p className="text-3xl font-semibold tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium">{stat.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.hint}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <ol className="relative border-l border-border pl-6 sm:pl-8">
            {timeline.map((item, i) => (
              <Reveal
                as="li"
                key={item.year}
                delay={i * 100}
                className="group relative pb-9 last:pb-0"
              >
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[calc(1.5rem+5px)] size-2.5 rounded-full bg-primary ring-4 ring-primary/15 transition-transform duration-300 group-hover:scale-125 sm:-left-[calc(2rem+5px)]"
                />
                <p className="font-mono text-xs tracking-widest text-primary">
                  {item.year}
                </p>
                <h3 className="mt-1.5 text-base font-medium">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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
