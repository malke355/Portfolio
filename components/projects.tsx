import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { GithubIcon } from '@/components/brand-icons'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

import { projects } from '@/content/projects'

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-24 lg:py-32">
      <div
        aria-hidden
        className="animate-float-slower bg-primary/8 ambient-layer pointer-events-none absolute top-40 -right-24 -z-10 size-[26rem] rounded-full blur-[130px]"
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
              key={project.slug}
              delay={i * 80}
              className="group glass hover:border-primary/40 overflow-hidden rounded-3xl transition-all duration-500"
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
                    className="from-card/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent lg:bg-gradient-to-r"
                  />
                  <span className="bg-background/70 text-primary absolute top-4 left-4 rounded-full px-3 py-1 font-mono text-[10px] tracking-widest uppercase backdrop-blur-sm">
                    {project.tag}
                  </span>
                </div>

                <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {project.highlights.map((h) => (
                      <li
                        key={h}
                        className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs"
                      >
                        <span
                          aria-hidden
                          className="bg-primary size-1 rounded-full"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div>
                    <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                      Tech stack
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="border-border text-foreground/85 rounded-lg border px-2.5 py-1 text-xs"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:outline-none"
                      >
                        Live Demo
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="border-border hover:border-primary/50 hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <GithubIcon className="size-4" />
                      GitHub
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
