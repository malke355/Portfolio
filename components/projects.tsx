import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { GithubIcon } from '@/components/brand-icons'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const projects = [
  {
    name: 'GebetaGo Food Delivery Platform',
    tag: 'Web + Mobile',
    description:
      'A multi-vendor food delivery product with restaurant onboarding, live order tracking, driver assignment and a merchant dashboard. Built as a Next.js web app with a React Native customer app on a shared Node.js API.',
    highlights: ['Live order tracking', 'Multi-vendor', 'Role-based access'],
    stack: ['Next.js', 'React Native', 'Node.js', 'Express', 'MongoDB'],
    image: '/images/project-gebetago.png',
    alt: 'GebetaGo food delivery dashboard and mobile app interface',
    github: 'https://github.com/melkamu372',
    demo: 'https://github.com/melkamu372',
  },
  {
    name: 'Expense Manager',
    tag: 'Product',
    description:
      'A personal finance tracker that turns raw transactions into clear monthly insight — budgets, recurring detection, category analytics and exportable reports, all in a fast dashboard.',
    highlights: ['Budget analytics', 'Recurring detection', 'CSV export'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
    image: '/images/project-expense.png',
    alt: 'Expense manager dashboard with spending charts',
    github: 'https://github.com/melkamu372',
    demo: 'https://github.com/melkamu372',
  },
  {
    name: 'SACCO Management Platform',
    tag: 'Enterprise',
    description:
      'A savings and credit cooperative platform handling member records, share contributions, loan applications and approval workflows with a full audit trail and admin reporting.',
    highlights: ['Loan workflows', 'Audit trail', 'Member portal'],
    stack: ['Next.js', 'TypeScript', 'Express', 'MongoDB', 'Docker'],
    image: '/images/project-sacco.png',
    alt: 'SACCO management platform admin interface with member table',
    github: 'https://github.com/melkamu372',
    demo: 'https://github.com/melkamu372',
  },
]

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden
        className="animate-float-slower pointer-events-none absolute top-40 -right-24 -z-10 size-[26rem] rounded-full bg-primary/8 blur-[130px]"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work, shipped end to end"
          description="Products where I owned the architecture, the interface and everything in between."
        />

        <div className="mt-14 flex flex-col gap-6">
          {projects.map((project, i) => (
            <Reveal
              as="article"
              key={project.name}
              delay={i * 80}
              className="group glass overflow-hidden rounded-3xl transition-all duration-500 hover:border-primary/40"
            >
              <div
                className={`grid gap-0 lg:grid-cols-2 ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative aspect-16/10 overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent lg:bg-gradient-to-r"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-background/70 px-3 py-1 font-mono text-[10px] tracking-widest text-primary uppercase backdrop-blur-sm">
                    {project.tag}
                  </span>
                </div>

                <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                      {project.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {project.highlights.map((h) => (
                      <li
                        key={h}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs text-primary"
                      >
                        <span
                          aria-hidden
                          className="size-1 rounded-full bg-primary"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      Tech stack
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-lg border border-border px-2.5 py-1 text-xs text-foreground/85"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <GithubIcon className="size-4" />
                      GitHub
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      Live Demo
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
