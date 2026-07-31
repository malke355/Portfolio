import type { MetadataRoute } from 'next'
import { absoluteUrl, site } from '@/lib/site'

/**
 * Manifest paths are not rewritten by basePath the way metadata icons are, so
 * these are absolute — otherwise they break when served from a subdirectory.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: absoluteUrl('/'),
    display: 'standalone',
    background_color: '#0a0f0c',
    theme_color: '#0a0f0c',
    icons: [
      { src: absoluteUrl('/icon.svg'), sizes: 'any', type: 'image/svg+xml' },
      {
        src: absoluteUrl('/apple-icon.png'),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
