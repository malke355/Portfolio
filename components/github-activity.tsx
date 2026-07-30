import { GitFork, Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { GithubIcon } from '@/components/brand-icons'
import { fetchGitHubSummary } from '@/lib/github'
import { socials } from '@/lib/site'

function relativeTime(iso: string) {
  const days = Math.round((Date.now() - Date.parse(iso)) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months} months ago`
  return `${Math.round(months / 12)} years ago`
}

export async function GithubActivity() {
  // Fetched on the server so the numbers are in the initial HTML — a stats
  // panel that pops in after hydration reads as a widget bolted on, rather
  // than as part of the page.
  const summary = await fetchGitHubSummary()

  // The section is an enhancement over the curated projects above it. If
  // GitHub is unreachable, drop it rather than showing an error to a visitor
  // who cannot act on it.
  if (!summary.available) return null

  const metrics = [
    { label: 'Public repos', value: String(summary.publicRepos) },
    { label: 'Stars earned', value: String(summary.totalStars) },
    { label: 'Followers', value: String(summary.followers) },
    { label: 'On GitHub since', value: String(summary.joinedYear) },
  ]

  return (
    <section
      id="github"
      className="border-border relative scroll-mt-24 border-t py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Open source"
          title="Live from my GitHub"
          description="Pulled from the GitHub API when this page was built, not typed in by hand — so it cannot go stale."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-5">
            <Reveal className="glass rounded-3xl p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-5">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-primary text-3xl font-semibold tracking-tight">
                      {metric.value}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              {summary.languages.length > 0 && (
                <div className="border-border mt-7 border-t pt-6">
                  <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
                    Most used languages
                  </p>
                  <div className="bg-secondary mt-3 flex h-2 overflow-hidden rounded-full">
                    {summary.languages.map((language, index) => (
                      <span
                        key={language.name}
                        title={`${language.name} · ${language.percent}%`}
                        style={{
                          width: `${language.percent}%`,
                          opacity: 1 - index * 0.13,
                        }}
                        className="bg-primary block h-full"
                      />
                    ))}
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {summary.languages.map((language) => (
                      <li
                        key={language.name}
                        className="text-muted-foreground text-xs"
                      >
                        {language.name}{' '}
                        <span className="text-foreground/70">
                          {language.percent}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={socials.github.href}
                target="_blank"
                rel="noreferrer noopener"
                className="border-border hover:border-primary/50 hover:text-primary focus-visible:ring-ring mt-7 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
              >
                <GithubIcon className="size-4" />
                {socials.github.handle}
              </a>
            </Reveal>
          </div>

          <ul className="flex flex-col gap-3">
            {summary.repos.map((repo, index) => (
              <Reveal
                as="li"
                key={repo.name}
                delay={index * 70}
                spotlight
                // The spotlight inherits its radius, so it has to match the
                // card it sits over.
                className="rounded-2xl"
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glass hover:border-primary/40 focus-visible:ring-ring group flex h-full flex-col gap-2 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="group-hover:text-primary min-w-0 truncate font-mono text-sm font-medium transition-colors">
                      {repo.name}
                    </h3>
                    <span className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5" />
                        {repo.stars}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="size-3.5" />
                        {repo.forks}
                      </span>
                    </span>
                  </div>

                  {repo.description && (
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {repo.description}
                    </p>
                  )}

                  <p className="text-muted-foreground mt-auto flex items-center gap-2 font-mono text-[11px]">
                    {repo.language && (
                      <>
                        <span className="bg-primary size-1.5 rounded-full" />
                        {repo.language}
                        <span aria-hidden>·</span>
                      </>
                    )}
                    updated {relativeTime(repo.pushedAt)}
                  </p>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
