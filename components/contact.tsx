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
  'w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-300 focus:border-primary/60 focus:ring-2 focus:ring-ring focus:outline-none'

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
      className="border-border relative scroll-mt-24 border-t py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="animate-float-slow bg-primary/8 pointer-events-none absolute bottom-0 left-1/4 -z-10 size-[24rem] rounded-full blur-[130px]"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          description="Open to full-stack roles, freelance projects and AI product collaborations. I usually reply within a day."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Reveal className="glass rounded-3xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-muted-foreground text-xs font-medium tracking-wide"
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
                    className="text-muted-foreground text-xs font-medium tracking-wide"
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
                  className="text-muted-foreground text-xs font-medium tracking-wide"
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
                  className="text-muted-foreground text-xs font-medium tracking-wide"
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
                  className="group bg-primary text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
                >
                  {status === 'sending' ? 'Opening mail…' : 'Send message'}
                  <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <p aria-live="polite" className="text-muted-foreground text-xs">
                  {status === 'sent'
                    ? "Thanks! Your mail client should be open — I'll reply shortly."
                    : 'Your message opens in your mail app, pre-filled and ready to send.'}
                </p>
              </div>
            </form>
          </Reveal>

          <div className="flex flex-col gap-4">
            {channels.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 90}>
                <a
                  href={channel.href}
                  target={isExternal(channel.href) ? '_blank' : undefined}
                  rel={
                    isExternal(channel.href) ? 'noreferrer noopener' : undefined
                  }
                  className="glass hover:border-primary/40 focus-visible:ring-ring flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="bg-primary/12 text-primary ring-primary/25 grid size-11 shrink-0 place-items-center rounded-xl ring-1">
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

            <Reveal delay={280} className="glass rounded-2xl p-5">
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
