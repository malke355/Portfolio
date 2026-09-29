'use client'

import { FileText, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { TerminalTrigger } from '@/components/terminal/terminal-trigger'
import { ThemeToggle } from '@/components/theme-toggle'
import { navLinks as links, site } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteNav() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
        scrolled || open
          ? 'bg-background/90 border-border border-b shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <a
          href="#home"
          className="group focus-visible:ring-ring flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg font-mono text-xs font-semibold">
            {site.initials}
          </span>
          <span className="text-sm font-medium tracking-tight">
            Melkamu<span className="text-muted-foreground">.dev</span>
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'page' : undefined}
                className={cn(
                  'focus-visible:ring-ring relative rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  active === link.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'bg-primary absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full transition-transform duration-300 ease-out',
                    active === link.id ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/resume"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              Résumé
              <FileText className="size-3.5" />
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <TerminalTrigger />
          <ThemeToggle />
          <a
            href="#contact"
            className="bg-primary text-primary-foreground focus-visible:ring-ring hidden rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="border-border text-foreground hover:bg-secondary grid size-9 place-items-center rounded-lg border transition-colors md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-border bg-background border-t md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors',
                    active === link.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/resume"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors"
              >
                Résumé
                <FileText className="size-3.5" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
