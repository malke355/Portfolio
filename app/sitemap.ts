import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { absoluteUrl } from '@/lib/site'

/** Written out as a file at build time so the static export can serve it. */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteUrl('/resume'),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ]
}
