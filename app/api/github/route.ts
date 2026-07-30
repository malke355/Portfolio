import { NextResponse } from 'next/server'
import { fetchGitHubSummary, GITHUB_REVALIDATE_SECONDS } from '@/lib/github'

// Next parses segment config statically, so this has to be a literal — an
// imported constant fails the build with "Invalid segment configuration".
export const revalidate = 3600

export async function GET() {
  const summary = await fetchGitHubSummary()

  // A GitHub outage is not an application error. Answer 200 with
  // { available: false } so the client can degrade instead of retrying.
  return NextResponse.json(summary, {
    headers: {
      'Cache-Control': `public, s-maxage=${GITHUB_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  })
}
