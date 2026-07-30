import { GraduationCap, Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const roles = [
  {
    period: '2024 — Present',
    role: 'Full-Stack Developer',
    org: 'Freelance / Contract',
    body: 'Designing and shipping web and mobile products for clients across delivery, fintech and cooperative finance. Owning architecture, UI implementation, API design and deployment.',
    points: [
      'Led delivery of 3 production platforms with Next.js and Node.js',
      'Integrated LLM-powered assistants and search into client workflows',
      'Containerised services with Docker for predictable deploys',
    ],
  },
  {
    period: '2023 — 2024',
    role: 'Frontend Developer',
    org: 'Product Team',
    body: 'Built and maintained component libraries and dashboards, focusing on accessibility, responsive layout and perceived performance.',
    points: [
      'Rebuilt core dashboard, cutting first-load bundle significantly',
      'Established reusable design-system components in TypeScript',
      'Partnered with designers in Figma from concept to handoff',
    ],
  },
  {
    period: '2022 — 2023',
    role: 'Junior Web Developer',
    org: 'Agency Work',
    body: 'Delivered marketing sites and internal tools, learning production discipline: code review, Git workflow and shipping on deadline.',
    points: [
      'Shipped 10+ responsive client sites',
      'Wrote REST endpoints with Express and MongoDB',
      'Adopted Git-based review workflow across the team',
    ],
  },
]

const achievements = [
  'Graduated with distinction in core software engineering coursework',
  'Led final-year team project on an AI-assisted web platform',
  'Active open-source contributor and campus tech community mentor',
]

export function Experience() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-24 border-t border-border py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've been building"
          description="A steady progression from first commits to owning products in production."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <ol className="relative border-l border-border pl-6 sm:pl-8">
            {roles.map((role, i) => (
              <Reveal
                as="li"
                key={role.role}
                delay={i * 100}
                className="group relative pb-10 last:pb-0"
              >
                <span
                  aria-hidden
                  className="absolute top-2 -left-[calc(1.5rem+5px)] size-2.5 rounded-full bg-primary ring-4 ring-primary/15 transition-transform duration-300 group-hover:scale-125 sm:-left-[calc(2rem+5px)]"
                />
                <div className="glass rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 sm:p-6">
                  <p className="font-mono text-xs tracking-widest text-primary">
                    {role.period}
                  </p>
                  <h3 className="mt-2 text-lg font-medium">{role.role}</h3>
                  <p className="text-sm text-muted-foreground">{role.org}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {role.body}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-sm text-foreground/85"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass overflow-hidden rounded-3xl p-6 sm:p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">
                <GraduationCap className="size-6" />
              </span>
              <p className="mt-5 font-mono text-xs tracking-widest text-primary uppercase">
                Education
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                BSc in Software Engineering
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Bahir Dar University · Institute of Technology
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Studied software design, data structures, databases and
                distributed systems, with a final-year focus on applied machine
                learning for web products.
              </p>

              <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                {achievements.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <Star className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
