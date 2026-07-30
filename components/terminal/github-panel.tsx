'use client'

import { GitFork, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { GitHubSummary, GitHubUnavailable } from '@/app/api/github/route'

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: GitHubSummary }
  | { status: 'error'; reason: string }

function relativeTime(iso: string) {
  const days = Math.round((Date.now() - Date.parse(iso)) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(months / 12)}y ago`
}

export function GithubPanel() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/github', { signal: controller.signal })
      .then((response) => response.json())
      .then((payload: GitHubSummary | GitHubUnavailable) => {
        setState(
          payload.available
            ? { status: 'ready', data: payload }
            : { status: 'error', reason: payload.reason },
        )
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          reason: error instanceof Error ? error.message : 'Request failed.',
        })
      })

    return () => controller.abort()
  }, [])

  if (state.status === 'loading') {
    return (
      <p className="text-muted-foreground animate-pulse font-mono text-xs">
        Fetching live GitHub data…
      </p>
    )
  }

  if (state.status === 'error') {
    return <p className="text-destructive font-mono text-xs">{state.reason}</p>
  }

  const { data } = state

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: 'repos', value: data.publicRepos },
          { label: 'stars', value: data.totalStars },
          { label: 'followers', value: data.followers },
          { label: 'since', value: data.joinedYear },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border-border/70 bg-secondary/40 rounded-lg border px-3 py-2"
          >
            <p className="text-primary font-mono text-base font-semibold">
              {stat.value}
            </p>
            <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {data.languages.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-widest uppercase">
            languages by repo count
          </p>
          <div className="bg-secondary flex h-1.5 overflow-hidden rounded-full">
            {data.languages.map((language, index) => (
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
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {data.languages.map((language) => (
              <span
                key={language.name}
                className="text-muted-foreground font-mono text-[11px]"
              >
                {language.name}{' '}
                <span className="text-foreground/60">{language.percent}%</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
          top repositories
        </p>
        {data.repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="border-border/70 hover:border-primary/40 hover:bg-secondary/40 focus-visible:ring-ring group flex items-baseline justify-between gap-3 rounded-lg border px-3 py-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="min-w-0">
              <span className="group-hover:text-primary block truncate font-mono text-xs">
                {repo.name}
              </span>
              {repo.description && (
                <span className="text-muted-foreground line-clamp-1 block text-[11px]">
                  {repo.description}
                </span>
              )}
            </span>
            <span className="text-muted-foreground flex shrink-0 items-center gap-2.5 font-mono text-[11px]">
              {repo.language && <span>{repo.language}</span>}
              <span className="inline-flex items-center gap-1">
                <Star className="size-3" />
                {repo.stars}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="size-3" />
                {repo.forks}
              </span>
              <span className="hidden sm:inline">
                {relativeTime(repo.pushedAt)}
              </span>
            </span>
          </a>
        ))}
      </div>

      <p className="text-muted-foreground font-mono text-[10px]">
        Live from api.github.com · cached 1h · fetched{' '}
        {new Date(data.fetchedAt).toLocaleTimeString()}
      </p>
    </div>
  )
}
