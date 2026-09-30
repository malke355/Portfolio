const isDev = process.env.NODE_ENV === 'development'

/**
 * GitHub Pages serves a project repo from a subdirectory and cannot run a Node
 * server, so the Pages build is a fully static export mounted under /Portfolio.
 * Local `npm run dev` leaves this off and behaves normally.
 */
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const basePath = isGithubPages ? '/Portfolio' : ''

// Exposed to the client bundle so the image loader can prefix asset URLs.
process.env.NEXT_PUBLIC_BASE_PATH = basePath

/**
 * Next.js inlines a bootstrap script and Tailwind injects style tags, so
 * 'unsafe-inline' is unavoidable here. The value of this policy is the
 * allowlist: it pins every origin the page may talk to.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    ...(isGithubPages
      ? {
          // Custom loader returns the public file URL with /Portfolio prefixed.
          // Required for static export (no /_next/image optimizer on Pages).
          loader: 'custom',
          loaderFile: './lib/image-loader.js',
        }
      : {
          unoptimized: process.env.NEXT_PUBLIC_UNOPTIMIZED_IMAGES === '1',
        }),
  },
  ...(isGithubPages
    ? {
        output: 'export',
        basePath,
        // Emits every route as a directory with an index.html. Without it a
        // static host has no file to serve for /resume.
        trailingSlash: true,
      }
    : {
        async headers() {
          return [{ source: '/(.*)', headers: securityHeaders }]
        },
      }),
}

export default nextConfig
