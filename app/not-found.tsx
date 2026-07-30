import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { projects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <main
        id="main"
        className="relative flex min-h-[75vh] items-center overflow-hidden py-24"
      >
        <div
          aria-hidden
          className="ambient-layer pointer-events-none absolute inset-0 -z-10"
        >
          <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-40" />
          <div className="bg-primary/10 absolute top-0 left-1/3 size-[26rem] rounded-full blur-[130px]" />
        </div>

        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <p className="text-primary font-mono text-xs tracking-[0.3em] uppercase">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            That page does not exist
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            The link may be out of date. Here is everything worth looking at.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" />
              Back home
            </Link>
          </div>

          <ul className="border-border mt-12 flex flex-col gap-2 border-t pt-8">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="glass hover:border-primary/40 focus-visible:ring-ring group flex items-baseline justify-between gap-4 rounded-xl px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="group-hover:text-primary text-sm font-medium transition-colors">
                    {project.name}
                  </span>
                  <span className="text-muted-foreground shrink-0 font-mono text-[11px]">
                    {project.tag}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
