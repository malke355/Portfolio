'use client'

import { MapPin, Send } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { isExternal, socialLinks } from '@/components/social-links'
import { remoteNote } from '@/content/profile'
import { site } from '@/lib/site'

/** Email first, then the profile links. */
const channels = [
  socialLinks[2],
  socialLinks[1],
  socialLinks[0],
] as (typeof socialLinks)[number][]

const inputClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-200 focus:border-primary/50 focus:ring-2 focus:ring-ring focus:outline-none'

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const topic = String(data.get('subject') ?? '').trim()

    setStatus('sending')
    const subject = encodeURIComponent(
      topic ? `${topic} — from ${name}` : `Portfolio enquiry from ${name}`,
    )
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)

    window.setTimeout(() => {
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
      setStatus('sent')
      form.reset()
    }, 500)
  }

  return (
    <section
      id="contact"
      className="border-border bg-surface relative scroll-mt-24 border-t py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          description="Open to full-stack roles, internships and freelance projects. I usually reply within a day."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <Reveal className="surface rounded-2xl p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-foreground text-xs font-medium"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-foreground text-xs font-medium"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subject"
                  className="text-foreground text-xs font-medium"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  placeholder="Project, role or collaboration"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-foreground text-xs font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me a little about what you're building…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
                >
                  {status === 'sending' ? 'Opening mail…' : 'Send message'}
                  <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
                <p aria-live="polite" className="text-muted-foreground text-xs">
                  {status === 'sent'
                    ? "Thanks! Your mail client should be open — I'll reply shortly."
                    : 'Opens your mail app with a pre-filled message.'}
                </p>
              </div>
            </form>
          </Reveal>

          <div className="flex flex-col gap-3">
            {channels.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 70}>
                <a
                  href={channel.href}
                  target={isExternal(channel.href) ? '_blank' : undefined}
                  rel={
                    isExternal(channel.href) ? 'noreferrer noopener' : undefined
                  }
                  className="surface focus-visible:ring-ring flex items-center gap-4 rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:outline-none sm:p-5"
                >
                  <span className="bg-accent text-accent-foreground grid size-10 shrink-0 place-items-center rounded-xl">
                    <channel.Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      {channel.label}
                    </span>
                    <span className="text-muted-foreground block truncate text-sm">
                      {channel.handle}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}

            <Reveal delay={220} className="surface-muted rounded-2xl p-5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="text-primary size-4" />
                {site.location}
              </p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {remoteNote}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
