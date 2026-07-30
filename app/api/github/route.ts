import { NextResponse } from 'next/server'
import { site } from '@/lib/site'

/** Refetch at most hourly; GitHub profile stats do not move faster than that. */
export const revalidate = 3600

type GitHubUser = {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  followers: number
  public_repos: number
  created_at: string
}

type GitHubRepo = {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string
  fork: boolean
  archived: boolean
}

export type GitHubSummary = {
  available: true
  handle: string
  name: string
  bio: string | null
  url: string
  avatarUrl: string
  followers: number
  publicRepos: number
  joinedYear: number
  totalStars: number
  repos: {
    name: string
    description: string | null
    url: string
    stars: number
    forks: number
    language: string | null
    pushedAt: string
  }[]
  languages: { name: string; count: number; percent: number }[]
  fetchedAt: string
}

export type GitHubUnavailable = {
  available: false
  handle: string
  reason: string
}

function headers() {
  const base: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub rejects unauthenticated requests without a User-Agent.
    'User-Agent': 'melkamu-portfolio',
  }
  // Unauthenticated callers get 60 requests/hour, which one busy afternoon
  // can exhaust; a token raises it to 5000.
  if (process.env.GITHUB_TOKEN) {
    base.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return base
}

function summarise(user: GitHubUser, allRepos: GitHubRepo[]): GitHubSummary {
  const owned = allRepos.filter((repo) => !repo.fork && !repo.archived)

  const languageCounts = new Map<string, number>()
  for (const repo of owned) {
    if (!repo.language) continue
    languageCounts.set(
      repo.language,
      (languageCounts.get(repo.language) ?? 0) + 1,
    )
  }
  const languageTotal = [...languageCounts.values()].reduce((a, b) => a + b, 0)

  return {
    available: true,
    handle: user.login,
    name: user.name ?? user.login,
    bio: user.bio,
    url: user.html_url,
    avatarUrl: user.avatar_url,
    followers: user.followers,
    publicRepos: user.public_repos,
    joinedYear: new Date(user.created_at).getUTCFullYear(),
    totalStars: owned.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    repos: owned
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          Date.parse(b.pushed_at) - Date.parse(a.pushed_at),
      )
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        pushedAt: repo.pushed_at,
      })),
    languages: [...languageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        count,
        percent: languageTotal ? Math.round((count / languageTotal) * 100) : 0,
      })),
    fetchedAt: new Date().toISOString(),
  }
}

export async function GET() {
  const handle = site.handle

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${handle}`, {
        headers: headers(),
        next: { revalidate },
      }),
      fetch(
        `https://api.github.com/users/${handle}/repos?per_page=100&sort=pushed`,
        { headers: headers(), next: { revalidate } },
      ),
    ])

    if (!userResponse.ok) {
      // A failure here is not an application error — the panel is an
      // enhancement, so report it as data and let the UI degrade.
      const reason =
        userResponse.status === 404
          ? `No GitHub account found for @${handle}.`
          : userResponse.status === 403
            ? 'GitHub rate limit reached. Set GITHUB_TOKEN to raise it.'
            : `GitHub responded ${userResponse.status}.`

      return NextResponse.json<GitHubUnavailable>(
        { available: false, handle, reason },
        { status: 200 },
      )
    }

    const user = (await userResponse.json()) as GitHubUser
    const repos = reposResponse.ok
      ? ((await reposResponse.json()) as GitHubRepo[])
      : []

    return NextResponse.json(summarise(user, repos), {
      headers: {
        'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=86400`,
      },
    })
  } catch {
    return NextResponse.json<GitHubUnavailable>(
      { available: false, handle, reason: 'Could not reach GitHub.' },
      { status: 200 },
    )
  }
}
