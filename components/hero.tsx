import { ArrowRight, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { SocialLinks } from '@/components/social-links'
import { TerminalTrigger } from '@/components/terminal/terminal-trigger'
import { currentFocus } from '@/content/profile'
import { heroStack } from '@/content/skills'
import { site } from '@/lib/site'

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pb-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)] opacity-50" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal>
            <div className="border-border bg-surface-elevated text-muted-foreground inline-flex flex-wrap items-center gap-2 rounded-full border px-3 py-1.5 text-xs">
              <span className="bg-primary size-1.5 rounded-full" />
              {site.availability}
              <span className="border-border hidden border-l pl-2 sm:inline">
                {site.role}
              </span>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-6 text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Hi, I&apos;m <span className="text-primary">{site.name}</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
              {site.summary}
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="group bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
              >
                View projects
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <TerminalTrigger variant="full" />
              <a
                href="#contact"
                className="border-border hover:bg-secondary focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Contact
                <Mail className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <SocialLinks />
              <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                <MapPin className="size-3.5" />
                {site.locationNote}
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100} className="relative">
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="surface relative overflow-hidden rounded-2xl p-2 shadow-md">
              <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                <Image
                  src="/images/hero-portrait.png"
                  alt={`Portrait of ${site.name}, full-stack developer`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover object-top"
                />
              </div>

              <div className="border-border bg-background/95 absolute inset-x-3 bottom-3 rounded-xl border px-4 py-3 backdrop-blur-sm">
                <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                  Currently
                </p>
                <p className="mt-1 text-sm font-medium">{currentFocus}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={280} className="mt-16 sm:mt-20">
        <div
          aria-hidden
          className="border-border relative overflow-hidden border-y py-4"
        >
          <div
            aria-hidden
            className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent sm:w-24"
          />
          <div
            aria-hidden
            className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent sm:w-24"
          />
          <div className="animate-marquee flex w-max items-center gap-10 pr-10">
            {[...heroStack, ...heroStack].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="text-muted-foreground text-xs font-medium tracking-[0.18em] whitespace-nowrap uppercase"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
