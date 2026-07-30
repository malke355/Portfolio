import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { TerminalProvider } from '@/components/terminal/terminal-provider'
import { absoluteUrl, site, siteUrl, socials } from '@/lib/site'
import { bootScript } from '@/lib/theme'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: socials.github.href }],
  creator: site.name,
  keywords: [...site.keywords],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    siteName: site.name,
    locale: 'en_US',
    url: absoluteUrl('/'),
    title: site.title,
    description: site.summary,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfdfb' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f0c' },
  ],
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: absoluteUrl('/'),
  email: `mailto:${site.email}`,
  image: absoluteUrl('/images/hero-portrait.png'),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Addis Ababa',
    addressCountry: 'ET',
  },
  sameAs: [socials.github.href, socials.linkedin.href],
  knowsAbout: [
    'React',
    'Next.js',
    'React Native',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'Docker',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Applies the stored theme and decides whether to skip the intro,
          // both before first paint. Without this the page renders light and
          // then flips, which is jarring.
          dangerouslySetInnerHTML={{ __html: bootScript }}
        />
      </head>
      <body className="font-sans antialiased">
        <div aria-hidden className="grain" />
        <a
          href="#main"
          className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200 focus:rounded-xl focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <TerminalProvider>{children}</TerminalProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
