import { ArrowLeft, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { PrintButton } from '@/components/print-button'
import { education } from '@/content/experience'
import { bio, currentFocus } from '@/content/profile'
import { projects } from '@/content/projects'
import { skillGroups } from '@/content/skills'
import { site, socials } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Résumé',
  description: `Résumé of ${site.name}, ${site.role} — experience, skills, selected projects and education.`,
  alternates: { canonical: '/resume' },
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-primary border-border mb-4 border-b pb-2 font-mono text-xs tracking-[0.2em] uppercase print:text-black">
      {children}
    </h2>
  )
}

export default function ResumePage() {
  const summary = bio[0]

  return (
    <main id="main" className="py-16 print:py-0">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 print:max-w-none print:px-0">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" />
            Back to portfolio
          </Link>
          <PrintButton className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:outline-none" />
        </div>

        <article className="print-sheet flex flex-col gap-9">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {site.name}
            </h1>
            <p className="text-primary mt-1.5 text-base print:text-black">
              {site.role}
            </p>

            <ul className="text-muted-foreground mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm print:text-black">
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {site.location}
              </li>
              <li>
                <a
                  href={socials.email.href}
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <Mail className="size-3.5" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={socials.github.href}
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <GithubIcon className="size-3.5" />
                  {socials.github.handle}
                </a>
              </li>
              <li>
                <a
                  href={socials.linkedin.href}
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <LinkedinIcon className="size-3.5" />
                  {socials.linkedin.handle}
                </a>
              </li>
            </ul>
          </header>

          <section>
            <SectionTitle>Summary</SectionTitle>
            <p className="text-foreground/85 text-sm leading-relaxed print:text-black">
              {summary}
            </p>
            <p className="text-muted-foreground mt-2 text-sm print:text-black">
              Currently: {currentFocus.toLowerCase()}.
            </p>
          </section>

          <section>
            <SectionTitle>Skills</SectionTitle>
            <dl className="flex flex-col gap-2.5">
              {skillGroups.map((group) => (
                <div
                  key={group.id}
                  className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4"
                >
                  <dt className="text-foreground text-sm font-medium print:text-black">
                    {group.title}
                  </dt>
                  <dd className="text-muted-foreground text-sm print:text-black">
                    {group.items.join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <SectionTitle>Selected projects</SectionTitle>
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <div key={project.slug} className="break-inside-avoid">
                  <h3 className="text-sm font-semibold print:text-black">
                    {project.name}
                    <span className="text-muted-foreground font-normal print:text-black">
                      {' '}
                      · {project.tag}
                    </span>
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed print:text-black">
                    {project.description}
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-xs print:text-black">
                    {project.stack.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="break-inside-avoid">
            <SectionTitle>Education</SectionTitle>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-sm font-semibold print:text-black">
                {education.field}
                <span className="text-muted-foreground font-normal print:text-black">
                  {' '}
                  · {education.institution}
                </span>
              </h3>
              <p className="text-muted-foreground font-mono text-xs print:text-black">
                {education.year} · {education.status}
              </p>
            </div>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed print:text-black">
              {education.body}
            </p>
          </section>

          <footer className="text-muted-foreground border-border border-t pt-4 text-xs print:text-black">
            Generated from {site.url.replace(/^https?:\/\//, '')} — always the
            current version.
          </footer>
        </article>
      </div>
    </main>
  )
}
