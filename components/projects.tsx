import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { GithubIcon } from '@/components/brand-icons'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/content/projects'

export function Projects() {
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
              delay={i * 80}
              className="group surface overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div
                className={`grid lg:grid-cols-2 ${
                  i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="bg-muted relative aspect-16/10 overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="bg-background/90 text-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide">
                    {project.tag}
                  </span>
                </div>

                <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
                  <div>
                    <h3 className="text-2xl tracking-tight text-balance sm:text-[1.75rem]">
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
                        className="bg-accent text-accent-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
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
                          className="border-border text-foreground/85 rounded-md border px-2.5 py-1 text-xs"
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
                        className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
                      >
                        Live Demo
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="border-border hover:bg-secondary focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
