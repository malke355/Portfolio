import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { socials } from '@/lib/site'
import { cn } from '@/lib/utils'

export const socialLinks = [
  { ...socials.github, Icon: GithubIcon },
  { ...socials.linkedin, Icon: LinkedinIcon },
  { ...socials.email, Icon: Mail },
] as const

export function isExternal(href: string) {
  return href.startsWith('http')
}

const variants = {
  glass: 'border-border bg-background size-10 border',
  outline: 'size-9 border border-border',
} as const

type SocialLinksProps = {
  variant?: keyof typeof variants
  className?: string
}

export function SocialLinks({
  variant = 'glass',
  className,
}: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-2.5', className)}>
      {socialLinks.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={isExternal(href) ? '_blank' : undefined}
            rel={isExternal(href) ? 'noreferrer noopener' : undefined}
            className={cn(
              'text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-ring grid place-items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none',
              variants[variant],
            )}
          >
            <Icon className="size-4.5" />
            <span className="sr-only">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
