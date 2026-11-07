'use client'

import { Award, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { achievements } from '@/content/achievements'
import { cn } from '@/lib/utils'

export function Achievements() {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const featured = achievements[0]

  if (!featured) return null

  return (
    <section
      id="achievements"
      className="border-border relative scroll-mt-24 border-t py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Achievements"
          title="Recognition for building with AI"
          description="Verified awards from events Melkamu has competed in — facts taken from the certificates themselves."
        />

        <Reveal
          variant="scale"
          spotlight
          className="achievement-card surface card-lift group relative mt-12 overflow-hidden rounded-2xl shadow-sm"
        >
          <div
            aria-hidden
            className="achievement-glow pointer-events-none absolute inset-0 opacity-70"
          />

          <div className="relative grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <button
              type="button"
              onClick={() => setLightbox(featured.image)}
              className="bg-muted focus-visible:ring-ring relative aspect-4/3 overflow-hidden focus-visible:ring-2 focus-visible:outline-none lg:aspect-auto lg:min-h-[22rem]"
              aria-label={`View full ${featured.title}`}
            >
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </button>

            <div className="relative flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="achievement-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
                  <Award className="size-3.5" />
                  {featured.place}
                </span>
                <span className="text-muted-foreground text-xs">
                  {featured.dates}
                </span>
              </div>

              <div>
                <h3 className="text-2xl tracking-tight text-balance sm:text-[1.75rem]">
                  {featured.event}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-[15px]">
                  {featured.summary}
                </p>
              </div>

              <p className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                <MapPin className="size-3.5" />
                {featured.venue} · {featured.city}
              </p>

              <dl className="border-border grid gap-3 border-t pt-4 text-sm">
                <div>
                  <dt className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    Partners named on the certificate
                  </dt>
                  <dd className="mt-1 font-medium">
                    {featured.partners.join(' · ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    Signed by
                  </dt>
                  <dd className="mt-1 font-medium">
                    {featured.signedBy.name}
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      · {featured.signedBy.title}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-90 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview"
          onClick={() => setLightbox(null)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setLightbox(null)
          }}
        >
          <button
            type="button"
            className="sr-only"
            onClick={() => setLightbox(null)}
          >
            Close
          </button>
          <div
            className={cn(
              'relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl shadow-lg',
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt={featured.alt}
              width={1062}
              height={774}
              className="h-auto w-full"
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
