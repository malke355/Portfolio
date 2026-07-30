import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GithubIcon } from '@/components/brand-icons'
import { Reveal } from '@/components/reveal'
import { ScrollProgress } from '@/components/scroll-progress'
import { SiteFooter } from '@/components/site-footer'
import { findProject, projects } from '@/content/projects'
import { absoluteUrl, site } from '@/lib/site'

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = findProject(slug)

  if (!project) return { title: 'Project not found' }

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: 'article',
      title: `${project.name} — ${site.name}`,
      description: project.description,
      url: absoluteUrl(`/projects/${project.slug}`),
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = findProject(slug)
  if (!project) notFound()

  const index = projects.findIndex((entry) => entry.slug === project.slug)
  const previous = index > 0 ? projects[index - 1] : undefined
  const next = index < projects.length - 1 ? projects[index + 1] : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: absoluteUrl(`/projects/${project.slug}`),
    author: { '@type': 'Person', name: site.name },
    keywords: project.stack.join(', '),
  }

  return (
    <>
      <ScrollProgress />

      <main id="main" className="pt-24 pb-24 sm:pt-32">
        <div
          aria-hidden
          className="ambient-layer pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]"
        >
          <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-40" />
          <div className="bg-primary/10 absolute -top-24 left-1/4 size-[24rem] rounded-full blur-[120px]" />
        </div>

        <article className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <Link
              href="/#projects"
              className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" />
              All projects
            </Link>
          </Reveal>

          <Reveal delay={60}>
            <p className="text-primary mt-8 font-mono text-xs tracking-[0.25em] uppercase">
              {project.tag}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              {project.name}
            </h1>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed text-pretty sm:text-lg">
              {project.description}
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-8 flex flex-wrap gap-3">
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:outline-none"
            >
              Live demo
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="border-border hover:border-primary/50 hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
            >
              <GithubIcon className="size-4" />
              Source
            </a>
          </Reveal>

          <Reveal
            delay={160}
            className="glass mt-12 overflow-hidden rounded-3xl p-2"
          >
            <div className="relative aspect-16/10 overflow-hidden rounded-[1.4rem]">
              <Image
                src={project.image}
                alt={project.alt}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <Reveal className="glass rounded-3xl p-6 sm:p-8" spotlight>
              <h2 className="text-lg font-medium">What it does</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="text-foreground/85 flex gap-3 text-sm leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal
              delay={80}
              className="glass rounded-3xl p-6 sm:p-8"
              spotlight
            >
              <h2 className="text-lg font-medium">Built with</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="border-border bg-secondary/50 text-foreground/90 rounded-lg border px-2.5 py-1.5 text-xs"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <nav
            aria-label="Other projects"
            className="border-border mt-16 grid gap-3 border-t pt-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className="glass hover:border-primary/40 focus-visible:ring-ring group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                  <ArrowLeft className="size-3" />
                  Previous
                </span>
                <span className="group-hover:text-primary mt-2 block text-sm font-medium transition-colors">
                  {previous.name}
                </span>
              </Link>
            ) : (
              <span />
            )}

            {next && (
              <Link
                href={`/projects/${next.slug}`}
                className="glass hover:border-primary/40 focus-visible:ring-ring group rounded-2xl p-5 text-right transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none sm:col-start-2"
              >
                <span className="text-muted-foreground flex items-center justify-end gap-2 font-mono text-[10px] tracking-widest uppercase">
                  Next
                  <ArrowRight className="size-3" />
                </span>
                <span className="group-hover:text-primary mt-2 block text-sm font-medium transition-colors">
                  {next.name}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
