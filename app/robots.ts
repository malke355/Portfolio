import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

/** Written out as a file at build time so the static export can serve it. */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  }
}
