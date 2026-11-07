'use client'

import { ArrowUpRight, ExternalLink, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { GithubIcon } from '@/components/brand-icons'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { TiltCard } from '@/components/tilt-card'
import { projects, type Project } from '@/content/projects'

/** Outcome line derived only from existing project fields — never invented. */
function outcomeLine(project: Project) {
  return project.highlights.join(' · ')
}

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!active) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [active])

  return (
    <section id="projects" className="relative scroll-mt-24 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work, shipped end to end"
          description="Products where I owned the architecture, the interface and everything in between."
        />

        <div className="mt-12 flex flex-col gap-10 lg:gap-14">
          {projects.map((project, i) => (
            <Reveal
              as="article"
              key={project.slug}
              delay={i * 100}
              variant={i % 2 === 0 ? 'left' : 'right'}
              className="group"
            >
              <TiltCard
                maxTilt={5}
                className="surface card-lift overflow-hidden rounded-2xl shadow-sm"
              >
                <div
                  className={`grid lg:grid-cols-2 ${
                    i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(project)}
                    className="bg-muted focus-visible:ring-ring relative aspect-16/10 overflow-hidden text-left focus-visible:ring-2 focus-visible:outline-none lg:aspect-auto lg:min-h-[22rem]"
                    aria-label={`Open details for ${project.name}`}
                  >
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden
                      className="from-background/0 via-background/0 to-background/35 absolute inset-0 bg-gradient-to-t opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div className="tilt-shine" />
                    <span className="bg-background/90 text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                      {String(i + 1).padStart(2, '0')} · {project.tag}
                    </span>
                  </button>

                  <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
                    <div>
                      <p className="text-primary text-[11px] font-medium tracking-wide uppercase">
                        {outcomeLine(project)}
                      </p>
                      <h3 className="group-hover:text-primary mt-2 text-2xl tracking-tight text-balance transition-colors duration-300 sm:text-[1.75rem]">
                        {project.name}
                      </h3>
                      <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-[15px]">
                        {project.description}
                      </p>
                    </div>

                    <ul className="flex flex-wrap gap-2">
                      {project.highlights.map((h) => (
                        <li
                          key={h}
                          className="bg-accent text-accent-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-transform duration-300 hover:-translate-y-0.5"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div>
                      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                        Tech stack
                      </p>
                      <ul className="mt-2.5 flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <li
                            key={tech}
                            className="border-border text-foreground/85 hover:border-primary/40 rounded-md border px-2.5 py-1 text-xs transition-colors"
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
                          className="btn-sheen bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-95 focus-visible:ring-2 focus-visible:outline-none"
                        >
                          Live Demo
                          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      )}
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="border-border hover:bg-secondary focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-[transform,colors] duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <GithubIcon className="size-4" />
                        GitHub
                      </a>
                      <button
                        type="button"
                        onClick={() => setActive(project)}
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full px-2 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        Details
                        <ExternalLink className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-90 grid place-items-end bg-black/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setActive(null)}
        >
          <div
            className="border-border bg-surface-elevated animate-in fade-in slide-in-from-bottom-4 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border shadow-lg duration-300 sm:max-w-2xl sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="bg-muted relative aspect-16/9">
              <Image
                src={active.image}
                alt={active.alt}
                fill
                sizes="(max-width: 640px) 100vw, 42rem"
                className="object-cover object-top"
              />
              <button
                type="button"
                onClick={() => setActive(null)}
                className="bg-background/90 focus-visible:ring-ring absolute top-3 right-3 grid size-9 place-items-center rounded-full shadow-sm focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Close project details"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4 p-6 sm:p-8">
              <div>
                <p className="text-primary text-[11px] font-medium tracking-wide uppercase">
                  {active.tag}
                </p>
                <h3
                  id={titleId}
                  className="mt-1 text-2xl tracking-tight text-balance"
                >
                  {active.name}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {active.description}
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {active.highlights.map((item) => (
                  <li
                    key={item}
                    className="bg-accent text-accent-foreground rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap gap-2">
                {active.stack.map((tech) => (
                  <li
                    key={tech}
                    className="border-border rounded-md border px-2.5 py-1 text-xs"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                {active.links.demo ? (
                  <a
                    href={active.links.demo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-sheen bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
                  >
                    Live Demo
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
                <a
                  href={active.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border-border inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium"
                >
                  <GithubIcon className="size-4" />
                  GitHub
                </a>
                <Link
                  href={`/projects/${active.slug}`}
                  className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
                  onClick={() => setActive(null)}
                >
                  Full case page
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
