import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/melkamu372',
    Icon: GithubIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/melkamu-teshome',
    Icon: LinkedinIcon,
  },
  { label: 'Email', href: 'mailto:melkamu372@gmail.com', Icon: Mail },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Melkamu Teshome. Built with Next.js and
          Tailwind CSS.
        </p>

        <ul className="flex items-center gap-2.5">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={
                  href.startsWith('http') ? 'noreferrer noopener' : undefined
                }
                className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Icon className="size-4" />
                <span className="sr-only">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
