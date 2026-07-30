'use client'

import { Mail, MapPin, Send } from 'lucide-react'
import { useState } from 'react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'

const channels = [
  {
    label: 'Email',
    value: 'melkamu372@gmail.com',
    href: 'mailto:melkamu372@gmail.com',
    Icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: '/in/melkamu-teshome',
    href: 'https://www.linkedin.com/in/melkamu-teshome',
    Icon: LinkedinIcon,
  },
  {
    label: 'GitHub',
    value: '@melkamu372',
    href: 'https://github.com/melkamu372',
    Icon: GithubIcon,
  },
]

const inputClass =
  'w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-300 focus:border-primary/60 focus:ring-2 focus:ring-ring focus:outline-none'

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    setStatus('sending')
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)

    window.setTimeout(() => {
      window.location.href = `mailto:melkamu372@gmail.com?subject=${subject}&body=${body}`
      setStatus('sent')
      form.reset()
    }, 500)
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 border-t border-border py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute bottom-0 left-1/4 -z-10 size-[24rem] rounded-full bg-primary/8 blur-[130px]"
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
                    className="text-xs font-medium tracking-wide text-muted-foreground"
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
                    className="text-xs font-medium tracking-wide text-muted-foreground"
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
                  className="text-xs font-medium tracking-wide text-muted-foreground"
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
                  className="text-xs font-medium tracking-wide text-muted-foreground"
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
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_var(--primary)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
                >
                  {status === 'sending' ? 'Opening mail…' : 'Send message'}
                  <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <p
                  aria-live="polite"
                  className="text-xs text-muted-foreground"
                >
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
                  target={
                    channel.href.startsWith('http') ? '_blank' : undefined
                  }
                  rel={
                    channel.href.startsWith('http')
                      ? 'noreferrer noopener'
                      : undefined
                  }
                  className="glass flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25">
                    <channel.Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      {channel.label}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {channel.value}
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}

            <Reveal delay={280} className="glass rounded-2xl p-5">
              <p className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="size-4 text-primary" />
                Addis Ababa, Ethiopia
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Available for remote work across EMEA and US time zones, with
                overlap hours for standups and pairing.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
