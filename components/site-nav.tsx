'use client'

import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export function SiteNav() {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] },
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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Main"
        className={cn(
          'mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500',
          scrolled
            ? 'glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]'
            : 'border border-transparent',
        )}
      >
        <a
          href="#home"
          className="group focus-visible:ring-ring flex items-center gap-2.5 rounded-lg px-1 py-1 focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="bg-primary/15 text-primary ring-primary/30 grid size-8 place-items-center rounded-lg font-mono text-xs font-semibold ring-1 transition-transform duration-300 group-hover:scale-105">
            MT
          </span>
          <span className="text-sm font-medium tracking-tight">
            Melkamu<span className="text-muted-foreground">.dev</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
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
                    'bg-primary absolute inset-x-3 -bottom-0.5 h-px transition-transform duration-300 ease-out',
                    active === link.id ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="bg-primary text-primary-foreground focus-visible:ring-ring hidden rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_var(--primary)] focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="border-border text-foreground hover:bg-secondary grid size-9 place-items-center rounded-xl border transition-colors md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-5xl overflow-hidden rounded-2xl p-2 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-colors',
                    active === link.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {link.label}
                  <span className="text-muted-foreground font-mono text-[10px]">
                    0{links.indexOf(link) + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
