import Link from 'next/link'
import { SocialLinks } from '@/components/social-links'

export function SiteFooter() {
  return (
    <footer className="border-border border-t py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 sm:px-6 md:flex-row">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Dev. Melkamu
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/resume"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Résumé
          </Link>
          <SocialLinks variant="outline" />
        </div>
      </div>
    </footer>
  )
}
