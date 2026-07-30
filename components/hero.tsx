import { ArrowRight, Mail, MapPin, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { SocialLinks } from '@/components/social-links'
import { currentFocus } from '@/content/profile'
import { heroStack } from '@/content/skills'
import { site } from '@/lib/site'

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28"
    >
      {/* ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-40" />
        <div className="animate-float-slow bg-primary/12 absolute -top-32 -left-24 size-[26rem] rounded-full blur-[110px]" />
        <div className="animate-float-slower bg-primary/8 absolute top-24 -right-20 size-[22rem] rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <Reveal>
            <span className="glass text-muted-foreground inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
              <Sparkles className="text-primary size-3.5" />
              {site.tagline}
              <span className="border-border text-primary ml-1 flex items-center gap-1.5 border-l pl-2">
                <span className="bg-primary size-1.5 animate-pulse rounded-full" />
                {site.availability}
              </span>
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Hi, I&apos;m </span>
              <span className="text-primary">{site.name}.</span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
              {site.summary}
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="group bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:outline-none"
              >
                View Projects
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="glass hover:border-primary/40 hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
              >
                Contact Me
                <Mail className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={290}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <SocialLinks />
              <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                <MapPin className="text-primary size-3.5" />
                {site.locationNote}
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140} className="relative">
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div
              aria-hidden
              className="bg-primary/10 absolute -inset-6 -z-10 rounded-[2.5rem] blur-3xl"
            />
            <div className="glass relative overflow-hidden rounded-[2rem] p-2">
              <div className="relative aspect-4/5 overflow-hidden rounded-[1.6rem]">
                <Image
                  src="/images/hero-portrait.png"
                  alt={`Portrait of ${site.name}, full-stack developer`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="from-background via-background/10 absolute inset-0 bg-gradient-to-t to-transparent"
                />
              </div>

              <div className="glass absolute bottom-5 left-5 rounded-2xl px-4 py-3">
                <p className="text-primary font-mono text-[11px] tracking-widest uppercase">
                  currently
                </p>
                <p className="mt-1 text-sm font-medium">{currentFocus}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* tech marquee */}
      <Reveal delay={340} className="mt-16">
        <div className="border-border relative overflow-hidden border-y py-4">
          <div
            aria-hidden
            className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent"
          />
          <div
            aria-hidden
            className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent"
          />
          <div className="animate-marquee flex w-max items-center gap-10 pr-10">
            {[...heroStack, ...heroStack].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="text-muted-foreground font-mono text-xs tracking-[0.2em] whitespace-nowrap uppercase"
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
